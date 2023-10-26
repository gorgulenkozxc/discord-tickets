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

    await interaction.followUp({
      embeds: [
        createErrorEmbed(
          incidentId,
          undefined,
          error instanceof Error ? error : undefined
        )
      ]
    })
  }
})
