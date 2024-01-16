import {
  ApplicationCommandOptionType,
  ModalSubmitInteraction,
  CommandInteraction,
  APIButtonComponent,
  ActionRowBuilder,
  ComponentBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ModalBuilder,
  EmbedBuilder,
  ChannelType,
  TextChannel,
  ButtonStyle,
  APIEmbed
} from 'discord.js'
import {
  ModalComponent,
  SlashOption,
  SlashGroup,
  Discord,
  Slash
} from 'discordx'

import { PanelCategoryService } from '../../../services/panel-category.service'
import { PanelService } from '../../../services/panel.service'
import { panelAutocomplete } from '../../utils'
import { rootGroupName } from './constants'
import { Color } from '../../../constants'

const groupName = 'category'
const createModalId = 'panel-category-create'
const editModalId = 'panel-category-edit'
const modalIdDelimiter = '%'

@SlashGroup(groupName, rootGroupName)
@SlashGroup({
  description: 'Управление категориями панелей',
  root: rootGroupName,
  name: groupName
})
@Discord()
export class PanelCategoryCommand {
  private readonly panelService = new PanelService()
  private readonly panelCategoryService = new PanelCategoryService()

  @Slash({
    description: 'Создать категорию панели (интерактивно)',
    name: 'create'
  })
  public async create(
    @SlashOption({
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText],
      description: 'Канал для тикетов',
      name: 'channel',
      required: true
    })
    channel: TextChannel,
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      autocomplete: panelAutocomplete,
      description: 'Панель',
      required: true,
      name: 'panel'
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
    id: new RegExp(`^${createModalId}`)
  })
  private async createModal(interaction: ModalSubmitInteraction) {
    await interaction.deferReply({
      ephemeral: true
    })

    const [nameInput, slugInput, buttonInput, embedInput] = [
      interaction.fields.getTextInputValue('name'),
      interaction.fields.getTextInputValue('slug'),
      interaction.fields.getTextInputValue('button'),
      interaction.fields.getTextInputValue('embed')
    ]

    if (!nameInput || !slugInput || !buttonInput || !embedInput) {
      await interaction.followUp({
        content: 'Все поля должны быть заполнены'
      })

      return
    }

    const [channelId, panelId] = JSON.parse(
      interaction.customId.split(modalIdDelimiter)[1]
    )
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
      panelId: panel.id,
      name: nameInput,
      slug: slugInput,
      button,
      embed
    })

    await interaction.followUp({
      content: `Категория "${nameInput}" для панели "${panel.name}" успешно создана`,
      ephemeral: true
    })
  }
}
