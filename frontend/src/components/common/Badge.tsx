import React from 'react';
import { RegistrationStatus, DeviceStatus } from '../../features/devices/constants';

interface RegistrationBadgeProps {
  status: RegistrationStatus | string;
}

export const RegistrationBadge: React.FC<RegistrationBadgeProps> = ({ status }) => {
  switch (status) {
    case RegistrationStatus.REGISTERED:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
          Registered
        </span>
      );
    case RegistrationStatus.PENDING:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
          Pending
        </span>
      );
    case RegistrationStatus.ERROR:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">
          Error
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
};

interface DeviceStatusBadgeProps {
  status: DeviceStatus | string;
}

export const DeviceStatusBadge: React.FC<DeviceStatusBadgeProps> = ({ status }) => {
  const isOnline = status === DeviceStatus.ONLINE;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isOnline
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-slate-100 text-slate-600 border border-slate-200'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}
      />
      {status}
    </span>
  );
};
