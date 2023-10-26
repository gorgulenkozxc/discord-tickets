import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm'

import { getRepo, Panel } from '../db'

interface IConditionsBase {
  id?: string
  conditions?: FindOptionsWhere<Panel>
}

export interface IGetPanelListParams extends IConditionsBase {
  opts?: FindManyOptions<Panel>
}

export interface IGetOnePanelParams extends IConditionsBase {
  opts?: FindOneOptions<Panel>
}

export class PanelService {
  private readonly repo = getRepo(Panel)

  public async getList(params: IGetPanelListParams = {}): Promise<Panel[]> {
    return this.repo.find({
      where: this.makeConditions(params),
      ...params.opts
    })
  }

  public async getOne(
    params: IGetOnePanelParams = {}
  ): Promise<Panel | undefined> {
    const panel = await this.repo.findOne({
      where: this.makeConditions(params),
      ...params.opts
    })

    return panel ?? undefined
  }

  private makeConditions(params: IConditionsBase): FindOptionsWhere<Panel> {
    const conditions = params.conditions || {}

    if (typeof params.id !== 'undefined') {
      conditions.id = params.id
    }

    return conditions
  }
}
