import React from "react"
import { Route, Routes } from "react-router-dom"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import PlannerPage from "./pages/PlannerPage"
import ResultPage from "./pages/ResultPage"

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
