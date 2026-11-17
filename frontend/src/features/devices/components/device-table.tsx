import React from 'react';
import { IDevice } from '../types/device.types';
import { RegistrationStatus, DeviceStatus } from '../constants';
import { RegistrationBadge, DeviceStatusBadge } from '../../../components/common/Badge';
import { formatLastSeenIST } from '../../../utils/date-formatter';
import { Eye, Edit2, Play, Wifi, WifiOff, RotateCcw, Trash2, AlertCircle, Server } from 'lucide-react';

interface DeviceTableProps {
  devices: IDevice[];
  isLoading: boolean;
  error: string | null;
  onView: (device: IDevice) => void;
  onEdit: (device: IDevice) => void;
  onDelete: (device: IDevice) => void;
  onRegister: (id: number) => void;
  onSimulateOnline: (id: number) => void;
  onSimulateOffline: (id: number) => void;
  onRetryRegistration: (id: number) => void;
  isActionLoading: boolean;
  onRetryFetch: () => void;
}

export const DeviceTable: React.FC<DeviceTableProps> = ({
  devices,
  isLoading,
  error,
  onView,
  onEdit,
  onDelete,
  onRegister,
  onSimulateOnline,
  onSimulateOffline,
  onRetryRegistration,
  isActionLoading,
  onRetryFetch,
}) => {
  if (isLoading && devices.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center shadow-xs">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading devices from server...</p>
      </div>
    );
  }

  if (error && devices.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-rose-200 p-10 text-center shadow-xs">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-rose-800">Failed to load devices</h4>
        <p className="text-xs text-rose-600 mt-1 max-w-sm mx-auto">{error}</p>
        <button
          onClick={onRetryFetch}
          className="mt-4 px-3.5 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-4 py-3">Device ID / IMEI</th>
              <th className="px-4 py-3">Device Name</th>
              <th className="px-4 py-3">Solution</th>
              <th className="px-4 py-3">Registration</th>
              <th className="px-4 py-3">Device Status</th>
              <th className="px-4 py-3">Last Seen</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                  <Server className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium">No devices found</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Try adjusting your search or filters, or add a new device.
                  </p>
                </td>
              </tr>
            ) : (
              devices.map((device) => {
                const canRegister =
                  device.registrationStatus === RegistrationStatus.PENDING ||
                  device.registrationStatus === RegistrationStatus.ERROR;
                const canRetry = device.registrationStatus === RegistrationStatus.ERROR;
                const isOnline = device.deviceStatus === DeviceStatus.ONLINE;

                return (
                  <tr key={device.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 text-xs font-mono font-medium text-blue-600">
                      {device.deviceIdentifier}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-medium text-slate-800">
                      {device.deviceName}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      {device.solutionType}
                    </td>
                    <td className="px-4 py-3.5">
                      <RegistrationBadge status={device.registrationStatus} />
                    </td>
                    <td className="px-4 py-3.5">
                      <DeviceStatusBadge status={device.deviceStatus} />
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                      {formatLastSeenIST(device.lastSeenUtc)}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onView(device)}
                          title="View Details"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEdit(device)}
                          title="Edit Device"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {canRegister && (
                          <button
                            onClick={() => onRegister(device.id)}
                            disabled={isActionLoading}
                            title="Register Device"
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            Register
                          </button>
                        )}

                        {canRetry && (
                          <button
                            onClick={() => onRetryRegistration(device.id)}
                            disabled={isActionLoading}
                            title="Retry Registration"
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200 transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Retry
                          </button>
                        )}

                        {isOnline ? (
                          <button
                            onClick={() => onSimulateOffline(device.id)}
                            disabled={isActionLoading}
                            title="Simulate Offline"
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                          >
                            <WifiOff className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onSimulateOnline(device.id)}
                            disabled={isActionLoading}
                            title="Simulate Online"
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                          >
                            <Wifi className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => onDelete(device)}
                          title="Delete Device"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceTable;
