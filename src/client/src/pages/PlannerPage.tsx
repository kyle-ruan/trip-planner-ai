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

const PlannerPage: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

      // Make API request to plan trip
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
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
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
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Planning Trip...
              </div>
            ) : (
              "Plan My Trip"
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center text-gray-600">
        <p>
          Our AI will analyze thousands of options to create the perfect trip
          plan for you. This may take a minute or two.
        </p>
      </div>
    </div>
  )
}

export default PlannerPage
