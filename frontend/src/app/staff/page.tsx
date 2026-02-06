'use client';

import StaffDashboard from '@/src/components/StaffDashboard/StaffDashboard';
import CreateSlotModal from '@/src/components/CreateSlotModal/CreateSlotModal';
import ForecastPanel from '@/src/components/ForecastPanel/ForecastPanel';
import { useStaffStore } from '@/src/stores/staffStore';

export default function StaffPage() {
  const { isCreateSlotModalOpen, isForecastPanelOpen } = useStaffStore();

  return (
    <div className="min-h-screen bg-background">
      <StaffDashboard />
      {isCreateSlotModalOpen && <CreateSlotModal />}
      {isForecastPanelOpen && <ForecastPanel />}
    </div>
  );
}