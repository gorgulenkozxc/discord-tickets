import {
  ApplicationCommandOptionType,
  CommandInteraction,
  CommandInteractionResolvedData,
  GuildMember
} from 'discord.js'
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'

import { rootGroupName } from './constants'

const groupName = 'member'

@SlashGroup(groupName, rootGroupName)
@SlashGroup({
  root: rootGroupName,
  name: groupName,
  description: 'Управление участниками тикета'
})
@Discord()
export class TicketMemberCommand {
  @Slash({
    name: 'add',
    description: 'Добавить участника в тикет'
  })
  public async add(
    @SlashOption({
      type: ApplicationCommandOptionType.Mentionable,
      name: 'target',
      description: 'Кого добавить',
      required: true
    })
    target: GuildMember,
    interaction: CommandInteraction
  ) {
    //
  }

  @Slash({
    name: 'delete',
    description: 'Удалить участника из тикета'
  })
  public async delete(
    @SlashOption({
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
      name: 'target',
      description: 'Кого удалить'
    })
    target: GuildMember,
    interaction: CommandInteractionResolvedData
  ) {
    //
  }
}
