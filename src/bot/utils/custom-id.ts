export const panelButtonPrefix = 'ticket-create'
export const panelButtonIdPattern = new RegExp(
  `^${panelButtonPrefix}\\-(.+?)+$`
)

/**
 * Создаёт Custom ID кнопки создания тикета
 * @param categoryId ID категории панели
 * @returns Custom ID кнопки создания тикета
 */
export function serializePanelButtonId(categoryId: string): string {
  return `${panelButtonPrefix}-${categoryId}`
}

/**
 * Десериализует Custom ID кнопки создания тикета
 * @param id Custom ID кнопки создания тикета
 * @returns ID категории панели
 */
export function deserializePanelButtonId(id: string): string {
  return id.replace(`${panelButtonPrefix}-`, '')
}

/**
 * Проверяет, является ли Custom ID кнопки создания тикета
 * @param id Custom ID кнопки создания тикета
 * @returns Результат проверки
 */
export function isPanelButtonId(id: string): boolean {
  return id.startsWith(panelButtonPrefix)
}
