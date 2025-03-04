// Agent types
export interface AgentAction {
  tool: string
  toolInput: string
  [key: string]: any
}

// Domain types
export interface Flight {
  airline: string
  flightNumber: string
  departureCity: string
  arrivalCity: string
  departureTime: string
  arrivalTime: string
  price: number
  stops: number
  duration: string
}

export interface Hotel {
  name: string
  location: string
  pricePerNight: number
  rating: number
  amenities: string[]
  availableRooms: number
}

export interface WeatherForecast {
  date: string
  condition: string
  temperature: number
  precipitation: number
  humidity: number
  windSpeed: number
}

export interface Activity {
  name: string
  type: string
  location: string
  price: number
  rating: number
  weatherDependent: boolean
  indoorActivity: boolean
}

export interface BudgetBreakdown {
  transportation: number
  accommodation: number
  food: number
  activities: number
  miscellaneous: number
  total: number
}
