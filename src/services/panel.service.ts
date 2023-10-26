import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm'

import { getRepo, Panel } from '../db'

interface IConditionsBase {
  conditions?: FindOptionsWhere<Panel>
}

export interface IGetPanelListParams extends IConditionsBase {
  opts?: FindManyOptions<Panel>
}

export class PanelService {
  private readonly repo = getRepo(Panel)

  public async getList(params: IGetPanelListParams = {}): Promise<Panel[]> {
    return this.repo.find({
      where: this.makeConditions(params),
      ...params.opts
    })
  }

  private makeConditions(params: IConditionsBase): FindOptionsWhere<Panel> {
    const conditions = params.conditions || {}

    return conditions
  }
}
