"use client";

import { useState, useEffect } from "react";
import { useQueueStore } from "@/src/stores/useQueueStore";
import { 
  Ticket, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle,
  QrCode,
  Download,
  Bell,
  RefreshCw
} from "lucide-react";

export default function QueuePage() {
  const { tokenNumber, waitingTime, assignToken } = useQueueStore();
  const [currentTime, setCurrentTime] = useState("");
  const [activeTokens, setActiveTokens] = useState(42);
  const [queuePosition, setQueuePosition] = useState(0);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Token #12 is now being served", type: "info", time: "2 mins ago" },
    { id: 2, message: "Estimated wait time updated", type: "update", time: "5 mins ago" },
    { id: 3, message: "Peak hours ending soon", type: "warning", time: "10 mins ago" }
  ]);

  // Update time and simulate queue movement
  useEffect(() => {
    // Update current time
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }).toUpperCase();
      setCurrentTime(timeString);
    };
    
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);

    // Simulate queue updates
    const queueInterval = setInterval(() => {
      if (queuePosition > 0) {
        setQueuePosition(prev => Math.max(0, prev - 1));
      }
      setActiveTokens(prev => Math.max(0, prev - 1));
    }, 30000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(queueInterval);
    };
  }, [queuePosition]);

  const handleGetToken = () => {
    // Assign token and calculate queue position
    const tokenId = assignToken();
    const newPosition = Math.floor(Math.random() * 20) + 1; // Random position 1-20
    setQueuePosition(newPosition);
    setActiveTokens(prev => prev + 1);
    
    // Add notification
    setNotifications(prev => [{
      id: Date.now(),
      message: `New token #${tokenId} assigned`,
      type: "info",
      time: "Just now"
    }, ...prev.slice(0, 2)]);
  };

  const handleDownloadToken = () => {
    alert("Token QR code downloaded!");
  };

  const getWaitColor = (minutes: number) => {
    if (minutes <= 10) return "text-green-600";
    if (minutes <= 20) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Cafeteria Queue Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time token status and waiting updates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Queue Status */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Token Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Ticket className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Your Token Status</h2>
                    <p className="text-gray-600">Current queue information</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Current Time</div>
                  <div className="text-lg font-bold text-gray-900">{currentTime}</div>
                </div>
              </div>

              {/* Token Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Ticket className="text-blue-600" size={20} />
                    <span className="text-gray-600 font-medium">Your Token</span>
                  </div>
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    #{tokenNumber || "---"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {tokenNumber ? "Active" : "No token assigned"}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="text-yellow-600" size={20} />
                    <span className="text-gray-600 font-medium">Estimated Wait</span>
                  </div>
                  <div className={`text-5xl font-bold mb-2 ${getWaitColor(waitingTime)}`}>
                    {waitingTime || 0}
                  </div>
                  <div className="text-sm text-gray-500">minutes</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="text-green-600" size={20} />
                    <span className="text-gray-600 font-medium">Queue Position</span>
                  </div>
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {queuePosition || 0}
                  </div>
                  <div className="text-sm text-gray-500">
                    {queuePosition === 0 ? "You're next!" : "ahead of you"}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {queuePosition > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Your Progress</span>
                    <span>{queuePosition} tokens ahead</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(10, 100 - (queuePosition * 5))}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleGetToken}
                  className="flex-1 min-w-[200px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-3"
                >
                  <Ticket size={20} />
                  {tokenNumber ? "Get Another Token" : "Get Your Token"}
                </button>
                
                {tokenNumber && (
                  <>
                    <button
                      onClick={handleDownloadToken}
                      className="flex-1 min-w-[200px] border-2 border-blue-500 text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-3"
                    >
                      <Download size={20} />
                      Download Token QR
                    </button>
                    
                    <button className="flex-1 min-w-[200px] border-2 border-gray-300 px-8 py-4 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-3">
                      <Bell size={20} />
                      Enable Alerts
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Queue Visualization */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users size={20} />
                Live Queue Visualization
              </h3>
              
              <div className="space-y-4">
                {/* Current Serving */}
                <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">Currently Serving</div>
                      <div className="text-2xl font-bold text-gray-900">Token #{tokenNumber - queuePosition - 1}</div>
                    </div>
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                </div>

                {/* Next in Line */}
                {queuePosition > 0 && (
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-500">Next in Line</div>
                        <div className="text-2xl font-bold text-gray-900">Token #{tokenNumber - queuePosition}</div>
                      </div>
                      <Clock className="text-yellow-600" size={24} />
                    </div>
                  </div>
                )}

                {/* Your Position */}
                {queuePosition > 0 && (
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-500">Your Position</div>
                        <div className="text-2xl font-bold text-gray-900">Token #{tokenNumber}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {queuePosition} tokens ahead of you
                        </div>
                      </div>
                      <Ticket className="text-blue-600" size={24} />
                    </div>
                  </div>
                )}

                {/* Queue Length */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">Total in Queue</div>
                      <div className="text-xl font-bold text-gray-900">{activeTokens} tokens</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Avg. Serve Time</div>
                      <div className="text-xl font-bold text-gray-900">2.5 min/token</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Side Info */}
          <div className="space-y-8">
            {/* Notifications Panel */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Bell size={20} />
                  Queue Notifications
                </h3>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <RefreshCw size={18} className="text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl border-l-4 ${
                      notification.type === 'warning' 
                        ? 'border-l-yellow-500 bg-yellow-50'
                        : notification.type === 'update'
                        ? 'border-l-blue-500 bg-blue-50'
                        : 'border-l-green-500 bg-green-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-3 text-center text-sm font-medium text-gray-600 hover:text-gray-900 border border-dashed border-gray-300 rounded-xl hover:border-gray-400 transition">
                View All Notifications
              </button>
            </div>

            {/* QR Token Display */}
            {tokenNumber && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <QrCode size={20} />
                  Your Token QR Code
                </h3>
                <div className="flex flex-col items-center">
                  {/* Mock QR Code */}
                  <div className="w-48 h-48 bg-gradient-to-br from-gray-900 to-black rounded-xl flex items-center justify-center mb-4">
                    <div className="text-white text-center">
                      <div className="text-3xl font-bold mb-2">#{tokenNumber}</div>
                      <div className="text-sm opacity-75">CAFETERIA TOKEN</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center mb-4">
                    Show this QR code at the counter for scanning
                  </p>
                  <button
                    onClick={handleDownloadToken}
                    className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Download QR Code
                  </button>
                </div>
              </div>
            )}

            {/* Tips & Guidelines */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">💡 Queue Tips</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white rounded-full mt-1.5"></div>
                  <span>Arrive 5 mins before your estimated time</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white rounded-full mt-1.5"></div>
                  <span>Keep your token QR code ready</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white rounded-full mt-1.5"></div>
                  <span>Real-time updates refresh every 30 seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white rounded-full mt-1.5"></div>
                  <span>Cancel token if you can't make it</span>
                </li>
              </ul>
            </div>

            {/* Live Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Live Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Active Tokens</span>
                  <span className="font-bold text-gray-900">{activeTokens}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Served Today</span>
                  <span className="font-bold text-gray-900">247</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Avg. Wait Time</span>
                  <span className="font-bold text-gray-900">14 mins</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Peak Wait Time</span>
                  <span className="font-bold text-red-600">28 mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}