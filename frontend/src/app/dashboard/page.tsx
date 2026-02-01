import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import KpiGrid from "@/src/components/dashboard/KpiGrid";
import ForecastAnalytics from "@/src/components/dashboard/ForecastAnalytics";
import SustainabilityDashboard from "@/src/components/dashboard/SustainabilityDashboard";
import QueueOptimization from "@/src/components/dashboard/QueueOptimization";
import DemandHeatmap from "@/src/components/dashboard/DemandHeatmap";
import { fetchDashboardData } from "@/src/lib/api/dashboard";
import { ForecastProvider } from "@/src/contexts/ForecastContext";
import ForecastControls from "@/src/components/dashboard/ForecastControls";
// SSR Page - fetches initial data
export default async function DashboardPage() {
  // Fetch initial data server-side
  const initialData = await fetchDashboardData();
  
  return (
    <ForecastProvider initialData={initialData}>
      <DashboardLayout>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Smart Cafeteria Intelligence Platform</h1>
          <p className="text-gray-600 mt-2">
            AI-powered demand forecasting, queue optimization, and sustainability analytics
          </p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="space-y-8">
          {/* KPI Overview */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Performance Indicators</h2>
            <KpiGrid data={initialData.kpis} />
          </section>

          {/* Forecast & Analytics */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Demand Forecasting & Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ForecastAnalytics />
              <DemandHeatmap />
            </div>
          </section>

          {/* Queue & Token Management */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Queue Optimization & Token Management</h2>
            <QueueOptimization />
          </section>

          {/* Sustainability & Ethics */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sustainability & Ethical Operations</h2>
            <SustainabilityDashboard />
          </section>

          {/* AI Forecasting Controls */}
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Forecasting Parameters</h2>
            <ForecastControls />
          </section>
        </div>
      </DashboardLayout>
    </ForecastProvider>
  );
}