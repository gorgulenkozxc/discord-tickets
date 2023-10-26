import { ButtonInteraction } from 'discord.js'
import { ButtonComponent, Discord } from 'discordx'

import { PanelCategoryService } from '../../services/panel-category.service'
import { deserializePanelButtonId, isPanelButtonId } from '../utils/custom-id'

@Discord()
export class PanelButtonEvents {
  private readonly panelCategoryService = new PanelCategoryService()

  @ButtonComponent()
  public async onButtonInteraction(interaction: ButtonInteraction) {
    if (!isPanelButtonId(interaction.customId)) {
      return
    }

    const panelCategory = await this.panelCategoryService.getOne({
      id: deserializePanelButtonId(interaction.customId)
    })

    if (!panelCategory) {
      throw new Error('Panel category is not found')
    }

    interaction.followUp({
      content: `Создаём тикет в категории ${panelCategory.name}`,
      ephemeral: true
    })
  }
}
