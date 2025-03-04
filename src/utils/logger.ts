import fs from "fs"
import path from "path"

// Configure logging
const LOG_TO_FILE = true
const LOG_FILE_PATH = path.join(__dirname, "../../logs/trip-planner.log")

// Create logs directory if it doesn't exist
if (LOG_TO_FILE) {
  const logsDir = path.dirname(LOG_FILE_PATH)
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
  }
  // Clear previous log file
  fs.writeFileSync(LOG_FILE_PATH, "")
}

// Color codes for terminal output
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m"
}

/**
 * Log a message with color to console and/or file
 * @param message The message to log
 * @param color The color to use for console output
 * @param important Whether this is an important message that should always be shown in console
 */
export const logWithColor = (
  message: string,
  color: string,
  important = false
) => {
  // Only log to console if it's important or a tool call
  if (
    important ||
    message.includes("TOOL CALLED") ||
    message.includes("✅") ||
    message.includes("❌")
  ) {
    console.log(
      `${colors[color as keyof typeof colors]}${message}${colors.reset}`
    )
  }

  // Log to file if enabled
  if (LOG_TO_FILE) {
    fs.appendFileSync(LOG_FILE_PATH, `${message}\n`)
  }
}

/**
 * Get the path to the log file
 * @returns The path to the log file
 */
export const getLogFilePath = (): string => {
  return LOG_FILE_PATH
}

/**
 * Add a delay (for simulating API calls)
 * @param ms Milliseconds to delay
 * @returns A promise that resolves after the delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
