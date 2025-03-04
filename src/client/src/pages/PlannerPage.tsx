import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

interface TripFormData {
  destinations: string
  startDate: string
  endDate: string
  departureCity: string
  budget: string
  travelers: string
}

// Define a custom interface for SSE events
interface MessageEvent extends Event {
  data: string
}

const PlannerPage: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [streamingThoughts, setStreamingThoughts] = useState<string[]>([])
  const [streamingStatus, setStreamingStatus] = useState<string>("")
  const [formData, setFormData] = useState<TripFormData>({
    destinations: "",
    startDate: "",
    endDate: "",
    departureCity: "",
    budget: "",
    travelers: "1"
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setStreamingThoughts([])
    setStreamingStatus("Starting...")

    try {
      // Validate form data
      if (
        !formData.destinations ||
        !formData.startDate ||
        !formData.endDate ||
        !formData.departureCity ||
        !formData.budget ||
        !formData.travelers
      ) {
        throw new Error("Please fill in all required fields")
      }

      // Parse destinations into an array
      const destinationsArray = formData.destinations
        .split(",")
        .map((dest) => dest.trim())
        .filter((dest) => dest.length > 0)

      if (destinationsArray.length === 0) {
        throw new Error("Please enter at least one destination")
      }

      // Validate dates
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)

      if (end <= start) {
        throw new Error("End date must be after start date")
      }

      // Validate budget
      const budget = parseFloat(formData.budget)
      if (isNaN(budget) || budget <= 0) {
        throw new Error("Please enter a valid budget amount")
      }

      // Validate travelers
      const travelers = parseInt(formData.travelers, 10)
      if (isNaN(travelers) || travelers <= 0) {
        throw new Error("Please enter a valid number of travelers")
      }

      // Use the streaming API endpoint
      const useStreamingAPI = true

      if (useStreamingAPI) {
        // Build query string for SSE endpoint
        const queryParams = new URLSearchParams({
          destinations: destinationsArray.join(","),
          startDate: formData.startDate,
          endDate: formData.endDate,
          departureCity: formData.departureCity,
          budget: budget.toString(),
          travelers: travelers.toString()
        }).toString()

        // Create EventSource for SSE - use a relative path which will be proxied correctly
        const eventSource = new EventSource(
          `/api/stream-trip-plan?${queryParams}`
        )

        console.log(
          "Connecting to SSE endpoint:",
          `/api/stream-trip-plan?${queryParams}`
        )

        // Store thoughts and final plan
        const thoughts: string[] = []
        let finalPlan: string = ""

        // Add a generic message handler for debugging
        eventSource.onmessage = (event) => {
          console.log("SSE generic message received:", event.data)
          try {
            const data = JSON.parse(event.data)
            if (data.thought) {
              thoughts.push(data.thought)
              setStreamingThoughts([...thoughts])
            }
          } catch (e) {
            console.error("Error parsing SSE message:", e)
          }
        }

        // Handle different event types
        eventSource.addEventListener("connected", (event: MessageEvent) => {
          console.log("SSE connection established:", event.data)
          setStreamingStatus("Connected to server...")
        })

        eventSource.addEventListener("heartbeat", (event: MessageEvent) => {
          console.log("SSE heartbeat received")
        })

        eventSource.addEventListener("start", (event: MessageEvent) => {
          console.log("SSE 'start' event received:", event.data)
          try {
            const data = JSON.parse(event.data)
            setStreamingStatus(data.message || "Planning started...")
          } catch (e) {
            console.error("Error parsing start event:", e)
          }
        })

        eventSource.addEventListener("thinking", (event: MessageEvent) => {
          console.log("SSE 'thinking' event received:", event.data)
          try {
            const data = JSON.parse(event.data)
            setStreamingStatus(data.message || "AI is thinking...")
          } catch (e) {
            console.error("Error parsing thinking event:", e)
          }
        })

        eventSource.addEventListener("thought", (event: MessageEvent) => {
          console.log("SSE 'thought' event received:", event.data)
          try {
            const data = JSON.parse(event.data)
            if (data.thought) {
              thoughts.push(data.thought)
              setStreamingThoughts([...thoughts])
            }
          } catch (e) {
            console.error("Error parsing thought event:", e)
          }
        })

        eventSource.addEventListener("complete", (event: MessageEvent) => {
          console.log("SSE 'complete' event received:", event.data)
          try {
            const data = JSON.parse(event.data)
            finalPlan = data.plan

            // Store the result in localStorage
            localStorage.setItem(
              "tripPlan",
              JSON.stringify({
                plan: finalPlan,
                thoughts: thoughts
              })
            )

            // Close the connection
            eventSource.close()

            // Navigate to result page
            navigate("/result")
          } catch (e) {
            console.error("Error parsing complete event:", e)
            setError("Error processing the completed plan. Please try again.")
            eventSource.close()
            setIsLoading(false)
          }
        })

        eventSource.addEventListener("error", (event: MessageEvent) => {
          console.error("SSE 'error' event received:", event)
          let errorMessage = "Connection error"
          try {
            if (event.data) {
              const data = JSON.parse(event.data)
              errorMessage = data.error || errorMessage
            }
          } catch (e) {
            // If parsing fails, use the default error message
            console.error("Error parsing SSE error event data:", e)
          }

          setError(errorMessage)
          eventSource.close()
          setIsLoading(false)
        })

        // Handle connection errors
        eventSource.onerror = (err) => {
          console.error("SSE connection error:", err)
          setError("Connection to server lost. Please try again.")
          eventSource.close()
          setIsLoading(false)
        }
      } else {
        // Fallback to regular API if streaming is not available
        const response = await fetch("/api/plan-trip", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            destinations: destinationsArray,
            startDate: formData.startDate,
            endDate: formData.endDate,
            departureCity: formData.departureCity,
            budget: budget,
            travelers: travelers
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to plan trip")
        }

        const data = await response.json()

        // Store the result in localStorage
        localStorage.setItem("tripPlan", JSON.stringify(data))

        // Navigate to result page
        navigate("/result")
      }
    } catch (err: any) {
      console.error("Error in handleSubmit:", err)
      setError(err.message || "An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Plan Your Trip</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="mb-6">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="destinations"
          >
            Destinations (comma separated)
          </label>
          <textarea
            id="destinations"
            name="destinations"
            value={formData.destinations}
            onChange={handleChange}
            placeholder="e.g. Tokyo, Kyoto, Osaka"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="departureCity"
            >
              Departure City
            </label>
            <input
              type="text"
              id="departureCity"
              name="departureCity"
              value={formData.departureCity}
              onChange={handleChange}
              placeholder="e.g. New York"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="travelers"
            >
              Number of Travelers
            </label>
            <select
              id="travelers"
              name="travelers"
              value={formData.travelers}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "traveler" : "travelers"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="startDate"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="endDate"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="budget"
          >
            Budget (USD)
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="e.g. 3000"
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Planning Trip..." : "Plan My Trip"}
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            AI Trip Planning in Progress
          </h2>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="loading-spinner mr-3"></div>
              <p className="text-lg font-medium">{streamingStatus}</p>
            </div>
          </div>

          {streamingThoughts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">
                AI Thinking Process:
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto p-2">
                {streamingThoughts.map((thought, index) => (
                  <div key={index} className="p-3 bg-white rounded shadow-sm">
                    {thought}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PlannerPage
