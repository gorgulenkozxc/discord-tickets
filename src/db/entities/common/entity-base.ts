import { randomUUID } from 'crypto'
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'

export abstract class EntityBase {
  @PrimaryColumn('uuid')
  public id: string = randomUUID()

  @CreateDateColumn()
  public createdAt: Date = new Date()

  @UpdateDateColumn()
  public updatedAt: Date = new Date()

  @DeleteDateColumn()
  public deletedAt?: Date
}
