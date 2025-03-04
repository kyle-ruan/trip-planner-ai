import { ChatOpenAI } from "@langchain/openai"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import { initializeAgentExecutorWithOptions } from "langchain/agents"
import path from "path"
import { createActivityTool } from "../tools/activityTool"
import { createBudgetTool } from "../tools/budgetTool"
import { createFlightTool } from "../tools/flightTool"
import { createHotelTool } from "../tools/hotelTool"
import { createWeatherTool } from "../tools/weatherTool"
import { AgentAction } from "../types"
import { logWithColor } from "../utils/logger"

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../../client/build")))

// Configure OpenAI with reduced verbosity
const chat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4-turbo",
  verbose: false
})

// Create the tools
const flightTool = createFlightTool(chat)
const weatherTool = createWeatherTool(chat)
const hotelTool = createHotelTool(chat)
const activityTool = createActivityTool(chat)
const budgetTool = createBudgetTool(chat)

// API endpoint for trip planning
app.post("/api/plan-trip", async (req, res) => {
  try {
    const {
      destinations,
      startDate,
      endDate,
      departureCity,
      budget,
      travelers
    } = req.body

    // Validate input
    if (
      !destinations ||
      !startDate ||
      !endDate ||
      !departureCity ||
      !budget ||
      !travelers
    ) {
      return res.status(400).json({ error: "Missing required parameters" })
    }

    // Log the start of trip planning
    logWithColor(
      `🚀 Starting Trip Planner for ${destinations.join(" → ")}`,
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

    // Initialize the agent
    const executor = await initializeAgentExecutorWithOptions(
      [flightTool, weatherTool, hotelTool, activityTool, budgetTool],
      chat,
      {
        agentType: "openai-functions",
        verbose: false
      }
    )

    // Create an array to store the agent's thinking process
    const agentThoughts: string[] = []

    // Run the agent
    logWithColor(`🤖 Asking AI to plan the trip...`, "blue", true)
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
            const thought = `🧠 Using tool ${action.tool} with input: ${action.toolInput}`
            logWithColor(thought, "yellow", true)
            agentThoughts.push(thought)
            return undefined
          }
        }
      ]
    })

    // Log the final plan
    logWithColor(`✨ Final Trip Plan: ${result.output}`, "green", true)

    // Return the result
    res.json({
      plan: result.output,
      thoughts: agentThoughts
    })
  } catch (error: any) {
    console.error("Error planning trip:", error)
    res
      .status(500)
      .json({
        error: error.message || "An error occurred while planning the trip"
      })
  }
})

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"))
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

export default app
