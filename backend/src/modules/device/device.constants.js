const RegistrationStatus = Object.freeze({
  PENDING: 'Pending',
  REGISTERED: 'Registered',
  ERROR: 'Error',
});

const DeviceStatus = Object.freeze({
  ONLINE: 'Online',
  OFFLINE: 'Offline',
});

const SolutionType = Object.freeze({
  SOLAR: 'Solar',
  PUMP: 'Pump',
  AC: 'AC',
  COMPRESSOR: 'Compressor',
  LTDB: 'LTDB',
  OTHER: 'Other',
});

const DeviceErrorType = Object.freeze({
  DUPLICATE_IDENTIFIER: 'DUPLICATE_IDENTIFIER',
  DEVICE_NOT_FOUND: 'DEVICE_NOT_FOUND',
  INVALID_REGISTRATION_STATE: 'INVALID_REGISTRATION_STATE',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
});

module.exports = {
  RegistrationStatus,
  DeviceStatus,
  SolutionType,
  DeviceErrorType,
};
