import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  CommandInteraction,
  ModalBuilder,
  ModalSubmitInteraction
} from 'discord.js'
import {
  Discord,
  ModalComponent,
  Slash,
  SlashGroup,
  SlashOption
} from 'discordx'

import { PanelService } from '../../../services/panel.service'

const groupName = 'panel'
const createModalId = 'panel-create'
const editModalId = 'panel-edit'

@SlashGroup(groupName)
@SlashGroup({
  name: groupName,
  description: 'Управление панелями'
})
@Discord()
export class PanelCommand {
  private readonly panelService = new PanelService()

  @Slash({
    name: 'create',
    description: 'Создать панель'
  })
  public async create(interaction: CommandInteraction) {
    const modal = new ModalBuilder({
      title: 'Создание панели',
      customId: createModalId,
      components: [
        //
      ]
    })
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
      async autocomplete(interaction, command) {
        const panelService = new PanelService()
        const list = await panelService.getList()

        await interaction.respond(
          list.map((panel) => ({
            name: panel.name,
            value: panel.id
          }))
        )
      }
    })
    restore: string,
    interaction: CommandInteraction
  ) {
    //
  }

  @ModalComponent({
    id: createModalId
  })
  private async createModal(interaction: ModalSubmitInteraction) {
    //
  }

  @ModalComponent({
    id: editModalId
  })
  private async editModal(interaction: ModalSubmitInteraction) {
    //
  }
}
