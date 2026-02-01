"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import '../styles/globals.css'
import { 
  Calendar, 
  Clock, 
  Users, 
  BarChart3, 
  ArrowRight, 
  Sparkles,
  Shield,
  Leaf,
  Zap,
  TrendingUp,
  TrendingDown,
  Ticket,
  Smartphone,
  Cloud,
  ChevronRight,
  Menu,
  X,
  Star,
  User,
  Bell,
  Coffee,
  CheckCircle,
  QrCode,
  MapPin,
  LineChart,
  Settings
} from "lucide-react";

export default function Home() {
  const [time, setTime] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);

    // Simulate loading completion
    setTimeout(() => setIsLoading(false), 500);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    {
      icon: Calendar,
      title: "Smart Booking",
      description: "AI-powered slot predictions with 95% accuracy",
      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
      stats: "95% accuracy",
      delay: "delay-0"
    },
    {
      icon: Clock,
      title: "Live Queue",
      description: "Real-time tracking with dynamic wait time updates",
      color: "bg-gradient-to-br from-emerald-500 to-green-500",
      stats: "Real-time updates",
      delay: "delay-75"
    },
    {
      icon: TrendingUp,
      title: "AI Forecasting",
      description: "Predict crowd levels using machine learning models",
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      stats: "98% precision",
      delay: "delay-150"
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Reduce food waste by 40% with smart preparation",
      color: "bg-gradient-to-br from-teal-500 to-emerald-500",
      stats: "40% less waste",
      delay: "delay-300"
    },
  ];

  const stats = [
    { label: "Active Users", value: "2.4K", change: "+12%", icon: Users, trend: "up" },
    { label: "Daily Bookings", value: "1.2K", change: "+18%", icon: Ticket, trend: "up" },
    { label: "Avg Wait Time", value: "8 min", change: "-25%", icon: Clock, trend: "down" },
    { label: "Waste Reduced", value: "42%", change: "+7%", icon: Leaf, trend: "up" },
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Student",
      text: "Cut my wait time from 30 to 8 minutes! This app is a lifesaver between classes.",
      avatar: "AJ",
      rating: 5,
    },
    {
      name: "Maria Chen",
      role: "Faculty",
      text: "The sustainability metrics are revolutionary. Our campus has reduced food waste by 40%.",
      avatar: "MC",
      rating: 5,
    },
    {
      name: "David Park",
      role: "Staff",
      text: "Queue management has never been this smooth. The real-time updates are incredibly accurate.",
      avatar: "DP",
      rating: 5,
    },
  ];

  const queueData = [
    { time: "12:00", wait: "15 min", color: "bg-red-500", height: "h-20" },
    { time: "13:00", wait: "12 min", color: "bg-orange-500", height: "h-16" },
    { time: "14:00", wait: "8 min", color: "bg-yellow-500", height: "h-12" },
    { time: "15:00", wait: "5 min", color: "bg-green-500", height: "h-8" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Coffee className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-blue-200/20 to-cyan-200/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-emerald-200/15 to-green-200/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 h-64 w-64 rounded-full bg-gradient-to-r from-purple-200/10 to-pink-200/5 blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrollY > 50 
          ? 'border-b border-gray-200/50 bg-white/90 backdrop-blur-xl shadow-lg shadow-blue-500/5' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-3 shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <Coffee className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-2xl font-bold text-transparent">
                  SmartCafé
                </h1>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p className="text-xs font-medium text-gray-500">AI-Powered Dining • Live</p>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-3 rounded-full bg-gradient-to-r from-gray-100 to-white px-4 py-2 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">{time}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Link 
                  href="/dashboard" 
                  className="group relative px-4 py-2 font-medium text-gray-700 transition-all duration-300 hover:text-blue-600"
                >
                  <span className="relative z-10">Dashboard</span>
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  href="/queue" 
                  className="group relative px-4 py-2 font-medium text-gray-700 transition-all duration-300 hover:text-blue-600"
                >
                  <span className="relative z-10">Queue</span>
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  href="/menu" 
                  className="group relative px-4 py-2 font-medium text-gray-700 transition-all duration-300 hover:text-blue-600"
                >
                  <span className="relative z-10">Menu</span>
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
              
              <div className="group cursor-pointer">
                <Link 
                  href="/booking" 
                  className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <span className="relative flex items-center gap-2">
                    Book Now
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>

              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 border-t border-gray-200 pt-4 animate-slideDown">
              <div className="flex flex-col gap-3">
                <Link href="/dashboard" className="px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-300">Dashboard</Link>
                <Link href="/queue" className="px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-300">Queue</Link>
                <Link href="/menu" className="px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-300">Menu</Link>
                <Link href="/booking" className="px-4 py-3 rounded-lg bg-blue-600 text-white text-center transition-all duration-300 hover:bg-blue-700">Book Now</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-12 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-2 shadow-sm animate-slideUp">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">AI-Powered Since 2024</span>
              <div className="h-1 w-1 rounded-full bg-emerald-400"></div>
              <span className="text-sm text-emerald-600">v2.0</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-slideUp delay-100">
              <span className="block text-gray-900">Smarter Dining,</span>
              <span className="relative">
                <span className="relative bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                  Zero Wait Times
                </span>
                <div className="absolute -bottom-2 left-0 h-1.5 bg-gradient-to-r from-blue-500 to-emerald-500 animate-widthExpand"></div>
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 md:text-xl max-w-2xl animate-fadeIn delay-200">
              Experience seamless dining with AI-driven booking, real-time queue optimization, 
              and sustainable operations. Join thousands who have reduced wait times by 75%.
            </p>
            
            <div className="flex flex-wrap gap-4 animate-slideUp delay-300">
              <Link
                href="/booking"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-8 py-4 font-semibold text-white shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <span className="relative flex items-center gap-3">
                  Start Booking
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              
              <Link
                href="/dashboard"
                className="group rounded-2xl border-2 border-gray-300 bg-white px-8 py-4 font-semibold text-gray-800 shadow-xl transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:shadow-2xl"
              >
                <span className="flex items-center gap-3">
                  Live Dashboard
                  <BarChart3 className="h-5 w-5" />
                </span>
              </Link>
            </div>
            
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 animate-fadeIn delay-400">
              <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200/50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="text-2xl font-bold text-gray-900">75%</div>
                <div className="text-sm text-gray-600">Wait Time Reduced</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200/50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="text-2xl font-bold text-gray-900">40%</div>
                <div className="text-sm text-gray-600">Less Food Waste</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200/50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="text-2xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200/50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="text-2xl font-bold text-gray-900">4.9</div>
                <div className="text-sm text-gray-600">User Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative animate-slideUp delay-200">
            {/* Main Dashboard Card */}
            <div className="relative rounded-3xl border border-gray-200/50 bg-white/80 backdrop-blur-xl p-6 shadow-2xl shadow-blue-500/10 transition-all duration-300 hover:shadow-3xl">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5">
                    <Ticket className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Live Queue Dashboard</h3>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <p className="text-sm text-gray-600">Updated every 30s</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-full bg-gradient-to-r from-emerald-100 to-green-100 px-4 py-1.5 animate-pulse">
                  <span className="text-sm font-semibold text-emerald-700">Active</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-5 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Tokens</p>
                      <p className="text-3xl font-bold text-gray-900">42</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-blue-200 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-progressBar"></div>
                  </div>
                </div>
                
                <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 p-5 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Wait Time</p>
                      <p className="text-3xl font-bold text-emerald-700">8 min</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-emerald-600 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    25% less than yesterday
                  </div>
                </div>
              </div>

              {/* Queue Timeline */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Peak Hours</h4>
                  <span className="text-sm text-gray-600">Today</span>
                </div>
                <div className="flex items-end justify-between h-24">
                  {queueData.map((item, index) => (
                    <div 
                      key={index}
                      className="flex flex-col items-center animate-growBar"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`w-8 rounded-t-lg ${item.color} ${item.height} transition-all duration-300 hover:w-12`}></div>
                      <span className="mt-2 text-xs font-medium text-gray-600">{item.time}</span>
                      <span className="text-xs text-gray-500">{item.wait}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <button className="flex-1 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 p-3 text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                  Scan QR
                </button>
                <button className="flex-1 rounded-xl border border-gray-300 bg-white p-3 font-medium hover:bg-gray-50 transition-all duration-300 hover:scale-105">
                  View Menu
                </button>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -bottom-6 -right-6 animate-slideUp delay-400">
              <div className="rounded-2xl border border-gray-200/50 bg-white/90 backdrop-blur-lg p-4 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">156+</p>
                    <p className="text-xs text-gray-600">Today's visitors</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -left-6 animate-slideUp delay-600">
              <div className="rounded-2xl border border-gray-200/50 bg-white/90 backdrop-blur-lg p-4 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-orange-100 p-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Instant</p>
                    <p className="text-xs text-gray-600">Booking speed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 mb-4 animate-slideUp">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">AI-Powered Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slideUp delay-100">
            Why Choose SmartCafé?
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 animate-fadeIn delay-200">
            Our system combines machine learning with real-time data to optimize every aspect of your dining experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group relative cursor-pointer rounded-2xl border p-6 transition-all duration-300 animate-slideUp ${feature.delay} ${
                  activeFeature === index 
                    ? 'border-blue-300 bg-gradient-to-br from-white to-blue-50 shadow-xl shadow-blue-500/10 scale-105' 
                    : 'border-gray-200/50 bg-white/50 hover:border-blue-200 hover:shadow-lg hover:scale-105'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className={`absolute top-0 right-0 h-24 w-24 rounded-full ${feature.color} opacity-5 blur-xl`}></div>
                
                <div className="relative">
                  <div className={`mb-4 inline-flex rounded-xl ${feature.color} p-3 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {feature.stats}
                    </span>
                    <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                      activeFeature === index ? 'translate-x-1' : 'group-hover:translate-x-1'
                    }`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Details Panel */}
        <div className={`mt-8 overflow-hidden transition-all duration-500 ${
          activeFeature !== null ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="rounded-2xl bg-gradient-to-r from-gray-50 to-white p-6 border border-gray-200 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {features[activeFeature]?.title}
                </h3>
                <p className="text-gray-600">
                  {features[activeFeature]?.description}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm text-gray-600">Real-time updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Secure & reliable</span>
                  </div>
                </div>
              </div>
              <button className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50 p-6 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl animate-slideUp delay-${index * 100}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-lg transition-transform duration-300 group-hover:scale-110 ${
                      stat.trend === 'up' ? 'bg-emerald-100' : 'bg-blue-100'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        stat.trend === 'up' ? 'text-emerald-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <span className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === 'up' ? 'text-emerald-600' : 'text-blue-600'
                    }`}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {stat.change}
                    </span>
                  </div>
                  
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600">
                    {stat.label}
                  </p>
                  
                  <div className="mt-4 h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div className={`h-full rounded-full animate-progressBar ${
                      stat.trend === 'up' 
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    }`}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"></div>
          
          <div className="relative text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-4 py-2 mb-4 backdrop-blur-sm animate-slideUp">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">4.9/5 Rating</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 animate-slideUp delay-100">
              Loved by Thousands
            </h2>
            <p className="mx-auto max-w-2xl text-gray-300 animate-fadeIn delay-200">
              Join students, faculty, and staff who transformed their cafeteria experience
            </p>
          </div>
          
          <div className="relative grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-slideUp delay-${index * 100}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative group">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 blur opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                    <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <span className="font-semibold text-white">{testimonial.avatar}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-8 md:p-12 animate-fadeIn">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl"></div>
          </div>
          
          <div className="relative text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-slideUp">
              Ready to Experience the Future?
            </h2>
            <p className="mx-auto max-w-2xl text-blue-100 mb-8 animate-fadeIn delay-100">
              Join our community of smart diners. No downloads required. Start in seconds.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-slideUp delay-200">
              <Link
                href="/booking"
                className="group relative overflow-hidden rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <span className="relative flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
              >
                View Live Demo
              </Link>
            </div>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-100 animate-fadeIn delay-300">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-white/10 p-1.5">
                  <Smartphone className="h-4 w-4" />
                </div>
                <span>Mobile-Friendly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-white/10 p-1.5">
                  <Cloud className="h-4 w-4" />
                </div>
                <span>Cloud-Based</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-white/10 p-1.5">
                  <Shield className="h-4 w-4" />
                </div>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-white/10 p-1.5">
                  <Zap className="h-4 w-4" />
                </div>
                <span>Instant Setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-2.5">
                  <Coffee className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">SmartCafé</h3>
                  <p className="text-sm text-gray-600">Redefining Dining Experiences</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                AI-powered dining solutions for modern campuses and workplaces.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/booking" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Booking</Link></li>
                <li><Link href="/queue" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Queue</Link></li>
                <li><Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Dashboard</Link></li>
                <li><Link href="/menu" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Digital Menu</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">About</Link></li>
                <li><Link href="/careers" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Careers</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Blog</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Connect</h4>
              <div className="flex gap-3">
                <div className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200 transition-colors duration-300 cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">𝕏</span>
                </div>
                <div className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200 transition-colors duration-300 cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">in</span>
                </div>
                <div className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200 transition-colors duration-300 cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">ig</span>
                </div>
                <div className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200 transition-colors duration-300 cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">▷</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200/50 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                © 2024 SmartCafé. All rights reserved. Part of the Smart Campus Initiative.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <Link href="/privacy" className="hover:text-gray-700 transition-colors duration-300">Privacy</Link>
                <Link href="/terms" className="hover:text-gray-700 transition-colors duration-300">Terms</Link>
                <Link href="/cookies" className="hover:text-gray-700 transition-colors duration-300">Cookies</Link>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span>All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}