#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Error: .env file not found. Please create a .env file with your OPENAI_API_KEY."
  exit 1
fi

# Start the development server
echo "Starting Trip Planner development server..."
npm run dev