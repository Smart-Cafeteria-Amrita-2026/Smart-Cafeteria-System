"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ChevronDown,
  Utensils,
  ChefHat,
  Clock,
  Users,
  TrendingUp,
  DollarSign,
  Star,
  CheckCircle,
  XCircle
} from "lucide-react";

// Mock data
const mealCategories = [
  { id: 1, name: "Breakfast", color: "bg-yellow-100 text-yellow-800", count: 15 },
  { id: 2, name: "Lunch", color: "bg-orange-100 text-orange-800", count: 28 },
  { id: 3, name: "Dinner", color: "bg-purple-100 text-purple-800", count: 22 },
  { id: 4, name: "Snacks", color: "bg-green-100 text-green-800", count: 12 },
  { id: 5, name: "Beverages", color: "bg-blue-100 text-blue-800", count: 18 },
];

const popularMeals = [
  { 
    id: 1, 
    name: "Paneer Butter Masala", 
    category: "Lunch", 
    price: 280, 
    rating: 4.8,
    orders: 156,
    prepTime: "25 min",
    chef: "Chef Rajesh",
    status: "available",
    ingredients: ["Paneer", "Tomato", "Cream", "Spices"]
  },
  { 
    id: 2, 
    name: "Masala Dosa", 
    category: "Breakfast", 
    price: 120, 
    rating: 4.9,
    orders: 203,
    prepTime: "15 min",
    chef: "Chef Priya",
    status: "available",
    ingredients: ["Rice", "Lentils", "Potato", "Spices"]
  },
  { 
    id: 3, 
    name: "Biryani", 
    category: "Dinner", 
    price: 320, 
    rating: 4.7,
    orders: 189,
    prepTime: "40 min",
    chef: "Chef Ahmed",
    status: "low-stock",
    ingredients: ["Rice", "Chicken", "Spices", "Herbs"]
  },
  { 
    id: 4, 
    name: "Pav Bhaji", 
    category: "Snacks", 
    price: 150, 
    rating: 4.6,
    orders: 134,
    prepTime: "20 min",
    chef: "Chef Meera",
    status: "available",
    ingredients: ["Vegetables", "Bread", "Butter", "Spices"]
  },
  { 
    id: 5, 
    name: "Cold Coffee", 
    category: "Beverages", 
    price: 90, 
    rating: 4.5,
    orders: 178,
    prepTime: "5 min",
    chef: "Chef Rohan",
    status: "available",
    ingredients: ["Coffee", "Milk", "Ice Cream", "Chocolate"]
  },
  { 
    id: 6, 
    name: "Gulab Jamun", 
    category: "Dinner", 
    price: 80, 
    rating: 4.8,
    orders: 145,
    prepTime: "30 min",
    chef: "Chef Anjali",
    status: "out-of-stock",
    ingredients: ["Milk Powder", "Sugar", "Cardamom", "Rose Water"]
  },
];

const mealStats = {
  totalMeals: 95,
  activeMeals: 78,
  averageRating: 4.7,
  totalOrders: 1245,
  revenueToday: 45280,
  popularTime: "12:00-14:00"
};

export default function MealPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<any>(null);
  const [sortBy, setSortBy] = useState("popular");

  // Filter meals based on search and category
  const filteredMeals = popularMeals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meal.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || meal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort meals
  const sortedMeals = [...filteredMeals].sort((a, b) => {
    if (sortBy === "popular") return b.orders - a.orders;
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case "available": return "bg-green-100 text-green-800";
      case "low-stock": return "bg-yellow-100 text-yellow-800";
      case "out-of-stock": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "available": return <CheckCircle className="w-4 h-4" />;
      case "low-stock": return <Clock className="w-4 h-4" />;
      case "out-of-stock": return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Meal Management
              </h1>
              <p className="text-gray-600">
                Manage your menu, track popular items, and optimize offerings
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add New Meal
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Meals</p>
                <p className="text-2xl font-bold text-gray-900">{mealStats.totalMeals}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Utensils className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Meals</p>
                <p className="text-2xl font-bold text-gray-900">{mealStats.activeMeals}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{mealStats.averageRating}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{mealStats.totalOrders}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Revenue Today</p>
                <p className="text-2xl font-bold text-gray-900">₹{mealStats.revenueToday.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Peak Time</p>
                <p className="text-2xl font-bold text-gray-900">{mealStats.popularTime}</p>
              </div>
              <div className="p-3 bg-pink-100 rounded-lg">
                <Clock className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Categories & Filters */}
          <div className="lg:col-span-1">
            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedCategory === "all"
                      ? "bg-orange-100 text-orange-700 font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>All Meals</span>
                    <span className="text-sm opacity-75">
                      {popularMeals.length}
                    </span>
                  </div>
                </button>
                {mealCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === category.name
                        ? "bg-orange-100 text-orange-700 font-medium"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${category.color}`}>
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sort By</h3>
              <div className="space-y-2">
                {[
                  { id: "popular", label: "Most Popular" },
                  { id: "rating", label: "Highest Rating" },
                  { id: "price-low", label: "Price: Low to High" },
                  { id: "price-high", label: "Price: High to Low" },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      sortBy === option.id
                        ? "bg-orange-100 text-orange-700 font-medium"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Meal List */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search meals, categories, or ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Filter className="w-5 h-5" />
                  More Filters
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Meal Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedMeals.map((meal) => (
                <div key={meal.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  {/* Meal Image Placeholder */}
                  <div className="h-48 bg-gradient-to-r from-orange-400 to-red-500 relative">
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(meal.status)}`}>
                        {getStatusIcon(meal.status)}
                        {meal.status.replace("-", " ")}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-black/70 text-white rounded-lg text-sm font-medium">
                        {meal.category}
                      </span>
                    </div>
                  </div>

                  {/* Meal Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{meal.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">By {meal.chef}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">₹{meal.price}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{meal.rating}</span>
                          <span className="text-gray-400">({meal.orders} orders)</span>
                        </div>
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Ingredients:</p>
                      <div className="flex flex-wrap gap-2">
                        {meal.ingredients.slice(0, 3).map((ingredient, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {ingredient}
                          </span>
                        ))}
                        {meal.ingredients.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            +{meal.ingredients.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{meal.prepTime}</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingMeal(meal)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {sortedMeals.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-xl">
                <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No meals found</h3>
                <p className="text-gray-600 mb-6">Try changing your search or filters</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-orange-100">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">4.7★</div>
              <div className="text-orange-100">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">25 min</div>
              <div className="text-orange-100">Avg Prep Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">₹1.2L</div>
              <div className="text-orange-100">Monthly Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Meal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingMeal ? "Edit Meal" : "Add New Meal"}
              </h2>
            </div>
            <div className="p-6">
              {/* Modal Form (simplified) */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meal Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter meal name"
                      defaultValue={editingMeal?.name || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      {mealCategories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Add more form fields as needed */}
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingMeal(null);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingMeal(null);
                  // Handle save logic here
                }}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all"
              >
                {editingMeal ? "Update Meal" : "Add Meal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}