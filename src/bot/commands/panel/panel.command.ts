import {
  ApplicationCommandOptionType,
  ModalSubmitInteraction,
  PermissionFlagsBits,
  CommandInteraction,
  ActionRowBuilder,
  ComponentBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  ModalBuilder,
  TextChannel,
  APIEmbed
} from 'discord.js'
import {
  ModalComponent,
  SlashOption,
  SlashGroup,
  Discord,
  Slash
} from 'discordx'

import { ServerService } from '../../../services/server.service'
import { PanelService } from '../../../services/panel.service'
import { createPanelMessage } from '../../helpers'
import { panelAutocomplete } from '../../utils'
import { Color } from '../../../constants'

const groupName = 'panel'
const createModalId = 'panel-create'
const editModalId = 'panel-edit'

@SlashGroup(groupName)
@SlashGroup({
  defaultMemberPermissions: [PermissionFlagsBits.Administrator],
  description: 'Управление панелями',
  name: groupName
})
@Discord()
export class PanelCommand {
  private readonly panelService = new PanelService()
  private readonly serverService = new ServerService()

  @Slash({
    description: 'Создать панель',
    name: 'create'
  })
  public async create(interaction: CommandInteraction) {
    const modal = new ModalBuilder({
      title: 'Создание панели',
      customId: createModalId
    })

    const fields: ComponentBuilder<any>[] = [
      new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setCustomId('name')
        .setLabel('Название панели')
        .setPlaceholder('К примеру: Поддержка')
        .setRequired(true),
      new TextInputBuilder()
        .setStyle(TextInputStyle.Paragraph)
        .setCustomId('embed')
        .setLabel('Настройки эмбеда')
        .setPlaceholder(
          'Можно указать содержимое эмбеда или JSON объект с полной настройкой.'
        )
        .setRequired(true)
    ]

    for (const component of fields) {
      modal.addComponents(new ActionRowBuilder<any>().addComponents(component))
    }

    await interaction.showModal(modal)
  }

  @Slash({
    description: 'Редактировать панель',
    name: 'edit'
  })
  public async edit() {
    const modal = new ModalBuilder({
      components: [
        //
      ],
      title: 'Редактирование панели',
      customId: editModalId
    })
  }

  @Slash({
    description: 'Удалить панель',
    name: 'delete'
  })
  public async delete(
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      autocomplete: panelAutocomplete,
      description: 'ID панели',
      required: true,
      name: 'id'
    })
    id: string,
    // possible feature: delete all related tickets
    interaction: CommandInteraction
  ) {
    await interaction.deferReply({
      ephemeral: true
    })

    await this.panelService.delete({
      id
    })

    return interaction.followUp({
      content: `Панель "${id}" удалена`
    })
  }

  @Slash({
    description: 'Восстановить эмбед панели',
    name: 'restore'
  })
  public async restore(
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      autocomplete: panelAutocomplete,
      description: 'ID панели',
      required: true,
      name: 'id'
    })
    id: string,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply({
      ephemeral: true
    })

    const panel = await this.panelService.getOne({
      opts: {
        relations: {
          categories: true,
          server: true
        }
      },
      id
    })

    console.log({
      guildId: interaction.guildId,
      panel
    })

    if (!panel || panel.server.guildId !== interaction.guildId) {
      return interaction.followUp({
        content: `Панель "${id}" не найдена`,
        ephemeral: true
      })
    }

    // please review this approach
    // if (!panel.categories.length) {
    //   return interaction.followUp({
    //     content: `Панель "${id}" не имеет категорий и не может быть восстановлена`
    //   })
    // }

    await createPanelMessage(panel, interaction.channel as TextChannel)

    return interaction.followUp({
      content: `Панель "${id}" успешно восстановлена`,
      ephemeral: true
    })
  }

  @ModalComponent({
    id: createModalId
  })
  private async createModal(interaction: ModalSubmitInteraction) {
    await interaction.deferReply({
      ephemeral: true
    })

    const [nameInput, embedInput] = [
      interaction.fields.getTextInputValue('name'),
      interaction.fields.getTextInputValue('embed')
    ]

    if (!nameInput) {
      return interaction.followUp({
        content: 'Название панели не может быть пустым'
      })
    }

    let embed: APIEmbed

    try {
      embed = JSON.parse(embedInput)
    } catch {
      embed = new EmbedBuilder()
        .setTitle(nameInput)
        .setDescription(embedInput)
        .setColor(Color.Blue)
        .toJSON()
    }

    const server = await this.serverService
      .getOne({
        guildId: interaction.guildId!
      })
      .then((server) => {
        return server
          ? server
          : this.serverService.create({ guildId: interaction.guildId! })
      })

    if (!server) {
      throw new Error('Server not found.')
    }

    const panel = await this.panelService.create({
      serverId: server.id,
      name: nameInput,
      embed
    })

    await interaction.followUp({
      content: `Панель "${nameInput}" успешно создана`,
      ephemeral: true
    })
  }

  @ModalComponent({
    id: editModalId
  })
  private async editModal(interaction: ModalSubmitInteraction) {}
}
