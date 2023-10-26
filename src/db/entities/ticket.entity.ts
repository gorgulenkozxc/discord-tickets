import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { EntityBase } from './common'
import { PanelCategory } from './panel-category.entity'

@Entity('tickets')
export class Ticket extends EntityBase {
  @ManyToOne(() => PanelCategory, (category) => category.tickets)
  @JoinColumn()
  public category!: PanelCategory

  @Column('uuid')
  public categoryId!: string
}
