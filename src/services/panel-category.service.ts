import { APIButtonComponent, APIEmbed } from 'discord.js'
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

export interface ICreatePanelCategoryParams {
  name: string
  slug: string
  button: APIButtonComponent
  embed: APIEmbed
  panelId: string
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
    const category = await this.repo.findOne({
      where: this.makeConditions(params),
      ...params.opts
    })

    return category ?? undefined
  }

  public async create(
    params: ICreatePanelCategoryParams
  ): Promise<PanelCategory> {
    const category = this.repo.create({
      name: params.name,
      slug: params.slug,
      button: params.button,
      embed: params.embed,
      panelId: params.panelId
    })

    await this.repo.insert(category)

    return category
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
