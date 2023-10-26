import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { EntityBase } from './common'
import { PanelCategory } from './panel-category.entity'
import { Server } from './server.entity'

@Entity('panels')
export class Panel extends EntityBase {
  public name!: string

  @ManyToOne(() => Server, (server) => server.panels)
  @JoinColumn()
  public server!: Server

  @Column('uuid')
  public serverId!: string

  @OneToMany(() => PanelCategory, (category) => category.panel)
  public categories!: PanelCategory[]
}
