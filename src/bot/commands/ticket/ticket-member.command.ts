import {
  CommandInteractionResolvedData,
  ApplicationCommandOptionType,
  CommandInteraction,
  GuildMember
} from 'discord.js'
import { SlashOption, SlashGroup, Discord, Slash } from 'discordx'

import { rootGroupName } from './constants'

const groupName = 'member'

@SlashGroup(groupName, rootGroupName)
@SlashGroup({
  description: 'Управление участниками тикета',
  root: rootGroupName,
  name: groupName
})
@Discord()
export class TicketMemberCommand {
  @Slash({
    description: 'Добавить участника в тикет',
    name: 'add'
  })
  public async add(
    @SlashOption({
      type: ApplicationCommandOptionType.Mentionable,
      description: 'Кого добавить',
      name: 'target',
      required: true
    })
    target: GuildMember,
    interaction: CommandInteraction
  ) {
    //
  }

  @Slash({
    description: 'Удалить участника из тикета',
    name: 'delete'
  })
  public async delete(
    @SlashOption({
      type: ApplicationCommandOptionType.Mentionable,
      description: 'Кого удалить',
      required: true,
      name: 'target'
    })
    target: GuildMember,
    interaction: CommandInteractionResolvedData
  ) {
    //
  }
}
