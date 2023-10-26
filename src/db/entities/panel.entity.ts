import { APIEmbed } from 'discord.js'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { EntityBase } from './common'
import { PanelCategory } from './panel-category.entity'
import { Server } from './server.entity'

@Entity('panels')
export class Panel extends EntityBase {
  @Column('text')
  public name!: string

  @Column('json')
  public embed!: APIEmbed

  @ManyToOne(() => Server, (server) => server.panels)
  @JoinColumn()
  public server!: Server

  @Column('uuid')
  public serverId!: string

  @OneToMany(() => PanelCategory, (category) => category.panel)
  public categories!: PanelCategory[]
}
