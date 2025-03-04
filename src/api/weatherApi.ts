import { WeatherForecast } from "../types"
import { delay, logWithColor } from "../utils/logger"
import { weatherConditions } from "../utils/mockData"

/**
 * Mock function to simulate fetching weather data with more detailed forecasts.
 */
export async function fetchWeather(
  destination: string,
  date: string
): Promise<WeatherForecast> {
  logWithColor(
    `Fetching weather for ${destination} on ${date}...`,
    "blue",
    false
  )

  // Simulate API delay
  await delay(800)

  // Simulate extreme weather in Kyoto
  if (destination.toLowerCase() === "kyoto") {
    logWithColor(
      `⚠️ WARNING: Extreme weather alert for Kyoto - Typhoon warning issued for the requested dates.`,
      "yellow",
      true
    )

    return {
      date,
      condition: "Typhoon",
      temperature: 22,
      precipitation: 95,
      humidity: 98,
      windSpeed: 120 // Very high wind speed indicating typhoon
    }
  }

  const condition =
    weatherConditions[Math.floor(Math.random() * weatherConditions.length)]

  // Generate random weather data
  const temperature = Math.floor(Math.random() * 35) - 5 // -5 to 30 degrees
  const precipitation = Math.random() * 100
  const humidity = Math.floor(Math.random() * 100)
  const windSpeed = Math.floor(Math.random() * 30)

  return {
    date,
    condition,
    temperature,
    precipitation,
    humidity,
    windSpeed
  }
}
