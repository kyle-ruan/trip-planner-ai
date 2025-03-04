import { ChatOpenAI } from "@langchain/openai"
import { DynamicTool } from "langchain/tools"
import { calculateBudget } from "../api/budgetApi"
import { logWithColor } from "../utils/logger"

/**
 * Creates a budget calculation tool for the LangChain agent
 * @param chat The ChatOpenAI instance to use for analysis
 * @returns A DynamicTool for calculating trip budgets
 */
export function createBudgetTool(chat: ChatOpenAI): DynamicTool {
  return new DynamicTool({
    name: "calculateBudget",
    description:
      "Calculates a budget breakdown for a trip. Input should be a JSON with flightCost, hotelCost, daysOfStay, and additionalExpensesPerDay.",
    func: async (input: string) => {
      logWithColor(
        `💰 TOOL CALLED: calculateBudget with input: ${input}`,
        "yellow",
        true
      )

      try {
        const { flightCost, hotelCost, daysOfStay, additionalExpensesPerDay } =
          JSON.parse(input)

        const budgetBreakdown = await calculateBudget(
          flightCost,
          hotelCost,
          daysOfStay,
          additionalExpensesPerDay
        )

        // Call LLM to provide budget advice
        logWithColor(
          `  ↪ Creating budget breakdown and recommendations...`,
          "blue",
          false
        )
        const response = await chat.call([
          {
            role: "system",
            content:
              "You are a travel budget expert. Provide a detailed budget breakdown and money-saving tips."
          },
          {
            role: "user",
            content: `Here is the budget breakdown for a ${daysOfStay}-day trip: ${JSON.stringify(
              budgetBreakdown,
              null,
              2
            )}`
          }
        ])

        logWithColor(`  ✅ calculateBudget completed`, "green", true)
        return response.content
      } catch (error) {
        logWithColor(`  ❌ Error in calculateBudget: ${error}`, "red", true)
        return `Error calculating budget: ${error}`
      }
    }
  })
}
