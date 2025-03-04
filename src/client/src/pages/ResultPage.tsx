import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

interface TripPlanResult {
  plan: string
  thoughts: string[]
}

const ResultPage: React.FC = () => {
  const navigate = useNavigate()
  const [tripPlan, setTripPlan] = useState<TripPlanResult | null>(null)
  const [showThoughts, setShowThoughts] = useState(false)

  useEffect(() => {
    // Retrieve trip plan from localStorage
    const storedPlan = localStorage.getItem("tripPlan")

    if (!storedPlan) {
      // If no plan is found, redirect to planner page
      navigate("/planner")
      return
    }

    try {
      const parsedPlan = JSON.parse(storedPlan) as TripPlanResult
      setTripPlan(parsedPlan)
    } catch (error) {
      console.error("Error parsing trip plan:", error)
      navigate("/planner")
    }
  }, [navigate])

  if (!tripPlan) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  // Format the plan text with proper line breaks and sections
  const formatPlanText = (text: string) => {
    // Replace markdown headers with styled divs
    let formattedText = text
      .replace(/### (.*)/g, '<h3 class="text-xl font-bold mt-6 mb-2">$1</h3>')
      .replace(/## (.*)/g, '<h2 class="text-2xl font-bold mt-8 mb-3">$1</h2>')
      .replace(/# (.*)/g, '<h1 class="text-3xl font-bold mt-10 mb-4">$1</h1>')

    // Replace markdown lists with HTML lists
    formattedText = formattedText.replace(
      /\n- (.*)/g,
      '<li class="ml-4 mb-1">$1</li>'
    )

    // Replace line breaks with <br> tags
    formattedText = formattedText.replace(/\n/g, "<br>")

    return formattedText
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Your Trip Plan</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: formatPlanText(tripPlan.plan) }}
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <button
          onClick={() => setShowThoughts(!showThoughts)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded mb-4 md:mb-0"
        >
          {showThoughts
            ? "Hide AI Thinking Process"
            : "Show AI Thinking Process"}
        </button>

        <Link
          to="/planner"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Plan Another Trip
        </Link>
      </div>

      {showThoughts && tripPlan.thoughts && tripPlan.thoughts.length > 0 && (
        <div className="bg-gray-100 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">AI Thinking Process</h2>
          <div className="space-y-2">
            {tripPlan.thoughts.map((thought, index) => (
              <div key={index} className="p-3 bg-white rounded shadow-sm">
                {thought}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultPage
