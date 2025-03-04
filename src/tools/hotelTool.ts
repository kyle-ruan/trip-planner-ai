import { ChatOpenAI } from "@langchain/openai"
import { DynamicTool } from "langchain/tools"
import { fetchHotels } from "../api/hotelApi"
import { logWithColor } from "../utils/logger"

/**
 * Creates a hotel search tool for the LangChain agent
 * @param chat The ChatOpenAI instance to use for analysis
 * @returns A DynamicTool for finding hotels
 */
export function createHotelTool(chat: ChatOpenAI): DynamicTool {
  return new DynamicTool({
    name: "findHotels",
    description:
      "Finds hotels in a destination for specific dates. Input should be a JSON with destination, checkInDate, checkOutDate, and guestCount.",
    func: async (input: string) => {
      logWithColor(
        `🏨 TOOL CALLED: findHotels with input: ${input}`,
        "magenta",
        true
      )

      try {
        const { destination, checkInDate, checkOutDate, guestCount } =
          JSON.parse(input)
        const hotels = await fetchHotels(
          destination,
          checkInDate,
          checkOutDate,
          guestCount
        )

        // Sort hotels by rating (highest first)
        hotels.sort((a, b) => b.rating - a.rating)

        // Call LLM to analyze and recommend hotels
        logWithColor(
          `  ↪ Analyzing ${hotels.length} hotel options...`,
          "blue",
          false
        )
        const response = await chat.call([
          {
            role: "system",
            content:
              "You are a hotel expert. Analyze these hotel options and provide recommendations based on price, rating, and amenities."
          },
          {
            role: "user",
            content: `Here are the hotels in ${destination} from ${checkInDate} to ${checkOutDate} for ${guestCount} guests: ${JSON.stringify(
              hotels,
              null,
              2
            )}`
          }
        ])

        logWithColor(`  ✅ findHotels completed`, "green", true)
        return response.content
      } catch (error) {
        logWithColor(`  ❌ Error in findHotels: ${error}`, "red", true)
        return `Error finding hotels: ${error}`
      }
    }
  })
}
