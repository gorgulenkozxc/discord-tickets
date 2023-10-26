import { randomUUID } from 'crypto'
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'

export abstract class EntityBase {
  @PrimaryColumn('uuid')
  public id = randomUUID()

  @CreateDateColumn()
  public createdAt = new Date()

  @UpdateDateColumn()
  public updatedAt = new Date()

  @DeleteDateColumn()
  public deletedAt?: Date
}
