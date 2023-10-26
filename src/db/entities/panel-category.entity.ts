import { APIButtonComponent, APIEmbed } from 'discord.js'
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

  @Column('json')
  public button!: APIButtonComponent

  @Column('json')
  public embed!: APIEmbed

  @ManyToOne(() => Panel, (panel) => panel.categories)
  @JoinColumn()
  public panel!: Panel

  @Column('uuid')
  public panelId!: string

  @OneToMany(() => Ticket, (ticket) => ticket.category)
  public tickets!: Ticket[]
}
