# Trip Planner

A TypeScript application that uses LangChain and OpenAI to plan trips by finding flights, checking weather, and booking hotels.

## Features

- Multi-city trip planning
- Flight search with price comparison
- Weather forecasting for travel dates
- Hotel recommendations based on ratings and amenities
- Activity suggestions based on weather conditions
- Budget breakdown and analysis
- Detailed logging with color-coded console output and file logging
- **Web UI for easy trip planning**

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm run install:all
   ```
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Usage

### Development

Run both the backend and frontend in development mode:

```
npm run dev
```

Or run them separately:

```
npm run dev:server  # Run only the backend
npm run dev:client  # Run only the frontend
```

### Production

Build both the backend and frontend:

```
npm run build:all
```

Run the production build:

```
npm start
```

## Web Interface

The application includes a web interface that allows you to:

1. Enter trip details (destinations, dates, budget, etc.)
2. View the AI-generated trip plan
3. See the AI's thinking process
4. Plan multiple trips

The web interface is built with React and uses Tailwind CSS for styling.

## Project Structure

The project follows a modular architecture for better organization and maintainability:

```
src/
├── api/                  # Mock API functions for different services
│   ├── activityApi.ts    # Activity search API
│   ├── budgetApi.ts      # Budget calculation API
│   ├── flightApi.ts      # Flight search API
│   ├── hotelApi.ts       # Hotel search API
│   └── weatherApi.ts     # Weather forecast API
├── client/               # React frontend
│   ├── public/           # Static files
│   └── src/              # React components and pages
│       ├── components/   # Reusable UI components
│       └── pages/        # Page components
├── server/               # Express backend
│   └── index.ts          # Server entry point
├── tools/                # LangChain tools for the agent
│   ├── activityTool.ts   # Tool for finding activities
│   ├── budgetTool.ts     # Tool for calculating budgets
│   ├── flightTool.ts     # Tool for finding flights
│   ├── hotelTool.ts      # Tool for finding hotels
│   └── weatherTool.ts    # Tool for checking weather
├── types/                # TypeScript type definitions
│   └── index.ts          # Common types used across the application
└── utils/                # Utility functions
    ├── logger.ts         # Logging utilities
    └── mockData.ts       # Mock data for simulating API responses
```

## Logs

Detailed logs are saved to the `logs/trip-planner.log` file, which includes all API calls, tool usage, and agent thinking process.

## Customization

You can customize the trip planning by modifying the parameters in the web interface or by editing the `runAdvancedTripPlanner` function call in `src/server/index.ts`.
