import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm'

import { getRepo, Server } from '../db'

interface IConditionsBase {
  id?: string
  guildId?: string
  conditions?: FindOptionsWhere<Server>
}

export interface IGetOneServerParams extends IConditionsBase {
  opts?: FindOneOptions<Server>
}

export interface IGetServerListParams extends IConditionsBase {
  opts?: FindManyOptions<Server>
}

export interface ICreateServerParams {
  guildId: string
}

export class ServerService {
  private readonly repo = getRepo(Server)

  public async getOne(
    params: IGetOneServerParams = {}
  ): Promise<Server | undefined> {
    const server = await this.repo.findOne({
      where: this.makeConditions(params),
      ...params.opts
    })

    return server ?? undefined
  }

  public async getList(params: IGetServerListParams = {}): Promise<Server[]> {
    return this.repo.find({
      where: this.makeConditions(params),
      ...params.opts
    })
  }

  public async create(params: ICreateServerParams): Promise<Server> {
    const server = this.repo.create({
      guildId: params.guildId
    })

    await this.repo.insert(server)

    return server
  }

  private makeConditions(params: IConditionsBase): FindOptionsWhere<Server> {
    const conditions = params.conditions || {}

    if (typeof params.id !== 'undefined') {
      conditions.id = params.id
    }

    if (typeof params.guildId !== 'undefined') {
      conditions.guildId = params.guildId
    }

    return conditions
  }
}
