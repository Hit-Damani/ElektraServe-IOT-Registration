const asyncHandler = require('../../utils/asyncHandler');
const Format = require('../../config/format');
const deviceService = require('./device.service');

module.exports.getDevices = asyncHandler(async (req, res) => {
  const { q, registrationStatus, deviceStatus } = req.query;
  const devices = await deviceService.getAllDevices({ q, registrationStatus, deviceStatus });
  return res.status(200).json(Format.success(devices, 'Devices fetched successfully'));
});

module.exports.getDeviceById = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const device = await deviceService.getDeviceById(deviceId);
  return res.status(200).json(Format.success(device, 'Device retrieved successfully'));
});

module.exports.createDevice = asyncHandler(async (req, res) => {
  const newDevice = await deviceService.createDevice(req.body);
  return res.status(201).json(Format.created(newDevice, 'Device created successfully'));
});

module.exports.updateDevice = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const updatedDevice = await deviceService.updateDevice(deviceId, req.body);
  return res.status(200).json(Format.success(updatedDevice, 'Device updated successfully'));
});

module.exports.deleteDevice = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  await deviceService.deleteDevice(deviceId);
  return res.status(204).send();
});

module.exports.registerDevice = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const device = await deviceService.registerDevice(deviceId);
  return res.status(200).json(Format.success(device, 'Device registered successfully'));
});

module.exports.simulateOnline = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const device = await deviceService.simulateOnline(deviceId);
  return res.status(200).json(Format.success(device, 'Device simulated Online successfully'));
});

module.exports.simulateOffline = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const device = await deviceService.simulateOffline(deviceId);
  return res.status(200).json(Format.success(device, 'Device simulated Offline successfully'));
});

module.exports.retryRegistration = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const device = await deviceService.retryRegistration(deviceId);
  return res.status(200).json(Format.success(device, 'Registration retry initiated, status set to Pending'));
});

module.exports.getDashboardSummary = asyncHandler(async (req, res) => {
  const summary = await deviceService.getDashboardSummary();
  return res.status(200).json(Format.success(summary, 'Dashboard summary calculated successfully'));
});
