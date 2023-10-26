import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm'

import { getRepo, PanelCategory } from '../db'

interface IConditionsBase {
  id?: string
  conditions?: FindOptionsWhere<PanelCategory>
}

export interface IGetPanelCategoryListParams extends IConditionsBase {
  opts?: FindManyOptions<PanelCategory>
}

export interface IGetOnePanelCategoryParams extends IConditionsBase {
  opts?: FindOneOptions<PanelCategory>
}

export class PanelCategoryService {
  private readonly repo = getRepo(PanelCategory)

  public async getList(
    params: IGetPanelCategoryListParams = {}
  ): Promise<PanelCategory[]> {
    return this.repo.find({
      where: this.makeConditions(params),
      ...params.opts
    })
  }

  public async getOne(
    params: IGetOnePanelCategoryParams = {}
  ): Promise<PanelCategory | undefined> {
    const panel = await this.repo.findOne({
      where: this.makeConditions(params),
      ...params.opts
    })

    return panel ?? undefined
  }

  private makeConditions(
    params: IConditionsBase
  ): FindOptionsWhere<PanelCategory> {
    const conditions = params.conditions || {}

    if (typeof params.id !== 'undefined') {
      conditions.id = params.id
    }

    return conditions
  }
}
