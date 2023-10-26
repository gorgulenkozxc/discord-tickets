import { APIEmbed } from 'discord.js'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { EntityBase } from './common'
import { Panel } from './panel.entity'
import { Ticket } from './ticket.entity'

@Entity('panel-categories')
export class PanelCategory extends EntityBase {
  @Column('text')
  public name!: string

  @Column('text')
  public slug!: string

  @Column('text')
  public buttonName!: string

  @Column('json')
  public helloEmbed!: APIEmbed

  @ManyToOne(() => Panel, (panel) => panel.categories)
  @JoinColumn()
  public panel!: Panel

  @Column('uuid')
  public panelId!: string

  @OneToMany(() => Ticket, (ticket) => ticket.category)
  public tickets!: Ticket[]
}
