"use client";

export default function QueueOptimization() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Queue Optimization</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Active Tokens</div>
            <div className="text-2xl font-bold">42</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Avg Wait Time</div>
            <div className="text-2xl font-bold">12m</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Served Today</div>
            <div className="text-2xl font-bold">247</div>
          </div>
        </div>
      </div>
    </div>
  );
}