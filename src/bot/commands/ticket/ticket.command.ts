import {
  ApplicationCommandOptionType,
  CommandInteraction,
  channelMention,
  EmbedBuilder,
  userMention
} from 'discord.js'
import { SlashOption, SlashGroup, Discord, Slash } from 'discordx'

import { TicketService } from '../../../services/ticket.service'
import { ticketAutocomplete, timestamp } from '../../utils'
import { rootGroupName } from './constants'
import { Color } from '../../../constants'

@SlashGroup(rootGroupName)
@SlashGroup({
  description: 'Управление тикетами',
  name: rootGroupName
})
@Discord()
export class TicketCommand {
  private readonly ticketService = new TicketService()

  @Slash({
    description: 'Получить транскрипт тикета',
    name: 'transcript'
  })
  public async transcript(
    @SlashOption({
      type: ApplicationCommandOptionType.Integer,
      description: 'ID тикета',
      required: true,
      name: 'id'
    })
    id: number
  ) {
    //
  }

  @Slash({
    description: 'Показать список тикетов',
    name: 'list'
  })
  public async list(
    @SlashOption({
      description: 'ID участника, канала, или тикета',
      type: ApplicationCommandOptionType.String,
      autocomplete: ticketAutocomplete,
      required: true,
      name: 'id'
    })
    id: string,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply({
      ephemeral: true
    })

    const tickets = await this.ticketService.getListByUnknownId({ id })
    if (!tickets.length) {
      return await interaction.followUp({
        content: `Тикеты с id ${id} не найдены`
      })
    }

    const by = {
      channel: tickets.every((t) => t.channelId === id),
      user: tickets.every((t) => t.userId === id)
    }

    const embed = new EmbedBuilder()
      .setDescription(
        tickets.length > 1
          ? 'Список тикетов'
          : 'Тикет' +
              (by.user
                ? ` ${
                    interaction.guild?.members.cache.get(id)
                      ? 'участника'
                      : 'пользователя'
                  } ${userMention(id)}`
                : by.channel
                ? ` в канале ${channelMention(id)}`
                : '')
      )
      .setColor(Color.Yellow)

    for (const ticket of tickets) {
      embed.addFields({
        value: `${channelMention(ticket.channelId)} ${
          by.user ? '' : userMention(ticket.userId)
        } ${timestamp(ticket.createdAt)}`.trim(),
        name: ticket.id
      })
    }

    await interaction.followUp({ embeds: [embed] })
  }

  @Slash({
    description: 'Закрыть тикет',
    name: 'close'
  })
  public async close(
    @SlashOption({
      description: 'ID тикета (оставить пустым, чтобы закрыть текущий)',
      type: ApplicationCommandOptionType.Integer,
      required: false,
      name: 'id'
    })
    id: number | null,
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      description: 'Причина закрытия',
      required: false,
      name: 'reason'
    })
    reason: string | null,
    interaction: CommandInteraction
  ) {
    //
  }
}
