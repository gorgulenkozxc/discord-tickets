import { Discord, SlashGroup } from 'discordx'

import { PanelCategoryService } from '../../../services/panel-category.service'
import { rootGroupName } from './constants'

const groupName = 'category'

@SlashGroup(groupName, rootGroupName)
@SlashGroup({
  root: rootGroupName,
  name: groupName,
  description: 'Управление категориями панелей'
})
@Discord()
export class PanelCategoryCommand {
  private readonly panelCategoryService = new PanelCategoryService()
}
