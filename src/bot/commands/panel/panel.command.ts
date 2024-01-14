import {
  ActionRowBuilder,
  APIEmbed,
  ApplicationCommandOptionType,
  CommandInteraction,
  ComponentBuilder,
  EmbedBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  PermissionFlagsBits,
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
import { PanelService } from '../../../services/panel.service'
import { ServerService } from '../../../services/server.service'
import { createPanelMessage } from '../../helpers'
import { panelAutocomplete } from '../../utils/autocomplete'

const groupName = 'panel'
const createModalId = 'panel-create'
const editModalId = 'panel-edit'

@SlashGroup(groupName)
@SlashGroup({
  name: groupName,
  description: 'Управление панелями',
  defaultMemberPermissions: [PermissionFlagsBits.Administrator]
})
@Discord()
export class PanelCommand {
  private readonly panelService = new PanelService()
  private readonly serverService = new ServerService()

  @Slash({
    name: 'create',
    description: 'Создать панель'
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
    name: 'edit',
    description: 'Редактировать панель'
  })
  public async edit() {
    const modal = new ModalBuilder({
      title: 'Редактирование панели',
      customId: editModalId,
      components: [
        //
      ]
    })
  }

  @Slash({
    name: 'delete',
    description: 'Удалить панель'
  })
  public async delete() {
    //
  }

  @Slash({
    name: 'restore',
    description: 'Восстановить эмбед панели'
  })
  public async restore(
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      name: 'id',
      description: 'ID панели',
      required: true,
      autocomplete: panelAutocomplete
    })
    id: string,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply({
      ephemeral: true
    })

    const panel = await this.panelService.getOne({
      id,
      opts: {
        relations: {
          server: true,
          categories: true
        }
      }
    })

    console.log({
      panel,
      guildId: interaction.guildId
    })

    if (!panel || panel.server.guildId !== interaction.guildId) {
      return interaction.followUp({
        content: `Панель "${id}" не найдена`,
        ephemeral: true
      })
    }

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
      name: nameInput,
      embed,
      serverId: server.id
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
