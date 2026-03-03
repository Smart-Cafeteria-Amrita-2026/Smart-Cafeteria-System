"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGenerateForecast } from "@/hooks/staff/useForecast";
import type { SlotForecast, MealPrediction } from "@/services/staff/ForecastService";
import {
	ArrowLeft,
	BarChart3,
	Users,
	Cloud,
	Sun,
	CloudRain,
	Thermometer,
	Snowflake,
	Sparkles,
	Clock,
	TrendingUp,
	Utensils,
	Calendar,
	ChevronDown,
} from "lucide-react";

// Weather options
const WEATHER_OPTIONS = [
	{ value: "sunny", label: "Sunny", icon: Sun, color: "text-amber-500" },
	{ value: "cloudy", label: "Cloudy", icon: Cloud, color: "text-gray-500" },
	{ value: "rainy", label: "Rainy", icon: CloudRain, color: "text-[var(--color-primary)]" },
	{ value: "hot", label: "Hot", icon: Thermometer, color: "text-red-500" },
	{ value: "cold", label: "Cold", icon: Snowflake, color: "text-cyan-500" },
] as const;

type WeatherType = (typeof WEATHER_OPTIONS)[number]["value"];

// Mock forecast data for development
const MOCK_FORECAST: SlotForecast[] = [
	{
		slot_name: "Breakfast",
		slot_id: 1,
		start_time: "07:30",
		end_time: "09:30",
		expected_footfall: 120,
		predictions: [
			{
				menu_item_id: 1,
				item_name: "Idli Sambar",
				category: "South Indian",
				predicted_quantity: 80,
				confidence: 92,
			},
			{
				menu_item_id: 2,
				item_name: "Poha",
				category: "Snacks",
				predicted_quantity: 50,
				confidence: 88,
			},
			{
				menu_item_id: 3,
				item_name: "Bread Omelette",
				category: "Continental",
				predicted_quantity: 40,
				confidence: 85,
			},
			{
				menu_item_id: 4,
				item_name: "Tea/Coffee",
				category: "Beverages",
				predicted_quantity: 100,
				confidence: 95,
			},
		],
	},
	{
		slot_name: "Lunch",
		slot_id: 2,
		start_time: "12:00",
		end_time: "14:00",
		expected_footfall: 250,
		predictions: [
			{
				menu_item_id: 5,
				item_name: "Rice & Dal",
				category: "North Indian",
				predicted_quantity: 180,
				confidence: 94,
			},
			{
				menu_item_id: 6,
				item_name: "Chicken Curry",
				category: "Non-Veg",
				predicted_quantity: 80,
				confidence: 87,
			},
			{
				menu_item_id: 7,
				item_name: "Paneer Butter Masala",
				category: "North Indian",
				predicted_quantity: 70,
				confidence: 89,
			},
			{
				menu_item_id: 8,
				item_name: "Roti",
				category: "Breads",
				predicted_quantity: 200,
				confidence: 92,
			},
			{
				menu_item_id: 9,
				item_name: "Salad",
				category: "Healthy",
				predicted_quantity: 60,
				confidence: 78,
			},
		],
	},
	{
		slot_name: "Snacks",
		slot_id: 3,
		start_time: "16:00",
		end_time: "17:30",
		expected_footfall: 80,
		predictions: [
			{
				menu_item_id: 10,
				item_name: "Samosa",
				category: "Snacks",
				predicted_quantity: 100,
				confidence: 90,
			},
			{
				menu_item_id: 11,
				item_name: "Vada Pav",
				category: "Snacks",
				predicted_quantity: 60,
				confidence: 85,
			},
			{
				menu_item_id: 12,
				item_name: "Tea/Coffee",
				category: "Beverages",
				predicted_quantity: 70,
				confidence: 93,
			},
		],
	},
	{
		slot_name: "Dinner",
		slot_id: 4,
		start_time: "19:00",
		end_time: "21:00",
		expected_footfall: 180,
		predictions: [
			{
				menu_item_id: 13,
				item_name: "Fried Rice",
				category: "Chinese",
				predicted_quantity: 90,
				confidence: 86,
			},
			{
				menu_item_id: 14,
				item_name: "Noodles",
				category: "Chinese",
				predicted_quantity: 70,
				confidence: 84,
			},
			{
				menu_item_id: 15,
				item_name: "Chapati",
				category: "Breads",
				predicted_quantity: 150,
				confidence: 91,
			},
			{
				menu_item_id: 16,
				item_name: "Mixed Veg Curry",
				category: "North Indian",
				predicted_quantity: 80,
				confidence: 88,
			},
		],
	},
];

// Prediction Card Component (Dumb)
interface PredictionCardProps {
	prediction: MealPrediction;
}

function PredictionCard({ prediction }: PredictionCardProps) {
	const getConfidenceColor = (confidence: number) => {
		if (confidence >= 90) return "text-emerald-600 bg-emerald-50";
		if (confidence >= 80) return "text-orange-600 bg-orange-50";
		if (confidence >= 70) return "text-amber-600 bg-amber-50";
		return "text-gray-600 bg-gray-50";
	};

	return (
		<div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
			<div className="flex items-center gap-3 min-w-0">
				<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white shrink-0">
					<Utensils size={18} />
				</div>
				<div className="min-w-0">
					<p className="font-medium text-gray-900 truncate">{prediction.item_name}</p>
					<p className="text-xs text-gray-500">{prediction.category}</p>
				</div>
			</div>
			<div className="flex items-center gap-3 shrink-0">
				<div className="text-right">
					<p className="font-bold text-gray-900">{prediction.predicted_quantity}</p>
					<p className="text-xs text-gray-500">servings</p>
					<div className="mt-1.5 flex justify-end">
						<div className="h-2 w-24 rounded-full bg-orange-100/70">
							<div
								className="h-2 rounded-full bg-[var(--color-primary)] transition-all duration-300 ease-in-out"
								style={{ width: `${prediction.confidence}%` }}
							/>
						</div>
					</div>
				</div>
				<span
					className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getConfidenceColor(prediction.confidence)}`}
				>
					{prediction.confidence}%
				</span>
			</div>
		</div>
	);
}

// Slot Forecast Card Component (Dumb)
interface SlotCardProps {
	slot: SlotForecast;
}

function SlotCard({ slot }: SlotCardProps) {
	const [isExpanded, setIsExpanded] = useState(true);

	const getSlotColor = (name: string) => {
		switch (name.toLowerCase()) {
			case "breakfast":
				return "from-amber-500 to-orange-500";
			case "lunch":
				return "from-[var(--color-primary)] to-[var(--color-secondary)]";
			case "snacks":
				return "from-purple-500 to-pink-500";
			case "dinner":
				return "from-[var(--color-secondary)] to-purple-600";
			default:
				return "from-gray-500 to-gray-600";
		}
	};

	return (
		<div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
			{/* Slot Header */}
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition-colors"
			>
				<div className="flex items-center gap-4">
					<div
						className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getSlotColor(slot.slot_name)} flex items-center justify-center text-white`}
					>
						<Clock size={24} />
					</div>
					<div className="text-left">
						<h3 className="font-bold text-lg text-gray-900">{slot.slot_name}</h3>
						<p className="text-sm text-gray-500">
							{slot.start_time} - {slot.end_time}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-4">
					<div className="text-right hidden sm:block">
						<div className="flex items-center gap-1 text-[var(--color-primary)]">
							<Users size={16} />
							<span className="font-semibold">{slot.expected_footfall}</span>
						</div>
						<p className="text-xs text-gray-500">expected</p>
					</div>
					<ChevronDown
						size={20}
						className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
					/>
				</div>
			</button>

			{/* Predictions */}
			{isExpanded && (
				<div className="px-4 pb-4 sm:px-5 sm:pb-5">
					<div className="flex items-center justify-between mb-3">
						<p className="text-sm font-medium text-gray-600">
							{slot.predictions.length} items predicted
						</p>
						<div className="flex items-center gap-1 text-sm text-[var(--color-primary)] sm:hidden">
							<Users size={14} />
							<span className="font-medium">{slot.expected_footfall} expected</span>
						</div>
					</div>
					<div className="space-y-2">
						{slot.predictions.map((prediction) => (
							<PredictionCard key={prediction.menu_item_id} prediction={prediction} />
						))}
					</div>
				</div>
			)}
		</div>
	);
}

// Loading Skeleton
function ForecastSkeleton() {
	return (
		<div className="space-y-4">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="bg-white rounded-2xl border p-5 animate-pulse">
					<div className="flex items-center gap-4 mb-4">
						<div className="w-12 h-12 rounded-xl bg-gray-200" />
						<div className="space-y-2">
							<div className="h-5 bg-gray-200 rounded w-24" />
							<div className="h-4 bg-gray-100 rounded w-20" />
						</div>
					</div>
					<div className="space-y-2">
						{Array.from({ length: 3 }).map((_, j) => (
							<div key={j} className="h-16 bg-gray-100 rounded-xl" />
						))}
					</div>
				</div>
			))}
		</div>
	);
}

// Main Forecaster Page
export default function ForecastPage() {
	const router = useRouter();
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [crowdExpected, setCrowdExpected] = useState<number>(500);
	const [weather, setWeather] = useState<WeatherType>("sunny");
	const [forecast, setForecast] = useState<SlotForecast[] | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);

	const generateMutation = useGenerateForecast();

	const handleGenerate = async () => {
		setIsGenerating(true);

		// Simulate API call with mock data
		// Replace with real API call when backend is ready
		setTimeout(() => {
			// generateMutation.mutate({ date, crowd_expected: crowdExpected, weather });
			setForecast(MOCK_FORECAST);
			setIsGenerating(false);
		}, 1500);
	};

	const totalPredictedServings =
		forecast?.reduce(
			(sum, slot) => sum + slot.predictions.reduce((s, p) => s + p.predicted_quantity, 0),
			0
		) || 0;

	const totalExpectedFootfall =
		forecast?.reduce((sum, slot) => sum + slot.expected_footfall, 0) || 0;

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-[var(--primary)] text-[var(--primary-foreground)]">
				<div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
					<div className="flex items-center gap-4 mb-6">
						<button
							onClick={() => router.push("/staff")}
							className="p-2 hover:bg-[var(--primary-foreground)]/10 rounded-full transition-colors"
						>
							<ArrowLeft size={24} />
						</button>
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
								<BarChart3 size={28} className="text-[var(--primary-foreground)]" />
								Meal Forecaster
							</h1>
							<p className="text-[var(--primary-foreground)]/80 text-sm sm:text-base">
								Predict meals to prepare based on crowd and weather
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-3 gap-6">
					{/* Input Panel */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6 sticky top-24">
							<h2 className="font-bold text-lg text-gray-900 mb-5 flex items-center gap-2">
								<Sparkles size={20} className="text-[var(--primary)]" />
								Forecast Parameters
							</h2>

							{/* Date Input */}
							<div className="mb-5">
								<label
									htmlFor="forecast-date"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									<Calendar size={16} className="inline mr-1" />
									Date
								</label>
								<input
									id="forecast-date"
									type="date"
									value={date}
									onChange={(e) => setDate(e.target.value)}
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
								/>
							</div>

							{/* Crowd Expected Input */}
							<div className="mb-5">
								<label
									htmlFor="forecast-crowd"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									<Users size={16} className="inline mr-1" />
									Crowd Expected
								</label>
								<div className="relative">
									<input
										id="forecast-crowd"
										type="number"
										value={crowdExpected}
										onChange={(e) => setCrowdExpected(Number(e.target.value))}
										min={0}
										max={2000}
										className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
										placeholder="Enter expected crowd"
									/>
									<span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
										people
									</span>
								</div>
								{/* Quick Select Buttons */}
								<div className="flex gap-2 mt-2">
									{[200, 500, 800, 1000].map((val) => (
										<button
											key={val}
											onClick={() => setCrowdExpected(val)}
											className={`flex-1 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
												crowdExpected === val
													? "bg-orange-50 border-orange-300 text-orange-700"
													: "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
											}`}
										>
											{val}
										</button>
									))}
								</div>
							</div>

							{/* Weather Selection */}
							<div className="mb-6">
								<span className="block text-sm font-medium text-gray-700 mb-2">
									<Cloud size={16} className="inline mr-1" />
									Weather Condition
								</span>
								<div
									className="grid grid-cols-5 gap-2"
									role="radiogroup"
									aria-label="Weather Condition"
								>
									{WEATHER_OPTIONS.map((option) => {
										const Icon = option.icon;
										return (
											<button
												key={option.value}
												onClick={() => setWeather(option.value)}
												className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
													weather === option.value
														? "border-[var(--primary)] bg-orange-50 shadow-md"
														: "border-gray-200 hover:border-orange-200 hover:bg-orange-50/50"
												}`}
											>
												<Icon size={24} className={option.color} />
												<span className="text-xs font-medium text-gray-700">{option.label}</span>
											</button>
										);
									})}
								</div>
							</div>

							{/* Generate Button */}
							<button
								onClick={handleGenerate}
								disabled={isGenerating}
								className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary)]/90 transition-colors shadow-lg shadow-[var(--primary)]/25 disabled:opacity-70 disabled:cursor-not-allowed"
							>
								{isGenerating ? (
									<>
										<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										Generating...
									</>
								) : (
									<>
										<Sparkles size={18} />
										Generate Forecast
									</>
								)}
							</button>
						</div>
					</div>

					{/* Forecast Results */}
					<div className="lg:col-span-2">
						{/* Summary Stats */}
						{forecast && (
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
								<div className="bg-white rounded-xl border p-4">
									<p className="text-sm text-gray-500 mb-1">Total Footfall</p>
									<p className="text-2xl font-bold text-gray-900">{totalExpectedFootfall}</p>
								</div>
								<div className="bg-white rounded-xl border p-4">
									<p className="text-sm text-gray-500 mb-1">Total Servings</p>
									<p className="text-2xl font-bold text-[var(--color-primary)]">
										{totalPredictedServings}
									</p>
								</div>
								<div className="bg-white rounded-xl border p-4 col-span-2 sm:col-span-1">
									<p className="text-sm text-gray-500 mb-1">Meal Slots</p>
									<p className="text-2xl font-bold text-purple-600">{forecast.length}</p>
								</div>
							</div>
						)}

						{/* Slot Forecasts */}
						{isGenerating ? (
							<ForecastSkeleton />
						) : forecast ? (
							<div className="space-y-4">
								{forecast.map((slot) => (
									<SlotCard key={slot.slot_id} slot={slot} />
								))}
							</div>
						) : (
							<div className="bg-white rounded-2xl border p-8 sm:p-12 text-center">
								<div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
									<TrendingUp size={40} className="text-purple-500" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-2">No Forecast Generated</h3>
								<p className="text-gray-500 max-w-md mx-auto">
									Enter the expected crowd and weather conditions, then click "Generate Forecast" to
									see meal predictions for each slot.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
