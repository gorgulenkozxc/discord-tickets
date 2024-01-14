import {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  CommandInteraction
} from 'discord.js'
import { SlashOption, SlashGroup, Discord, Slash } from 'discordx'

import { TicketService } from '../../../services/ticket.service'
import { rootGroupName } from './constants'

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
      name: 'id'
    })
    id: string
  ) {
    //
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
