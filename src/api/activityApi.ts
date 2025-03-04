import { Activity } from "../types"
import { delay, logWithColor } from "../utils/logger"
import { activities } from "../utils/mockData"

/**
 * Function to fetch activities for a destination.
 */
export async function fetchActivities(
  destination: string,
  date: string,
  weatherCondition: string
): Promise<Activity[]> {
  logWithColor(
    `Fetching activities in ${destination} for ${date} with weather: ${weatherCondition}...`,
    "blue",
    false
  )

  // Simulate API delay
  await delay(900)

  // Get activities for the destination or return default ones
  const destinationActivities = activities[destination] || [
    {
      name: "City Tour",
      type: "Sightseeing",
      location: destination,
      price: 30,
      rating: 4.5,
      weatherDependent: true,
      indoorActivity: false
    },
    {
      name: "Local Museum",
      type: "Cultural",
      location: destination,
      price: 15,
      rating: 4.3,
      weatherDependent: false,
      indoorActivity: true
    },
    {
      name: "Shopping Mall",
      type: "Shopping",
      location: destination,
      price: 0,
      rating: 4.0,
      weatherDependent: false,
      indoorActivity: true
    },
    {
      name: "Local Restaurant",
      type: "Food",
      location: destination,
      price: 40,
      rating: 4.6,
      weatherDependent: false,
      indoorActivity: true
    },
    {
      name: "Park Visit",
      type: "Outdoor",
      location: destination,
      price: 0,
      rating: 4.2,
      weatherDependent: true,
      indoorActivity: false
    }
  ]

  return destinationActivities
}
