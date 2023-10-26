import { randomUUID } from 'crypto'

/**
 * Логирует ошибку в консоль, возвращая ID инцидента
 * @param error Ошибка
 * @param data Дополнительные данные
 * @returns ID инцидента
 */
export function captureError(error: unknown, data?: object): string {
  const incidentId = randomUUID()

  console.error('error captured', {
    incidentId,
    error,
    data
  })

  return incidentId
}
