// Sustainability goals
export const sustainabilityGoals = {
  wasteReduction: 15, // Percentage reduction target
  carbonFootprint: 0.8, // kg CO₂ per meal target
  fairnessIndex: 95, // Percentage target
  resourceEfficiency: 90, // Percentage target
};

// Meal types with time slots
export const mealTypes = {
  BREAKFAST: {
    name: "Breakfast",
    start: 7,
    end: 10,
    peak: [8, 9],
    timeRange: "7:00 AM - 10:00 AM"
  },
  LUNCH: {
    name: "Lunch",
    start: 11,
    end: 15,
    peak: [12, 13],
    timeRange: "11:00 AM - 3:00 PM"
  },
  DINNER: {
    name: "Dinner",
    start: 16,
    end: 21,
    peak: [18, 19],
    timeRange: "4:00 PM - 9:00 PM"
  },
};

// Time slots for booking
export const timeSlots = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00", "21:00"
];

// Peak hours configuration
export const peakHours = {
  lunch: { start: 12, end: 14 },
  dinner: { start: 19, end: 20 }
};

// API endpoints
export const API_ENDPOINTS = {
  DASHBOARD: "/api/dashboard",
  BOOKING: "/api/booking",
  QUEUE: "/api/queue",
  FORECAST: "/api/forecast",
};

// Default values
export const DEFAULTS = {
  ESTIMATED_WAIT_TIMES: {
    BREAKFAST: "5-15 mins",
    LUNCH: "10-25 mins",
    DINNER: "15-30 mins",
  },
  PEAK_HOUR_WARNING: "Expect longer wait times during peak hours",
  MAX_TOKEN_CAPACITY: 100,
};

// Colors for different statuses
export const STATUS_COLORS = {
  LOW: "#10B981", // Green
  MEDIUM: "#F59E0B", // Yellow
  HIGH: "#EF4444", // Red
};