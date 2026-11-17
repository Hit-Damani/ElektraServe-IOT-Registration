import React, { useState, useEffect } from 'react';
import { IDevice, ICreateDevicePayload, IUpdateDevicePayload } from '../types/device.types';
import { SolutionType } from '../constants';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { RegistrationBadge, DeviceStatusBadge } from '../../../components/common/Badge';
import { formatToIST } from '../../../utils/date-formatter';
import { AlertCircle, AlertTriangle, Calendar, Hash, Tag, Activity } from 'lucide-react';

/* =========================================================================
   1. Device Form Modal (Create / Edit)
   ========================================================================= */
interface DeviceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceToEdit: IDevice | null;
  onSubmitCreate: (data: ICreateDevicePayload) => Promise<boolean>;
  onSubmitUpdate: (id: number, data: IUpdateDevicePayload) => Promise<boolean>;
  isSubmitting: boolean;
}

export const DeviceFormModal: React.FC<DeviceFormModalProps> = ({
  isOpen,
  onClose,
  deviceToEdit,
  onSubmitCreate,
  onSubmitUpdate,
  isSubmitting,
}) => {
  const isEditMode = Boolean(deviceToEdit);

  const [deviceIdentifier, setDeviceIdentifier] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [solutionType, setSolutionType] = useState<SolutionType>(SolutionType.SOLAR);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (deviceToEdit) {
      setDeviceIdentifier(deviceToEdit.deviceIdentifier);
      setDeviceName(deviceToEdit.deviceName);
      setSolutionType(deviceToEdit.solutionType);
    } else {
      setDeviceIdentifier('');
      setDeviceName('');
      setSolutionType(SolutionType.SOLAR);
    }
    setErrors({});
  }, [deviceToEdit, isOpen]);

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!isEditMode && !deviceIdentifier.trim()) {
      errs.deviceIdentifier = 'Device ID / IMEI is required';
    } else if (!isEditMode && deviceIdentifier.trim().length > 50) {
      errs.deviceIdentifier = 'Identifier must be 50 characters or less';
    }

    if (!deviceName.trim()) {
      errs.deviceName = 'Device name is required';
    } else if (deviceName.trim().length > 100) {
      errs.deviceName = 'Device name must be 100 characters or less';
    }

    if (!solutionType) {
      errs.solutionType = 'Solution type is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditMode && deviceToEdit) {
      const success = await onSubmitUpdate(deviceToEdit.id, {
        deviceName: deviceName.trim(),
        solutionType,
      });
      if (success) onClose();
    } else {
      const success = await onSubmitCreate({
        deviceIdentifier: deviceIdentifier.trim(),
        deviceName: deviceName.trim(),
        solutionType,
      });
      if (success) onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit IoT Device' : 'Add New IoT Device'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Device Identifier */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Device Identifier / IMEI <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={deviceIdentifier}
            onChange={(e) => setDeviceIdentifier(e.target.value)}
            disabled={isEditMode || isSubmitting}
            placeholder="e.g. DEMO-1007 or IMEI-987654"
            className={`w-full px-3 py-2 text-sm rounded-md border ${
              errors.deviceIdentifier ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
            } ${
              isEditMode ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {isEditMode && (
            <p className="text-[11px] text-slate-500 mt-1">
              Device Identifier is immutable after creation to avoid identity collisions.
            </p>
          )}
          {errors.deviceIdentifier && (
            <p className="text-xs text-rose-600 mt-1">{errors.deviceIdentifier}</p>
          )}
        </div>

        {/* Device Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Device Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g. Substation Monitor 07"
            className={`w-full px-3 py-2 text-sm rounded-md border ${
              errors.deviceName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
            } bg-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.deviceName && (
            <p className="text-xs text-rose-600 mt-1">{errors.deviceName}</p>
          )}
        </div>

        {/* Solution Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Solution Type <span className="text-rose-500">*</span>
          </label>
          <select
            value={solutionType}
            onChange={(e) => setSolutionType(e.target.value as SolutionType)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(SolutionType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.solutionType && (
            <p className="text-xs text-rose-600 mt-1">{errors.solutionType}</p>
          )}
        </div>

        {!isEditMode && (
          <div className="p-3 bg-blue-50/60 rounded-md border border-blue-100 text-xs text-blue-800">
            <strong>Default State:</strong> New devices start with registration status{' '}
            <span className="font-semibold text-amber-700">Pending</span> and connectivity{' '}
            <span className="font-semibold text-slate-700">Offline</span>.
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Device'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

/* =========================================================================
   2. Device Detail Modal (Read-Only Detail Inspection)
   ========================================================================= */
interface DeviceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: IDevice | null;
}

export const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({
  isOpen,
  onClose,
  device,
}) => {
  if (!device) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Device Details">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-mono font-bold text-blue-600 block">
              {device.deviceIdentifier}
            </span>
            <h4 className="text-base font-semibold text-slate-900 mt-0.5">
              {device.deviceName}
            </h4>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <RegistrationBadge status={device.registrationStatus} />
            <DeviceStatusBadge status={device.deviceStatus} />
          </div>
        </div>

        {device.registrationError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-md flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-rose-900">Registration Error</p>
              <p className="text-xs text-rose-700 mt-0.5">{device.registrationError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-md border border-slate-100">
            <span className="text-slate-400 flex items-center gap-1 font-medium mb-1">
              <Tag className="w-3.5 h-3.5" /> Solution Type
            </span>
            <span className="font-semibold text-slate-800">{device.solutionType}</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-md border border-slate-100">
            <span className="text-slate-400 flex items-center gap-1 font-medium mb-1">
              <Hash className="w-3.5 h-3.5" /> Database ID
            </span>
            <span className="font-semibold text-slate-800">#{device.id}</span>
          </div>

          <div className="col-span-2 p-2.5 bg-slate-50 rounded-md border border-slate-100">
            <span className="text-slate-400 flex items-center gap-1 font-medium mb-1">
              <Activity className="w-3.5 h-3.5" /> Last Seen (IST)
            </span>
            <span className="font-mono text-slate-700">{formatToIST(device.lastSeenUtc)}</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-md border border-slate-100">
            <span className="text-slate-400 flex items-center gap-1 font-medium mb-1">
              <Calendar className="w-3.5 h-3.5" /> Created At (IST)
            </span>
            <span className="font-mono text-slate-700 text-[11px] block truncate">
              {formatToIST(device.createdAtUtc)}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-md border border-slate-100">
            <span className="text-slate-400 flex items-center gap-1 font-medium mb-1">
              <Calendar className="w-3.5 h-3.5" /> Last Updated (IST)
            </span>
            <span className="font-mono text-slate-700 text-[11px] block truncate">
              {formatToIST(device.updatedAtUtc)}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-right">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

/* =========================================================================
   3. Device Delete Confirmation Modal
   ========================================================================= */
interface DeviceDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: IDevice | null;
  onConfirm: (id: number) => Promise<boolean>;
  isDeleting: boolean;
}

export const DeviceDeleteModal: React.FC<DeviceDeleteModalProps> = ({
  isOpen,
  onClose,
  device,
  onConfirm,
  isDeleting,
}) => {
  if (!device) return null;

  const handleConfirm = async () => {
    const success = await onConfirm(device.id);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Device Deletion" maxWidth="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-rose-100 rounded-full text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Are you sure you want to delete this device?
            </p>
            <p className="text-xs text-slate-500 mt-1">
              You are about to remove{' '}
              <span className="font-semibold text-slate-800">{device.deviceName}</span> (
              <span className="font-mono text-blue-600">{device.deviceIdentifier}</span>).
              This change will persist to the database.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirm} isLoading={isDeleting}>
            Yes, Delete Device
          </Button>
        </div>
      </div>
    </Modal>
  );
};
