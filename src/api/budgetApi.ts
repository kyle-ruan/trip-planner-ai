import { BudgetBreakdown } from "../types"
import { delay, logWithColor } from "../utils/logger"

/**
 * Calculate a budget breakdown for a trip
 */
export async function calculateBudget(
  flightCost: number,
  hotelCost: number,
  daysOfStay: number,
  additionalExpensesPerDay: number
): Promise<BudgetBreakdown> {
  logWithColor(
    `Calculating budget for a ${daysOfStay}-day trip...`,
    "blue",
    false
  )

  // Simulate API delay
  await delay(500)

  const totalHotelCost = hotelCost * daysOfStay
  const totalAdditionalExpenses = additionalExpensesPerDay * daysOfStay
  const totalCost = flightCost + totalHotelCost + totalAdditionalExpenses

  return {
    transportation: flightCost,
    accommodation: totalHotelCost,
    food: totalAdditionalExpenses * 0.4,
    activities: totalAdditionalExpenses * 0.4,
    miscellaneous: totalAdditionalExpenses * 0.2,
    total: totalCost
  }
}
