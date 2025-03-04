import { ChatOpenAI } from "@langchain/openai"
import { DynamicTool } from "langchain/tools"
import { fetchFlights } from "../api/flightApi"
import { logWithColor } from "../utils/logger"

/**
 * Creates a flight search tool for the LangChain agent
 * @param chat The ChatOpenAI instance to use for analysis
 * @returns A DynamicTool for finding flights
 */
export function createFlightTool(chat: ChatOpenAI): DynamicTool {
  return new DynamicTool({
    name: "findFlights",
    description:
      "Finds flights between cities on specific dates. Input should be a JSON with departureCity, destinationCity, and date.",
    func: async (input: string) => {
      logWithColor(
        `🛫 TOOL CALLED: findFlights with input: ${input}`,
        "cyan",
        true
      )

      try {
        const { departureCity, destinationCity, date } = JSON.parse(input)
        const flights = await fetchFlights(departureCity, destinationCity, date)

        // Sort flights by price
        flights.sort((a, b) => a.price - b.price)

        // Call LLM to analyze and summarize flight options
        logWithColor(
          `  ↪ Analyzing ${flights.length} flight options...`,
          "blue",
          false
        )
        const response = await chat.call([
          {
            role: "system",
            content:
              "You are a flight expert. Analyze these flight options and provide a summary of the best choices based on price, duration, and number of stops."
          },
          {
            role: "user",
            content: `Here are the flights from ${departureCity} to ${destinationCity} on ${date}: ${JSON.stringify(
              flights,
              null,
              2
            )}`
          }
        ])

        logWithColor(`  ✅ findFlights completed`, "green", true)
        return response.content
      } catch (error) {
        logWithColor(`  ❌ Error in findFlights: ${error}`, "red", true)
        return `Error finding flights: ${error}`
      }
    }
  })
}
