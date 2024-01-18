import {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  CommandInteraction,
  ThreadChannel,
  EmbedBuilder,
  userMention,
  TextChannel,
  GuildMember,
  User
} from 'discord.js'
import { SlashOption, SlashGroup, Discord, Slash } from 'discordx'

import { TicketService } from '../../../services/ticket.service'
import { rootGroupName } from './constants'
import { Color } from '../../../constants'

const groupName = 'member'

function buildEmbed({
  add = true,
  moderator,
  target
}: {
  target: GuildMember
  moderator: User
  add?: boolean
}) {
  return new EmbedBuilder()
    .setAuthor({
      iconURL: target.displayAvatarURL(),
      name: target.user.tag
    })
    .setColor(add ? Color.Green : Color.Red)
    .setTitle(
      add ? 'Добавление участника в тикет' : 'Удаление участника из тикета'
    )
    .addFields({
      value: userMention(moderator.id),
      name: 'Модератор',
      inline: true
    })
    .addFields({
      value: userMention(target.id),
      name: 'Участник',
      inline: true
    })
}

@SlashGroup(groupName, rootGroupName)
@SlashGroup({
  description: 'Управление участниками тикета',
  root: rootGroupName,
  name: groupName
})
@Discord()
export class TicketMemberCommand {
  private readonly ticketService = new TicketService()

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
    @SlashOption({
      description: 'Выдать права на просмотр канала-категории',
      type: ApplicationCommandOptionType.Boolean,
      required: false,
      name: 'force'
    })
    force: boolean,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply({
      ephemeral: true
    })

    const ticket = await this.ticketService.getOne({
      channelId: interaction.channelId
    })

    if (!ticket) {
      return await interaction.followUp({
        content: 'Используйте эту команду в канале, который является тикетом'
      })
    }

    const channel = interaction.channel as ThreadChannel
    const categoryChannel = channel.parent as TextChannel

    if (await channel.members.fetch(target.id).catch(() => null)) {
      return await interaction.followUp({
        content: `${target} уже есть в тикете`
      })
    }

    if (
      !categoryChannel
        .permissionsFor(target)
        .has(PermissionFlagsBits.ViewChannel)
    ) {
      if (!force) {
        return await interaction.followUp({
          content: `У ${target} нет прав на просмотр канала-категории ${categoryChannel}`
        })
      }
      categoryChannel.permissionOverwrites.create(target, {
        ViewChannel: true
      })
    }

    await channel.members.add(target) // also creates undeletable system message
    interaction.deleteReply()
    channel.send({
      embeds: [
        buildEmbed({
          moderator: interaction.user,
          target
        })
      ]
    })
  }

  @Slash({
    description: 'Удалить участника из тикета',
    name: 'remove'
  })
  public async remove(
    @SlashOption({
      type: ApplicationCommandOptionType.Mentionable,
      description: 'Кого удалить',
      required: true,
      name: 'target'
    })
    target: GuildMember,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply({
      ephemeral: true
    })

    const ticket = await this.ticketService.getOne({
      channelId: interaction.channelId
    })

    if (!ticket) {
      return await interaction.followUp({
        content: 'Используйте эту команду в канале, который является тикетом'
      })
    }

    const channel = interaction.channel as ThreadChannel
    // possible feature: delete categoryChannel permission overwrites if
    // a) there were any b) it was the last user's ticket in the category

    if (!(await channel.members.fetch(target.id).catch(() => null))) {
      return await interaction.followUp({
        content: `${target} нет в тикете`
      })
    }

    await channel.members.remove(target.id) // also creates undeletable system message
    interaction.deleteReply()
    channel.send({
      embeds: [
        buildEmbed({
          moderator: interaction.user,
          add: false,
          target
        })
      ]
    })
  }
}
