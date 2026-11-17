import React, { useState, useMemo } from 'react';
import { IDevice, IDeviceFilters, ICreateDevicePayload, IUpdateDevicePayload } from '../types/device.types';
import { useDevices } from '../hooks/use-devices';
import { DeviceSummaryCards } from './device-summary-cards';
import { DeviceFilterBar } from './device-filter-bar';
import { DeviceTable } from './device-table';
import { DeviceFormModal, DeviceDetailModal, DeviceDeleteModal } from './device-modals';
import { Toast } from '../../../components/common/Toast';
import { Plus, LayoutDashboard, Cpu, CheckSquare, History } from 'lucide-react';

export const DeviceDashboard: React.FC = () => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [regStatusFilter, setRegStatusFilter] = useState('');
  const [devStatusFilter, setDevStatusFilter] = useState('');

  const filterParams: IDeviceFilters = useMemo(
    () => ({
      q: searchQuery,
      registrationStatus: regStatusFilter,
      deviceStatus: devStatusFilter,
    }),
    [searchQuery, regStatusFilter, devStatusFilter]
  );

  // Single cohesive custom hook
  const {
    devices,
    summary,
    isLoading,
    error,
    isSubmitting,
    actionLoadingId,
    toast,
    dismissToast,
    refreshData,
    createDevice,
    updateDevice,
    deleteDevice,
    registerDevice,
    simulateOnline,
    simulateOffline,
    retryRegistration,
  } = useDevices(filterParams);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState<IDevice | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deviceToView, setDeviceToView] = useState<IDevice | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<IDevice | null>(null);

  // Handlers
  const handleOpenCreateModal = () => {
    setDeviceToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (device: IDevice) => {
    setDeviceToEdit(device);
    setIsFormModalOpen(true);
  };

  const handleOpenViewModal = (device: IDevice) => {
    setDeviceToView(device);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (device: IDevice) => {
    setDeviceToDelete(device);
    setIsDeleteModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setRegStatusFilter('');
    setDevStatusFilter('');
  };

  const handleSummaryCardFilter = (reg: string, dev: string) => {
    setRegStatusFilter(reg);
    setDevStatusFilter(dev);
  };

  const handleCreateSubmit = async (payload: ICreateDevicePayload) => {
    return await createDevice(payload);
  };

  const handleUpdateSubmit = async (id: number, payload: IUpdateDevicePayload) => {
    return await updateDevice(id, payload);
  };

  const handleDeleteConfirm = async (id: number) => {
    return await deleteDevice(id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Toast Notification Banner */}
      <Toast toast={toast} onDismiss={dismissToast} />

      {/* Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm tracking-wide text-slate-100">
              ElektraServe
            </span>
            <span className="text-slate-500 font-light">|</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
              POC SAMPLE
            </span>
            <h1 className="text-base font-semibold text-white ml-1">
              IoT Auto Registration
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
              DEMO DATA ONLY
            </span>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Device
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar & Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-48 shrink-0 hidden md:block">
          <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider px-2 block mb-2">
              MENU
            </span>
            <nav className="space-y-1 text-xs">
              <a
                href="#dashboard"
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-md font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                Dashboard
              </a>
              <a
                href="#devices"
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-md font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <Cpu className="w-4 h-4 text-slate-400" />
                Devices
              </a>
              <a
                href="#registration"
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-md font-semibold text-blue-600 bg-blue-50 border border-blue-100"
              >
                <CheckSquare className="w-4 h-4 text-blue-600" />
                Registration
              </a>
              <a
                href="#history"
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-md font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <History className="w-4 h-4 text-slate-400" />
                History
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 space-y-5">
          {/* Summary Cards */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-700 tracking-tight">
                Overview
              </h2>
              <span className="text-xs text-slate-400">
                Live database metrics
              </span>
            </div>
            <DeviceSummaryCards
              summary={summary}
              activeRegFilter={regStatusFilter}
              activeDevFilter={devStatusFilter}
              onFilterChange={handleSummaryCardFilter}
            />
          </section>

          {/* Device Table & Filters */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-700 tracking-tight">
                Device List
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Showing {devices.length} {devices.length === 1 ? 'device' : 'devices'}
              </span>
            </div>

            <DeviceFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              regStatusFilter={regStatusFilter}
              onRegStatusChange={setRegStatusFilter}
              devStatusFilter={devStatusFilter}
              onDevStatusChange={setDevStatusFilter}
              onClearFilters={handleClearFilters}
            />

            <DeviceTable
              devices={devices}
              isLoading={isLoading}
              error={error}
              onView={handleOpenViewModal}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onRegister={registerDevice}
              onSimulateOnline={simulateOnline}
              onSimulateOffline={simulateOffline}
              onRetryRegistration={retryRegistration}
              isActionLoading={Boolean(actionLoadingId)}
              onRetryFetch={refreshData}
            />
          </section>
        </main>
      </div>

      {/* Combined Modals */}
      <DeviceFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        deviceToEdit={deviceToEdit}
        onSubmitCreate={handleCreateSubmit}
        onSubmitUpdate={handleUpdateSubmit}
        isSubmitting={isSubmitting}
      />

      <DeviceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        device={deviceToView}
      />

      <DeviceDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        device={deviceToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={isSubmitting}
      />
    </div>
  );
};

export default DeviceDashboard;
