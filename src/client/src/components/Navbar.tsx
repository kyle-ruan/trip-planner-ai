import React from "react"
import { Link } from "react-router-dom"

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <span className="mr-2">✈️</span>
          Trip Planner AI
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-200 transition-colors">
            Home
          </Link>
          <Link to="/planner" className="hover:text-blue-200 transition-colors">
            Plan a Trip
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
