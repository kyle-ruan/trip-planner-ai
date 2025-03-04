import { ChatOpenAI } from "@langchain/openai"
import dotenv from "dotenv"
import { initializeAgentExecutorWithOptions } from "langchain/agents"
import { createActivityTool } from "./tools/activityTool"
import { createBudgetTool } from "./tools/budgetTool"
import { createFlightTool } from "./tools/flightTool"
import { createHotelTool } from "./tools/hotelTool"
import { createWeatherTool } from "./tools/weatherTool"
import { AgentAction } from "./types"
import { getLogFilePath, logWithColor } from "./utils/logger"

// Load environment variables
dotenv.config()

// Configure OpenAI with reduced verbosity
const chat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4-turbo",
  verbose: false // Disable verbose logging from OpenAI
})

/**
 * Enhanced trip planner that handles multi-city trips.
 */
async function runAdvancedTripPlanner(
  destinations: string[],
  startDate: string,
  endDate: string,
  departureCity: string,
  budget: number,
  travelers: number
) {
  logWithColor(
    `🚀 Starting Advanced Trip Planner for ${destinations.join(" → ")}`,
    "green",
    true
  )
  logWithColor(`  From: ${startDate} to ${endDate}`, "green", true)
  logWithColor(`  Departing from: ${departureCity}`, "green", true)
  logWithColor(
    `  Budget: $${budget} for ${travelers} traveler(s)`,
    "green",
    true
  )

  // Create tools
  const flightTool = createFlightTool(chat)
  const weatherTool = createWeatherTool(chat)
  const hotelTool = createHotelTool(chat)
  const activityTool = createActivityTool(chat)
  const budgetTool = createBudgetTool(chat)

  const executor = await initializeAgentExecutorWithOptions(
    [flightTool, weatherTool, hotelTool, activityTool, budgetTool],
    chat,
    {
      agentType: "openai-functions",
      verbose: false // Disable verbose logging from the agent
    }
  )

  logWithColor(`🤖 Asking AI to plan the complex trip...`, "blue", true)

  // Add a callback to log agent's thought process
  const result = await executor.call({
    input: `Plan a multi-city trip to ${destinations.join(
      ", "
    )} between ${startDate} and ${endDate}, departing from ${departureCity}.
            I have a budget of $${budget} for ${travelers} traveler(s).

            For each destination:
            1. Find suitable flights
            2. Check the weather for my stay
            3. Recommend hotels based on ratings and amenities
            4. Suggest activities appropriate for the weather
            5. Provide a budget breakdown

            Make sure to optimize the order of cities to visit based on flight availability and weather conditions.
            If the weather is bad in a particular city, suggest indoor activities or consider changing the order of visits.`,
    callbacks: [
      {
        handleAgentAction: (action: AgentAction) => {
          logWithColor(
            `🧠 AGENT THINKING: Using tool ${action.tool} with input: ${action.toolInput}`,
            "yellow",
            true
          )
          return undefined
        }
      }
    ]
  })

  logWithColor(`✨ Final Trip Plan: ${result.output}`, "green", true)
  logWithColor(`📝 Complete logs saved to: ${getLogFilePath()}`, "blue", true)
}

// Run the advanced trip planner
logWithColor(`🔍 Advanced Trip Planner Application Starting...`, "blue", true)
runAdvancedTripPlanner(
  ["Tokyo", "Kyoto", "Osaka"], // Multiple destinations
  "2025-04-10",
  "2025-04-20",
  "New York",
  3000, // Budget
  2 // Travelers
)
  .then(() =>
    logWithColor(`✅ Trip planning completed successfully!`, "green", true)
  )
  .catch((error) => logWithColor(`❌ Error: ${error.message}`, "red", true))
