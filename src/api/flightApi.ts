import { Flight } from "../types"
import { delay, logWithColor } from "../utils/logger"
import { airlines } from "../utils/mockData"

/**
 * Mock function to simulate fetching flight prices with more complex options.
 */
export async function fetchFlights(
  departureCity: string,
  destinationCity: string,
  date: string
): Promise<Flight[]> {
  logWithColor(
    `Fetching flights from ${departureCity} to ${destinationCity} on ${date}...`,
    "blue",
    false
  )

  // Simulate API delay
  await delay(1000)

  // Generate random flights
  const flights: Flight[] = []
  const flightCount = Math.floor(Math.random() * 5) + 3 // 3-7 flights

  for (let i = 0; i < flightCount; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)]
    const flightNumber = `${airline.substring(0, 2).toUpperCase()}${
      Math.floor(Math.random() * 1000) + 100
    }`
    const price = Math.floor(Math.random() * 500) + 200
    const stops = Math.floor(Math.random() * 3) // 0-2 stops

    // Generate departure and arrival times
    const departureHour = Math.floor(Math.random() * 24)
    const departureMinute = Math.floor(Math.random() * 60)
    const durationHours = Math.floor(Math.random() * 10) + 1
    const durationMinutes = Math.floor(Math.random() * 60)

    const departureTime = `${date}T${departureHour
      .toString()
      .padStart(2, "0")}:${departureMinute.toString().padStart(2, "0")}`
    const arrivalDate = new Date(
      new Date(departureTime).getTime() +
        (durationHours * 60 + durationMinutes) * 60000
    )
    const arrivalTime = arrivalDate.toISOString().split(".")[0]

    flights.push({
      airline,
      flightNumber,
      departureCity,
      arrivalCity: destinationCity,
      departureTime,
      arrivalTime,
      price,
      stops,
      duration: `${durationHours}h ${durationMinutes}m`
    })
  }

  return flights
}
