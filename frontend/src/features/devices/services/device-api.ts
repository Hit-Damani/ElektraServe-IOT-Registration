import axiosClient from '../../../services/api-service/axios-client';
import {
  IDevice,
  IDashboardSummary,
  ICreateDevicePayload,
  IUpdateDevicePayload,
  IDeviceFilters,
  IApiResponse,
} from '../types/device.types';

export const deviceApi = {
  async getDevices(params?: IDeviceFilters): Promise<IDevice[]> {
    const res = (await axiosClient.get('/devices', { params })) as unknown as IApiResponse<IDevice[]>;
    return res.data;
  },

  async getDeviceById(id: number): Promise<IDevice> {
    const res = (await axiosClient.get(`/devices/${id}`)) as unknown as IApiResponse<IDevice>;
    return res.data;
  },

  async getDashboardSummary(): Promise<IDashboardSummary> {
    const res = (await axiosClient.get('/dashboard/summary')) as unknown as IApiResponse<IDashboardSummary>;
    return res.data;
  },

  async createDevice(payload: ICreateDevicePayload): Promise<IDevice> {
    const res = (await axiosClient.post('/devices', payload)) as unknown as IApiResponse<IDevice>;
    return res.data;
  },

  async updateDevice(id: number, payload: IUpdateDevicePayload): Promise<IDevice> {
    const res = (await axiosClient.put(`/devices/${id}`, payload)) as unknown as IApiResponse<IDevice>;
    return res.data;
  },

  async deleteDevice(id: number): Promise<void> {
    await axiosClient.delete(`/devices/${id}`);
  },

  async registerDevice(id: number): Promise<IDevice> {
    const res = (await axiosClient.post(`/devices/${id}/register`)) as unknown as IApiResponse<IDevice>;
    return res.data;
  },

  async simulateOnline(id: number): Promise<IDevice> {
    const res = (await axiosClient.post(`/devices/${id}/simulate-online`)) as unknown as IApiResponse<IDevice>;
    return res.data;
  },

  async simulateOffline(id: number): Promise<IDevice> {
    const res = (await axiosClient.post(`/devices/${id}/simulate-offline`)) as unknown as IApiResponse<IDevice>;
    return res.data;
  },

  async retryRegistration(id: number): Promise<IDevice> {
    const res = (await axiosClient.post(`/devices/${id}/retry-registration`)) as unknown as IApiResponse<IDevice>;
    return res.data;
  },
};

export default deviceApi;
