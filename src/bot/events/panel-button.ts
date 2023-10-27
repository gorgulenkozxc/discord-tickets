import { ButtonInteraction } from 'discord.js'
import { ButtonComponent, Discord } from 'discordx'

import { PanelCategoryService } from '../../services/panel-category.service'
import {
  deserializePanelButtonId,
  isPanelButtonId,
  panelButtonIdPattern
} from '../utils/custom-id'

@Discord()
export class PanelButtonEvents {
  private readonly panelCategoryService = new PanelCategoryService()

  @ButtonComponent({
    id: panelButtonIdPattern
  })
  public async onButtonInteraction(interaction: ButtonInteraction) {
    if (!isPanelButtonId(interaction.customId)) {
      return
    }

    await interaction.deferReply({
      ephemeral: true
    })

    const panelCategory = await this.panelCategoryService.getOne({
      id: deserializePanelButtonId(interaction.customId)
    })

    if (!panelCategory) {
      throw new Error('Panel category is not found')
    }

    await interaction.followUp({
      content: `Создаём тикет в категории ${panelCategory.name}`
    })
  }
}
