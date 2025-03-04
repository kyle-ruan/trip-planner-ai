import React from "react"
import { Link } from "react-router-dom"

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6">
          Plan Your Dream Trip with AI
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Let our advanced AI help you plan the perfect trip. From flights and
          hotels to activities and weather forecasts, we've got you covered.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            to="/planner"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Start Planning
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-4">✈️</div>
          <h3 className="text-xl font-semibold mb-2">Smart Flight Search</h3>
          <p className="text-gray-600">
            Find the best flights based on price, duration, and convenience.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-4">🏨</div>
          <h3 className="text-xl font-semibold mb-2">Hotel Recommendations</h3>
          <p className="text-gray-600">
            Get personalized hotel suggestions based on your preferences and
            budget.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-4">🌦️</div>
          <h3 className="text-xl font-semibold mb-2">Weather Forecasts</h3>
          <p className="text-gray-600">
            Plan activities with confidence using accurate weather predictions.
          </p>
        </div>
      </div>

      <div className="mt-16 bg-gray-100 p-8 rounded-lg max-w-4xl w-full">
        <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold">Enter your trip details</h3>
              <p className="text-gray-600">
                Tell us where you want to go, your dates, and your budget.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold">Our AI creates your plan</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes thousands of options to create the
                perfect itinerary.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold">Review and customize</h3>
              <p className="text-gray-600">
                Get a detailed plan with flights, hotels, activities, and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
