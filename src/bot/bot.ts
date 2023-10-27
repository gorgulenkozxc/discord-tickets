import { IntentsBitField } from 'discord.js'
import { Client } from 'discordx'

import { createErrorEmbed } from './helpers'
import { captureError } from './utils'

export const bot = new Client({
  intents: [
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]
})

// Выполнение команд с обработкой ошибок
bot.on('interactionCreate', async (interaction) => {
  try {
    await bot.executeInteraction(interaction)
  } catch (error) {
    const incidentId = captureError(error)

    if (!interaction.isRepliable()) {
      return
    }

    const embed = createErrorEmbed(
      incidentId,
      undefined,
      error instanceof Error ? error : undefined
    )

    if (interaction.replied) {
      await interaction.followUp({
        embeds: [embed]
      })
    } else {
      await interaction.reply({
        ephemeral: true,
        embeds: [embed]
      })
    }
  }
})
