import { ChatOpenAI } from "@langchain/openai"
import { DynamicTool } from "langchain/tools"
import { fetchActivities } from "../api/activityApi"
import { logWithColor } from "../utils/logger"

/**
 * Creates an activity search tool for the LangChain agent
 * @param chat The ChatOpenAI instance to use for analysis
 * @returns A DynamicTool for finding activities
 */
export function createActivityTool(chat: ChatOpenAI): DynamicTool {
  return new DynamicTool({
    name: "findActivities",
    description:
      "Finds activities for a destination on a specific date, considering the weather. Input should be a JSON with destination, date, and weatherCondition.",
    func: async (input: string) => {
      logWithColor(
        `🎭 TOOL CALLED: findActivities with input: ${input}`,
        "cyan",
        true
      )

      try {
        const { destination, date, weatherCondition } = JSON.parse(input)
        const activities = await fetchActivities(
          destination,
          date,
          weatherCondition
        )

        // Call LLM to recommend activities based on weather
        logWithColor(
          `  ↪ Recommending activities based on weather (${weatherCondition})...`,
          "blue",
          false
        )
        const response = await chat.call([
          {
            role: "system",
            content: `You are a local guide. Recommend activities in ${destination} based on the weather forecast (${weatherCondition}) for ${date}.
                      Prioritize indoor activities if the weather is bad, and outdoor activities if the weather is good.`
          },
          {
            role: "user",
            content: `Here are the available activities in ${destination}: ${JSON.stringify(
              activities,
              null,
              2
            )}`
          }
        ])

        logWithColor(`  ✅ findActivities completed`, "green", true)
        return response.content
      } catch (error) {
        logWithColor(`  ❌ Error in findActivities: ${error}`, "red", true)
        return `Error finding activities: ${error}`
      }
    }
  })
}
