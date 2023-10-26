import { Column, Entity, OneToMany } from 'typeorm'

import { EntityBase } from './common'
import { Panel } from './panel.entity'

@Entity('servers')
export class Server extends EntityBase {
  @Column('bigint')
  public guildId!: string

  @OneToMany(() => Panel, (panel) => panel.server)
  public panels!: Panel[]
}
