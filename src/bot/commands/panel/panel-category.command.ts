import {
  ActionRowBuilder,
  APIButtonComponent,
  APIEmbed,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  Channel,
  ChannelType,
  CommandInteraction,
  ComponentBuilder,
  EmbedBuilder,
  GuildBasedChannel,
  ModalBuilder,
  ModalSubmitInteraction,
  TextBasedChannel,
  TextChannel,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js'
import {
  Discord,
  ModalComponent,
  Slash,
  SlashGroup,
  SlashOption
} from 'discordx'

import { Color } from '../../../constants'
import { Panel } from '../../../db'
import { PanelCategoryService } from '../../../services/panel-category.service'
import { PanelService } from '../../../services/panel.service'
import { serializePanelButtonId } from '../../utils'
import { panelAutocomplete } from '../../utils/autocomplete'
import { rootGroupName } from './constants'

const groupName = 'category'
const createModalId = 'panel-category-create'
const editModalId = 'panel-category-edit'

@SlashGroup(groupName, rootGroupName)
@SlashGroup({
  root: rootGroupName,
  name: groupName,
  description: 'Управление категориями панелей'
})
@Discord()
export class PanelCategoryCommand {
  private readonly panelService = new PanelService()
  private readonly panelCategoryService = new PanelCategoryService()

  @Slash({
    name: 'create',
    description: 'Создать категорию панели (интерактивно)'
  })
  public async create(
    @SlashOption({
      type: ApplicationCommandOptionType.Channel,
      name: 'channel',
      description: 'Канал для тикетов',
      channelTypes: [ChannelType.GuildText],
      required: true
    })
    channel: TextChannel,
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      name: 'panel',
      description: 'Панель',
      required: true,
      autocomplete: panelAutocomplete
    })
    panelId: string,
    interaction: CommandInteraction
  ) {
    const modal = new ModalBuilder({
      title: 'Создание категории панели',
      customId: createModalId
    })

    const fields: ComponentBuilder<any>[] = [
      new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setCustomId('name')
        .setLabel('Название категории')
        .setPlaceholder('К примеру: Техническая поддержка')
        .setRequired(true),
      new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setCustomId('slug')
        .setLabel('Короткое название категории')
        .setPlaceholder(
          'Используется в названии тикета. К примеру: tech-support'
        )
        .setRequired(true),
      new TextInputBuilder()
        .setStyle(TextInputStyle.Paragraph)
        .setCustomId('button')
        .setLabel('Настройки кнопки')
        .setPlaceholder(
          'Можно указать название кнопки или JSON объект с полной настройкой.'
        )
        .setRequired(true),
      new TextInputBuilder()
        .setStyle(TextInputStyle.Paragraph)
        .setCustomId('embed')
        .setLabel('Настройки приветственного эмбеда')
        .setPlaceholder(
          'Можно указать содержимое эмбеда или JSON объект с полной настройкой.'
        )
        .setRequired(true),
      new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setCustomId('meta')
        .setLabel('Необходимые данные (оставьте нетронутым)')
        .setPlaceholder('Ну не надо было трогать это поле')
        .setRequired(true)
        .setValue(JSON.stringify([channel.id, panelId]))
    ]

    for (const component of fields) {
      modal.addComponents(new ActionRowBuilder<any>().addComponents(component))
    }

    await interaction.showModal(modal)
  }

  @ModalComponent({
    id: createModalId
  })
  private async createModal(interaction: ModalSubmitInteraction) {
    await interaction.deferReply({
      ephemeral: true
    })

    const [nameInput, slugInput, buttonInput, embedInput, metaInput] = [
      interaction.fields.getTextInputValue('name'),
      interaction.fields.getTextInputValue('slug'),
      interaction.fields.getTextInputValue('button'),
      interaction.fields.getTextInputValue('embed'),
      interaction.fields.getTextInputValue('meta')
    ]

    if (!nameInput || !slugInput || !buttonInput || !embedInput || !metaInput) {
      await interaction.followUp({
        content: 'Все поля должны быть заполнены'
      })

      return
    }

    // bruh
    const [channelId, panelId] = JSON.parse(metaInput)

    const channel = await interaction.guild!.channels.fetch(channelId)
    const panel = await this.panelService.getOne({
      id: panelId
    })

    if (!channel || !channel.isTextBased()) {
      throw new Error("Channel not found or it's not a text channel")
    }

    if (!panel) {
      throw new Error('Panel not found')
    }

    let button: APIButtonComponent
    let embed: APIEmbed

    try {
      button = JSON.parse(buttonInput)
    } catch {
      button = new ButtonBuilder()
        .setLabel(buttonInput)
        .setStyle(ButtonStyle.Primary)
        .toJSON()
    }

    try {
      embed = JSON.parse(embedInput)
    } catch {
      embed = new EmbedBuilder()
        .setTitle(nameInput)
        .setDescription(embedInput)
        .setColor(Color.Blue)
        .toJSON()
    }

    await this.panelCategoryService.create({
      name: nameInput,
      slug: slugInput,
      button,
      embed,
      panelId: panel.id
    })

    await interaction.followUp({
      content: `Категория "${nameInput}" для панели "${panel.name}" успешно создана`,
      ephemeral: true
    })
  }
}
