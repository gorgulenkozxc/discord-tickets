import { AutocompleteInteraction } from 'discord.js'

import { PanelService } from '../../services/panel.service'

export async function panelAutocomplete(
  interaction: AutocompleteInteraction
): Promise<void> {
  const panelService = new PanelService()
  const panels = await panelService.getList({
    conditions: {
      server: {
        guildId: interaction.guildId!
      }
    }
  })

  await interaction.respond(
    panels.map((panel) => ({
      name: panel.name,
      value: panel.id
    }))
  )
}
