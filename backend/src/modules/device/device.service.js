const deviceDao = require('./device.dao');
const { RegistrationStatus, DeviceStatus, DeviceErrorType } = require('./device.constants');
const APIError = require('../../utils/APIError');
const {
  validateCreateDevicePayload,
  validateUpdateDevicePayload,
} = require('./device.validator');

module.exports.getAllDevices = async (filters) => {
  return deviceDao.findAll(filters);
};

module.exports.getDeviceById = async (deviceId) => {
  const device = deviceDao.findById(deviceId);
  if (!device) {
    throw new APIError({
      status: 404,
      message: `Device with ID ${deviceId} was not found`,
      type: DeviceErrorType.DEVICE_NOT_FOUND,
    });
  }
  return device;
};

module.exports.createDevice = async (payload) => {
  const validData = validateCreateDevicePayload(payload);

  const existing = deviceDao.findByIdentifier(validData.deviceIdentifier);
  if (existing) {
    throw new APIError({
      status: 409,
      message: `A device with identifier '${validData.deviceIdentifier}' already exists`,
      type: DeviceErrorType.DUPLICATE_IDENTIFIER,
    });
  }

  const nowUtc = new Date().toISOString();

  return deviceDao.create({
    ...validData,
    registrationStatus: RegistrationStatus.PENDING,
    deviceStatus: DeviceStatus.OFFLINE,
    lastSeenUtc: null,
    registrationError: null,
    createdAtUtc: nowUtc,
    updatedAtUtc: nowUtc,
  });
};

module.exports.updateDevice = async (deviceId, payload) => {
  await module.exports.getDeviceById(deviceId);

  const updates = validateUpdateDevicePayload(payload);
  updates.updatedAtUtc = new Date().toISOString();

  return deviceDao.update(deviceId, updates);
};

module.exports.deleteDevice = async (deviceId) => {
  await module.exports.getDeviceById(deviceId);
  return deviceDao.deleteById(deviceId);
};

module.exports.registerDevice = async (deviceId) => {
  const device = await module.exports.getDeviceById(deviceId);

  if (device.registrationStatus === RegistrationStatus.REGISTERED) {
    throw new APIError({
      status: 400,
      message: 'Device is already registered',
      type: DeviceErrorType.INVALID_REGISTRATION_STATE,
    });
  }

  if (
    device.registrationStatus !== RegistrationStatus.PENDING &&
    device.registrationStatus !== RegistrationStatus.ERROR
  ) {
    throw new APIError({
      status: 400,
      message: `Cannot register device with status '${device.registrationStatus}'`,
      type: DeviceErrorType.INVALID_REGISTRATION_STATE,
    });
  }

  return deviceDao.update(deviceId, {
    registrationStatus: RegistrationStatus.REGISTERED,
    registrationError: null,
    updatedAtUtc: new Date().toISOString(),
  });
};

module.exports.simulateOnline = async (deviceId) => {
  await module.exports.getDeviceById(deviceId);

  const nowUtc = new Date().toISOString();
  return deviceDao.update(deviceId, {
    deviceStatus: DeviceStatus.ONLINE,
    lastSeenUtc: nowUtc,
    updatedAtUtc: nowUtc,
  });
};

module.exports.simulateOffline = async (deviceId) => {
  await module.exports.getDeviceById(deviceId);

  return deviceDao.update(deviceId, {
    deviceStatus: DeviceStatus.OFFLINE,
    updatedAtUtc: new Date().toISOString(),
  });
};

module.exports.retryRegistration = async (deviceId) => {
  const device = await module.exports.getDeviceById(deviceId);

  if (device.registrationStatus !== RegistrationStatus.ERROR) {
    throw new APIError({
      status: 400,
      message: `Retry registration is only allowed for devices in Error status. Current status: '${device.registrationStatus}'`,
      type: DeviceErrorType.INVALID_REGISTRATION_STATE,
    });
  }

  return deviceDao.update(deviceId, {
    registrationStatus: RegistrationStatus.PENDING,
    registrationError: null,
    updatedAtUtc: new Date().toISOString(),
  });
};

module.exports.getDashboardSummary = async () => {
  return deviceDao.getSummaryCounts();
};
