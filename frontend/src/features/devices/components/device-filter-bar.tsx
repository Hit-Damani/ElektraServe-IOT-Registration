import React from 'react';
import { Search, X } from 'lucide-react';
import { RegistrationStatus, DeviceStatus } from '../constants';

interface DeviceFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  regStatusFilter: string;
  onRegStatusChange: (value: string) => void;
  devStatusFilter: string;
  onDevStatusChange: (value: string) => void;
  onClearFilters: () => void;
}

export const DeviceFilterBar: React.FC<DeviceFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  regStatusFilter,
  onRegStatusChange,
  devStatusFilter,
  onDevStatusChange,
  onClearFilters,
}) => {
  const hasActiveFilters = Boolean(searchQuery || regStatusFilter || devStatusFilter);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search device ID or name..."
          className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Registration Status Filter */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-slate-500 whitespace-nowrap">
          Registration:
        </label>
        <select
          value={regStatusFilter}
          onChange={(e) => onRegStatusChange(e.target.value)}
          className="text-sm rounded-md border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value={RegistrationStatus.PENDING}>Pending</option>
          <option value={RegistrationStatus.REGISTERED}>Registered</option>
          <option value={RegistrationStatus.ERROR}>Error</option>
        </select>
      </div>

      {/* Device Status Filter */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-slate-500 whitespace-nowrap">
          Device status:
        </label>
        <select
          value={devStatusFilter}
          onChange={(e) => onDevStatusChange(e.target.value)}
          className="text-sm rounded-md border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value={DeviceStatus.ONLINE}>Online</option>
          <option value={DeviceStatus.OFFLINE}>Offline</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      )}
    </div>
  );
};

export default DeviceFilterBar;
