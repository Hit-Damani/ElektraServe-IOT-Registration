import { useState, useEffect, useCallback } from 'react';
import {
  IDevice,
  IDashboardSummary,
  ICreateDevicePayload,
  IUpdateDevicePayload,
  IDeviceFilters,
} from '../types/device.types';
import deviceApi from '../services/device-api';
import { ToastMessage } from '../../../components/common/Toast';

export function useDevices(filters: IDeviceFilters) {
  const [devices, setDevices] = useState<IDevice[]>([]);
  const [summary, setSummary] = useState<IDashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({
      id: Date.now().toString(),
      type,
      message,
    });
  };

  const dismissToast = () => setToast(null);

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [deviceList, summaryData] = await Promise.all([
        deviceApi.getDevices(filters),
        deviceApi.getDashboardSummary(),
      ]);
      setDevices(deviceList);
      setSummary(summaryData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch device data';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [filters.q, filters.registrationStatus, filters.deviceStatus]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const createDevice = async (payload: ICreateDevicePayload): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      const created = await deviceApi.createDevice(payload);
      showToast(`Device "${created.deviceName}" created successfully!`, 'success');
      await refreshData();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create device';
      showToast(msg, 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateDevice = async (id: number, payload: IUpdateDevicePayload): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      const updated = await deviceApi.updateDevice(id, payload);
      showToast(`Device "${updated.deviceName}" updated successfully!`, 'success');
      await refreshData();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update device';
      showToast(msg, 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteDevice = async (id: number): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      await deviceApi.deleteDevice(id);
      showToast('Device deleted successfully.', 'info');
      await refreshData();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete device';
      showToast(msg, 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const registerDevice = async (id: number): Promise<void> => {
    try {
      setActionLoadingId(id);
      const registered = await deviceApi.registerDevice(id);
      showToast(`Device "${registered.deviceIdentifier}" registered successfully!`, 'success');
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      showToast(msg, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const simulateOnline = async (id: number): Promise<void> => {
    try {
      setActionLoadingId(id);
      await deviceApi.simulateOnline(id);
      showToast('Status simulated to Online.', 'success');
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to simulate online';
      showToast(msg, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const simulateOffline = async (id: number): Promise<void> => {
    try {
      setActionLoadingId(id);
      await deviceApi.simulateOffline(id);
      showToast('Status simulated to Offline.', 'info');
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to simulate offline';
      showToast(msg, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const retryRegistration = async (id: number): Promise<void> => {
    try {
      setActionLoadingId(id);
      await deviceApi.retryRegistration(id);
      showToast('Registration reset to Pending. You can now register.', 'info');
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retry registration';
      showToast(msg, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  return {
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
  };
}

export default useDevices;
