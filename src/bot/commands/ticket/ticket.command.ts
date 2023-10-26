import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js'
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'

import { TicketService } from '../../../services/ticket.service'
import { rootGroupName } from './constants'

@SlashGroup(rootGroupName)
@SlashGroup({
  name: rootGroupName,
  description: 'Управление тикетами'
})
@Discord()
export class TicketCommand {
  private readonly ticketService = new TicketService()

  @Slash({
    name: 'transcript',
    description: 'Получить транскрипт тикета'
  })
  public async transcript(
    @SlashOption({
      type: ApplicationCommandOptionType.Integer,
      name: 'id',
      description: 'ID тикета',
      required: true
    })
    id: number
  ) {
    //
  }

  @Slash({
    name: 'list',
    description: 'Показать список тикетов'
  })
  public async list(
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      name: 'id',
      description: 'ID участника, канала, или тикета'
    })
    id: string
  ) {
    //
  }

  @Slash({
    name: 'close',
    description: 'Закрыть тикет'
  })
  public async close(
    @SlashOption({
      type: ApplicationCommandOptionType.Integer,
      name: 'id',
      description: 'ID тикета (оставить пустым, чтобы закрыть текущий)',
      required: false
    })
    id: number | null,
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      name: 'reason',
      description: 'Причина закрытия',
      required: false
    })
    reason: string | null,
    interaction: CommandInteraction
  ) {
    //
  }
}
