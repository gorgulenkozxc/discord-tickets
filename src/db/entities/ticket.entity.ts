import { JoinColumn, ManyToOne, Column, Entity } from 'typeorm'

import { PanelCategory } from './panel-category.entity'
import { EntityBase } from './common'

@Entity('tickets')
export class Ticket extends EntityBase {
  @ManyToOne(() => PanelCategory, (category) => category.tickets)
  @JoinColumn()
  public category!: PanelCategory

  @Column('uuid')
  public categoryId!: string
}
