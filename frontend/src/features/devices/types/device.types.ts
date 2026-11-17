import { RegistrationStatus, DeviceStatus, SolutionType } from '../constants';

export interface IDevice {
  id: number;
  deviceIdentifier: string;
  deviceName: string;
  solutionType: SolutionType;
  registrationStatus: RegistrationStatus;
  deviceStatus: DeviceStatus;
  lastSeenUtc: string | null;
  registrationError: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface IDashboardSummary {
  total: number;
  pending: number;
  registered: number;
  error: number;
  online: number;
  offline: number;
}

export interface ICreateDevicePayload {
  deviceIdentifier: string;
  deviceName: string;
  solutionType: SolutionType;
}

export interface IUpdateDevicePayload {
  deviceName?: string;
  solutionType?: SolutionType;
}

export interface IDeviceFilters {
  q?: string;
  registrationStatus?: string;
  deviceStatus?: string;
}

export interface IApiResponse<T> {
  code: number;
  data: T;
  message: string;
  type?: string;
}
