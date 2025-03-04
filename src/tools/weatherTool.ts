import { ChatOpenAI } from "@langchain/openai"
import { DynamicTool } from "langchain/tools"
import { fetchWeather } from "../api/weatherApi"
import { logWithColor } from "../utils/logger"

// Define extreme weather conditions that require special handling
const EXTREME_WEATHER_CONDITIONS = [
  "Typhoon",
  "Hurricane",
  "Blizzard",
  "Tornado",
  "Severe Storm"
]

/**
 * Creates a weather check tool for the LangChain agent
 * @param chat The ChatOpenAI instance to use for analysis
 * @returns A DynamicTool for checking weather
 */
export function createWeatherTool(chat: ChatOpenAI): DynamicTool {
  return new DynamicTool({
    name: "checkWeather",
    description:
      "Checks the weather forecast for a destination on a specific date. Input should be a JSON with destination and date.",
    func: async (input: string) => {
      logWithColor(
        `☀️ TOOL CALLED: checkWeather with input: ${input}`,
        "yellow",
        true
      )

      try {
        const { destination, date } = JSON.parse(input)
        const weather = await fetchWeather(destination, date)

        // Check if this is extreme weather
        const isExtremeWeather = EXTREME_WEATHER_CONDITIONS.includes(
          weather.condition
        )

        if (isExtremeWeather) {
          logWithColor(
            `  ⚠️ Extreme weather detected: ${weather.condition} in ${destination}`,
            "red",
            true
          )
        }

        // Call LLM to interpret the weather data with appropriate prompt based on conditions
        logWithColor(`  ↪ Interpreting weather data...`, "blue", false)

        const systemPrompt = isExtremeWeather
          ? `You are a weather and safety expert. The forecast shows EXTREME WEATHER (${weather.condition}) for ${destination}.
             Provide a detailed safety assessment and travel advisory. Include:
             1. The severity and potential dangers of the weather condition
             2. Whether travel should be postponed or canceled
             3. Safety precautions if travel is absolutely necessary
             4. Alternative dates or nearby destinations that might have better weather`
          : "You are a weather expert. Interpret this weather forecast and provide advice for travelers."

        const response = await chat.call([
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Weather forecast for ${destination} on ${date}: ${JSON.stringify(
              weather,
              null,
              2
            )}`
          }
        ])

        logWithColor(`  ✅ checkWeather completed`, "green", true)

        // Add a clear warning prefix for extreme weather
        if (isExtremeWeather) {
          return `⚠️ EXTREME WEATHER ALERT ⚠️\n\n${response.content}`
        }

        return response.content
      } catch (error: any) {
        logWithColor(`  ❌ Error in checkWeather: ${error}`, "red", true)
        return `Error checking weather: ${error.message || String(error)}`
      }
    }
  })
}
