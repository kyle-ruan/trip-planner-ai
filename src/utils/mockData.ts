import { Activity } from "../types"

// List of destinations
export const destinations = [
  "Tokyo",
  "New York",
  "Paris",
  "Sydney",
  "London",
  "Rome",
  "Bangkok",
  "Dubai",
  "Singapore",
  "Barcelona"
]

// Mock activities for different destinations
export const activities: Record<string, Activity[]> = {
  Tokyo: [
    {
      name: "Tokyo Skytree",
      type: "Sightseeing",
      location: "Sumida",
      price: 20,
      rating: 4.5,
      weatherDependent: false,
      indoorActivity: true
    },
    {
      name: "Meiji Shrine",
      type: "Cultural",
      location: "Shibuya",
      price: 0,
      rating: 4.7,
      weatherDependent: true,
      indoorActivity: false
    },
    {
      name: "Tokyo Disneyland",
      type: "Entertainment",
      location: "Chiba",
      price: 75,
      rating: 4.8,
      weatherDependent: true,
      indoorActivity: false
    },
    {
      name: "Tsukiji Fish Market",
      type: "Food",
      location: "Chuo",
      price: 0,
      rating: 4.6,
      weatherDependent: false,
      indoorActivity: true
    },
    {
      name: "Akihabara Shopping",
      type: "Shopping",
      location: "Chiyoda",
      price: 0,
      rating: 4.4,
      weatherDependent: false,
      indoorActivity: true
    }
  ],
  "New York": [
    {
      name: "Empire State Building",
      type: "Sightseeing",
      location: "Midtown",
      price: 42,
      rating: 4.7,
      weatherDependent: false,
      indoorActivity: true
    },
    {
      name: "Central Park",
      type: "Outdoor",
      location: "Manhattan",
      price: 0,
      rating: 4.8,
      weatherDependent: true,
      indoorActivity: false
    },
    {
      name: "Metropolitan Museum of Art",
      type: "Cultural",
      location: "Upper East Side",
      price: 25,
      rating: 4.8,
      weatherDependent: false,
      indoorActivity: true
    },
    {
      name: "Broadway Show",
      type: "Entertainment",
      location: "Theater District",
      price: 120,
      rating: 4.9,
      weatherDependent: false,
      indoorActivity: true
    },
    {
      name: "Brooklyn Bridge Walk",
      type: "Outdoor",
      location: "Lower Manhattan",
      price: 0,
      rating: 4.6,
      weatherDependent: true,
      indoorActivity: false
    }
  ],
  Paris: [
    {
      name: "Eiffel Tower",
      type: "Sightseeing",
      location: "7th arrondissement",
      price: 25,
      rating: 4.7,
      weatherDependent: true,
      indoorActivity: false
    },
    {
      name: "Louvre Museum",
      type: "Cultural",
      location: "1st arrondissement",
      price: 17,
      rating: 4.8,
      weatherDependent: false,
      indoorActivity: true
    },
    {
      name: "Seine River Cruise",
      type: "Entertainment",
      location: "Seine River",
      price: 15,
      rating: 4.6,
      weatherDependent: true,
      indoorActivity: false
    },
    {
      name: "Montmartre Walk",
      type: "Outdoor",
      location: "18th arrondissement",
      price: 0,
      rating: 4.5,
      weatherDependent: true,
      indoorActivity: false
    },
    {
      name: "Champs-Élysées Shopping",
      type: "Shopping",
      location: "8th arrondissement",
      price: 0,
      rating: 4.4,
      weatherDependent: false,
      indoorActivity: true
    }
  ],
  Kyoto: [
    {
      name: "Fushimi Inari Shrine",
      type: "Cultural",
      location: "Fushimi",
      price: 0,
      rating: 4.8,
      weatherDependent: true,
      indoorActivity: false
    },
    {
      name: "Kinkaku-ji (Golden Pavilion)",
      type: "Cultural",
      location: "Kita",
      price: 5,
      rating: 4.7,
      weatherDependent: true,
      indoorActivity: false
    },
    {
      name: "Arashiyama Bamboo Grove",
      type: "Outdoor",
      location: "Arashiyama",
      price: 0,
      rating: 4.6,
      weatherDependent: true,
      indoorActivity: false
    },
    {
      name: "Gion District",
      type: "Cultural",
      location: "Gion",
      price: 0,
      rating: 4.5,
      weatherDependent: false,
      indoorActivity: true
    },
    {
      name: "Nishiki Market",
      type: "Food",
      location: "Central Kyoto",
      price: 0,
      rating: 4.4,
      weatherDependent: false,
      indoorActivity: true
    }
  ],
  Osaka: [
    {
      name: "Osaka Castle",
      type: "Cultural",
      location: "Chuo Ward",
      price: 8,
      rating: 4.5,
      weatherDependent: true,
      indoorActivity: false
    },
    {
      name: "Dotonbori",
      type: "Entertainment",
      location: "Namba",
      price: 0,
      rating: 4.7,
      weatherDependent: false,
      indoorActivity: true
    },
    {
      name: "Universal Studios Japan",
      type: "Entertainment",
      location: "Konohana Ward",
      price: 80,
      rating: 4.8,
      weatherDependent: true,
      indoorActivity: false
    },
    {
      name: "Kuromon Market",
      type: "Food",
      location: "Chuo Ward",
      price: 0,
      rating: 4.6,
      weatherDependent: false,
      indoorActivity: true
    },
    {
      name: "Umeda Sky Building",
      type: "Sightseeing",
      location: "Kita Ward",
      price: 15,
      rating: 4.4,
      weatherDependent: false,
      indoorActivity: true
    }
  ]
}

// Mock hotel names
export const hotelNames = [
  "Grand Hotel",
  "City Center Inn",
  "Luxury Suites",
  "Ocean View Resort",
  "Mountain Retreat",
  "Riverside Lodge",
  "Metropolitan Hotel",
  "Royal Palace Hotel"
]

// Mock hotel amenities
export const amenitiesList = [
  "Free Wi-Fi",
  "Swimming Pool",
  "Fitness Center",
  "Restaurant",
  "Bar",
  "Spa",
  "Room Service",
  "Airport Shuttle",
  "Breakfast Included",
  "Parking"
]

// Mock airlines
export const airlines = [
  "AirGlobal",
  "SkyWings",
  "TransWorld",
  "OceanAir",
  "StarFlyer"
]

// Mock weather conditions
export const weatherConditions = [
  "Sunny",
  "Partly Cloudy",
  "Cloudy",
  "Rainy",
  "Thunderstorm",
  "Snowy",
  "Windy"
]
