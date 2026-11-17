import React from 'react';
import { IDashboardSummary } from '../types/device.types';
import { RegistrationStatus, DeviceStatus } from '../constants';

interface DeviceSummaryCardsProps {
  summary: IDashboardSummary | null;
  activeRegFilter: string;
  activeDevFilter: string;
  onFilterChange: (regFilter: string, devFilter: string) => void;
}

export const DeviceSummaryCards: React.FC<DeviceSummaryCardsProps> = ({
  summary,
  activeRegFilter,
  activeDevFilter,
  onFilterChange,
}) => {
  const cards = [
    {
      label: 'TOTAL DEVICES',
      count: summary?.total ?? 0,
      textColor: 'text-slate-900',
      isActive: !activeRegFilter && !activeDevFilter,
      onClick: () => onFilterChange('', ''),
    },
    {
      label: 'PENDING',
      count: summary?.pending ?? 0,
      textColor: 'text-amber-600',
      isActive: activeRegFilter === RegistrationStatus.PENDING && !activeDevFilter,
      onClick: () => {
        const isCurrent = activeRegFilter === RegistrationStatus.PENDING && !activeDevFilter;
        onFilterChange(isCurrent ? '' : RegistrationStatus.PENDING, '');
      },
    },
    {
      label: 'REGISTERED',
      count: summary?.registered ?? 0,
      textColor: 'text-emerald-600',
      isActive: activeRegFilter === RegistrationStatus.REGISTERED && !activeDevFilter,
      onClick: () => {
        const isCurrent = activeRegFilter === RegistrationStatus.REGISTERED && !activeDevFilter;
        onFilterChange(isCurrent ? '' : RegistrationStatus.REGISTERED, '');
      },
    },
    {
      label: 'ERROR',
      count: summary?.error ?? 0,
      textColor: 'text-rose-600',
      isActive: activeRegFilter === RegistrationStatus.ERROR && !activeDevFilter,
      onClick: () => {
        const isCurrent = activeRegFilter === RegistrationStatus.ERROR && !activeDevFilter;
        onFilterChange(isCurrent ? '' : RegistrationStatus.ERROR, '');
      },
    },
    {
      label: 'ONLINE',
      count: summary?.online ?? 0,
      textColor: 'text-blue-600',
      isActive: !activeRegFilter && activeDevFilter === DeviceStatus.ONLINE,
      onClick: () => {
        const isCurrent = !activeRegFilter && activeDevFilter === DeviceStatus.ONLINE;
        onFilterChange('', isCurrent ? '' : DeviceStatus.ONLINE);
      },
    },
    {
      label: 'OFFLINE',
      count: summary?.offline ?? 0,
      textColor: 'text-slate-600',
      isActive: !activeRegFilter && activeDevFilter === DeviceStatus.OFFLINE,
      onClick: () => {
        const isCurrent = !activeRegFilter && activeDevFilter === DeviceStatus.OFFLINE;
        onFilterChange('', isCurrent ? '' : DeviceStatus.OFFLINE);
      },
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => (
        <button
          key={card.label}
          onClick={card.onClick}
          className={`flex flex-col justify-center p-4 bg-white rounded-lg border text-left transition-all cursor-pointer ${
            card.isActive
              ? 'border-blue-500 shadow-sm ring-1 ring-blue-500'
              : 'border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <span className="text-[11px] font-semibold text-slate-500 tracking-wider">
            {card.label}
          </span>
          <span className={`text-2xl font-bold mt-1 ${card.textColor}`}>
            {card.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default DeviceSummaryCards;
