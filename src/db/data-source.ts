import { resolve } from 'path'
import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
  type: 'sqlite',
  database: resolve(process.cwd(), './data/db.sqlite'),
  entities: [resolve(__dirname, './entities/*.entity.{ts.js}')]
})
