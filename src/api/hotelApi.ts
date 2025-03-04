import { Hotel } from "../types"
import { delay, logWithColor } from "../utils/logger"
import { amenitiesList, hotelNames } from "../utils/mockData"

/**
 * Mock function to simulate fetching hotel options.
 */
export async function fetchHotels(
  destination: string,
  checkInDate: string,
  checkOutDate: string,
  guestCount: number
): Promise<Hotel[]> {
  logWithColor(
    `Fetching hotels in ${destination} from ${checkInDate} to ${checkOutDate} for ${guestCount} guests...`,
    "blue",
    false
  )

  // Simulate API delay
  await delay(1200)

  // Generate random hotels
  const hotels: Hotel[] = []
  const hotelCount = Math.floor(Math.random() * 5) + 3 // 3-7 hotels

  for (let i = 0; i < hotelCount; i++) {
    const name = `${destination} ${
      hotelNames[Math.floor(Math.random() * hotelNames.length)]
    }`
    const pricePerNight = Math.floor(Math.random() * 300) + 50
    const rating = Math.floor(Math.random() * 20 + 30) / 10 // 3.0-5.0 rating

    // Random amenities
    const amenitiesCount = Math.floor(Math.random() * 5) + 3 // 3-7 amenities
    const amenities: string[] = []
    for (let j = 0; j < amenitiesCount; j++) {
      const amenity =
        amenitiesList[Math.floor(Math.random() * amenitiesList.length)]
      if (!amenities.includes(amenity)) {
        amenities.push(amenity)
      }
    }

    hotels.push({
      name,
      location: destination,
      pricePerNight,
      rating,
      amenities,
      availableRooms: Math.floor(Math.random() * 10) + 1
    })
  }

  return hotels
}
