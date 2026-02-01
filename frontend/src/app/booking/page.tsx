"use client";

import { useState, useEffect } from "react";
import { useQueueStore } from "@/src/stores/useQueueStore";
import { bookingSchema } from "@/src/schemas/bookingSchema";
import { 
  Calendar, 
  Clock, 
  Utensils, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Coffee,
  Sun,
  Moon
} from "lucide-react";

// Mock data for booking statistics
const bookingStats = {
  availableSlots: 142,
  peakHours: ["12:00-13:00", "18:30-19:30"],
  averageWaitTime: "8 minutes",
  todayBookings: 327
};

const mealTypes = [
  { 
    id: "breakfast", 
    name: "Breakfast", 
    icon: Coffee,
    description: "7:00 AM - 10:00 AM",
    slots: [
      { time: "7:00-7:30", available: true },
      { time: "7:30-8:00", available: true },
      { time: "8:00-8:30", available: false },
      { time: "8:30-9:00", available: true },
      { time: "9:00-9:30", available: true },
      { time: "9:30-10:00", available: true }
    ]
  },
  { 
    id: "lunch", 
    name: "Lunch", 
    icon: Sun,
    description: "12:00 PM - 3:00 PM",
    slots: [
      { time: "12:00-12:30", available: false },
      { time: "12:30-13:00", available: false },
      { time: "13:00-13:30", available: true },
      { time: "13:30-14:00", available: true },
      { time: "14:00-14:30", available: true },
      { time: "14:30-15:00", available: true }
    ]
  },
  { 
    id: "dinner", 
    name: "Dinner", 
    icon: Moon,
    description: "6:00 PM - 9:00 PM",
    slots: [
      { time: "18:00-18:30", available: true },
      { time: "18:30-19:00", available: false },
      { time: "19:00-19:30", available: true },
      { time: "19:30-20:00", available: true },
      { time: "20:00-20:30", available: true },
      { time: "20:30-21:00", available: true }
    ]
  }
];

const timeSlots = [
  "7:00-7:30", "7:30-8:00", "8:00-8:30", "8:30-9:00", "9:00-9:30", "9:30-10:00",
  "12:00-12:30", "12:30-13:00", "13:00-13:30", "13:30-14:00", "14:00-14:30", "14:30-15:00",
  "18:00-18:30", "18:30-19:00", "19:00-19:30", "19:30-20:00", "20:00-20:30", "20:30-21:00"
];

export default function BookingPage() {
  const assignToken = useQueueStore((state) => state.assignToken);

  const [mealType, setMealType] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState(timeSlots);
  const [bookingsToday, setBookingsToday] = useState(bookingStats.todayBookings);

  useEffect(() => {
    // Filter available slots based on selected meal type
    if (mealType && selectedMeal) {
      const filteredSlots = selectedMeal.slots
        .filter((slot: any) => slot.available)
        .map((slot: any) => slot.time);
      setAvailableSlots(filteredSlots);
    } else {
      setAvailableSlots(timeSlots);
    }
  }, [mealType, selectedMeal]);

  const handleMealSelect = (mealId: string) => {
    setMealType(mealId);
    const meal = mealTypes.find(m => m.id === mealId);
    setSelectedMeal(meal);
    setSlotTime(""); // Reset time slot when meal changes
  };

  const handleSubmit = () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    const result = bookingSchema.safeParse({
      mealType,
      slotTime,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Assign token
      const tokenId = assignToken(mealType, slotTime);
      
      // Update bookings count
      setBookingsToday(prev => prev + 1);
      
      // Show success
      setSuccess(`Slot booked successfully! Your token is #${tokenId}`);
      setIsLoading(false);

      // Redirect to queue page
      setTimeout(() => {
        window.location.href = "/queue";
      }, 1500);
    }, 800);
  };

  const getMealIcon = (mealId: string) => {
    switch(mealId) {
      case 'breakfast': return Coffee;
      case 'lunch': return Sun;
      case 'dinner': return Moon;
      default: return Utensils;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Smart Meal Booking
          </h1>
          <p className="text-gray-600 text-lg">
            Book your meal slots in advance to avoid queues and ensure your preferred time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Available Slots</p>
                <p className="text-2xl font-bold text-gray-900">{bookingStats.availableSlots}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Today&apos;s Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookingsToday}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Average Wait Time</p>
                <p className="text-2xl font-bold text-gray-900">{bookingStats.averageWaitTime}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Guaranteed Slot</p>
                <p className="text-2xl font-bold text-gray-900">100%</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Book Your Meal Slot</h2>
                <p className="text-blue-100">Select your preferred meal and time slot</p>
              </div>

              <div className="p-6">
                {/* Meal Type Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Utensils className="w-5 h-5" />
                    Select Meal Type
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mealTypes.map((meal) => {
                      const Icon = meal.icon;
                      const isSelected = mealType === meal.id;
                      return (
                        <button
                          key={meal.id}
                          onClick={() => handleMealSelect(meal.id)}
                          className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex flex-col items-center text-center">
                            <div className={`p-3 rounded-lg mb-3 ${
                              isSelected ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <Icon className={`w-6 h-6 ${
                                isSelected ? 'text-blue-600' : 'text-gray-600'
                              }`} />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1">{meal.name}</h4>
                            <p className="text-sm text-gray-500">{meal.description}</p>
                            <div className="mt-3 text-xs">
                              <span className={`px-2 py-1 rounded-full ${
                                isSelected 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {meal.slots.filter(s => s.available).length} slots available
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slot Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Select Time Slot
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {selectedMeal ? (
                      selectedMeal.slots.map((slot: any) => (
                        <button
                          key={slot.time}
                          onClick={() => setSlotTime(slot.time)}
                          disabled={!slot.available}
                          className={`p-4 rounded-lg text-center transition-all duration-200 ${
                            slotTime === slot.time
                              ? 'bg-blue-600 text-white'
                              : slot.available
                              ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                              : 'bg-gray-100 opacity-50 cursor-not-allowed text-gray-400'
                          }`}
                        >
                          <div className="font-medium">{slot.time}</div>
                          <div className="text-xs mt-1">
                            {slot.available ? (
                              <span className="text-green-600">Available</span>
                            ) : (
                              <span className="text-red-600">Booked</span>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        Please select a meal type first to see available time slots
                      </div>
                    )}
                  </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-green-700">{success}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!mealType || !slotTime || isLoading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                    mealType && slotTime && !isLoading
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Book Now
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Booking Summary */}
                {(mealType || slotTime) && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">Booking Summary</h4>
                    <div className="space-y-2">
                      {mealType && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Meal Type:</span>
                          <span className="font-medium text-gray-900 capitalize">
                            {mealType}
                          </span>
                        </div>
                      )}
                      {slotTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time Slot:</span>
                          <span className="font-medium text-gray-900">{slotTime}</span>
                        </div>
                      )}
                      {mealType && slotTime && (
                        <div className="flex justify-between border-t pt-2 mt-2">
                          <span className="text-gray-600">Estimated Wait:</span>
                          <span className="font-bold text-blue-600">
                            {bookingStats.averageWaitTime}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Info & Tips */}
          <div className="space-y-6">
            {/* Peak Hours */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Peak Hours
              </h3>
              <div className="space-y-3">
                {bookingStats.peakHours.map((hour, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-gray-900">{hour}</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      Busy
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Consider booking outside peak hours for shorter wait times
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Benefits
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Guaranteed Slot</h4>
                    <p className="text-sm text-gray-600">Your slot is reserved upon booking</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Save Time</h4>
                    <p className="text-sm text-gray-600">Skip the queue with pre-booked slots</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Plan Ahead</h4>
                    <p className="text-sm text-gray-600">Book up to 7 days in advance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Today&apos;s Insights</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Breakfast Bookings</span>
                  <span className="font-bold">142</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Lunch Bookings</span>
                  <span className="font-bold">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Dinner Bookings</span>
                  <span className="font-bold">96</span>
                </div>
                <div className="pt-4 border-t border-blue-500 mt-4">
                  <div className="flex justify-between items-center">
                    <span>Total Capacity</span>
                    <span className="font-bold text-xl">85%</span>
                  </div>
                  <div className="mt-2 w-full bg-blue-500 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-500"
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}