import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OverviewPage } from './pages/OverviewPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { LandlordsPage } from './pages/LandlordsPage';
import { TenantsPage } from './pages/TenantsPage';
import { RentPage } from './pages/RentPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { TasksPage } from './pages/TasksPage';
import { WhatsAppSimulatorPage } from './pages/WhatsAppSimulatorPage';
import { SettingsPage } from './pages/SettingsPage';
import { api } from './services/api';
import { Property, Landlord, Tenant, RentSchedule, PaymentRecord, MaintenanceRequest, TaskItem } from './types';
import { RefreshCw, X, Smartphone } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Core Data State
  const [properties, setProperties] = useState<Property[]>([]);
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [rentSchedules, setRentSchedules] = useState<RentSchedule[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  const loadData = async () => {
    try {
      const [propsData, lData, tData, sData, pData, mData, tskData] = await Promise.all([
        api.getProperties(),
        api.getLandlords(),
        api.getTenants(),
        api.getRentSchedules(),
        api.getPayments(),
        api.getMaintenance(),
        api.getTasks()
      ]);

      setProperties(propsData);
      setLandlords(lData);
      setTenants(tData);
      setRentSchedules(sData);
      setPayments(pData);
      setMaintenance(mData);
      setTasks(tskData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const overdueCount = rentSchedules.filter(s => s.status === 'overdue').length;
  const pendingApprovalsCount = maintenance.filter(m => m.status === 'pending_landlord_approval').length;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100 flex flex-col antialiased">
      {/* Top Navbar */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        openSimulator={() => setIsSimulatorOpen(true)} 
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          arrearsCount={overdueCount}
          pendingMaintCount={pendingApprovalsCount}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-xs text-surface-400">
              <RefreshCw className="w-6 h-6 animate-spin text-brand-500" />
              <span>Connecting to Locari Central Single Source of Truth...</span>
            </div>
          ) : (
            <>
              {currentTab === 'overview' && (
                <OverviewPage 
                  properties={properties}
                  landlords={landlords}
                  rentSchedules={rentSchedules}
                  maintenance={maintenance}
                  tasks={tasks}
                  setCurrentTab={setCurrentTab}
                  openSimulator={() => setIsSimulatorOpen(true)}
                />
              )}

              {currentTab === 'properties' && (
                <PropertiesPage 
                  properties={properties}
                  onRefresh={loadData}
                />
              )}

              {currentTab === 'landlords' && (
                <LandlordsPage 
                  landlords={landlords}
                  onRefresh={loadData}
                />
              )}

              {currentTab === 'tenants' && (
                <TenantsPage 
                  tenants={tenants}
                  properties={properties}
                  onRefresh={loadData}
                />
              )}

              {currentTab === 'rent' && (
                <RentPage 
                  schedules={rentSchedules}
                  payments={payments}
                  onRefresh={loadData}
                />
              )}

              {currentTab === 'maintenance' && (
                <MaintenancePage 
                  maintenance={maintenance}
                  properties={properties}
                  onRefresh={loadData}
                />
              )}

              {currentTab === 'tasks' && (
                <TasksPage 
                  tasks={tasks}
                  properties={properties}
                  onRefresh={loadData}
                />
              )}

              {currentTab === 'simulator' && (
                <WhatsAppSimulatorPage 
                  onDataMutated={loadData}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsPage />
              )}
            </>
          )}
        </main>
      </div>

      {/* Slide-over WhatsApp Assistant Simulator Modal */}
      {isSimulatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 p-6 sm:p-8 space-y-4 shadow-2xl relative animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-surface-200 dark:border-surface-800">
              <div className="flex items-center gap-2.5 font-headline font-bold text-lg text-surface-900 dark:text-surface-100">
                <Smartphone className="w-5 h-5 text-brand-500" />
                <span>Locari WhatsApp Assistant (Live Simulator)</span>
              </div>
              <button
                onClick={() => setIsSimulatorOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-500 hover:text-surface-900 dark:hover:text-surface-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <WhatsAppSimulatorPage onDataMutated={loadData} />
          </div>
        </div>
      )}
    </div>
  );
};
