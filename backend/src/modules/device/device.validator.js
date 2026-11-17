const { SolutionType, DeviceErrorType } = require('./device.constants');
const APIError = require('../../utils/APIError');

const allowedSolutions = Object.values(SolutionType);

function validateCreateDevicePayload(body) {
  if (!body || typeof body !== 'object') {
    throw new APIError({
      status: 400,
      message: 'Request body must be a valid JSON object',
      type: DeviceErrorType.VALIDATION_ERROR,
    });
  }

  const deviceIdentifier = typeof body.deviceIdentifier === 'string' ? body.deviceIdentifier.trim() : '';
  const deviceName = typeof body.deviceName === 'string' ? body.deviceName.trim() : '';
  const solutionType = typeof body.solutionType === 'string' ? body.solutionType.trim() : '';

  if (!deviceIdentifier) {
    throw new APIError({
      status: 400,
      message: 'Device Identifier (IMEI) is required and cannot be blank',
      type: DeviceErrorType.VALIDATION_ERROR,
    });
  }

  if (deviceIdentifier.length > 50) {
    throw new APIError({
      status: 400,
      message: 'Device Identifier cannot exceed 50 characters',
      type: DeviceErrorType.VALIDATION_ERROR,
    });
  }

  if (!deviceName) {
    throw new APIError({
      status: 400,
      message: 'Device Name is required and cannot be blank',
      type: DeviceErrorType.VALIDATION_ERROR,
    });
  }

  if (deviceName.length > 100) {
    throw new APIError({
      status: 400,
      message: 'Device Name cannot exceed 100 characters',
      type: DeviceErrorType.VALIDATION_ERROR,
    });
  }

  if (!solutionType) {
    throw new APIError({
      status: 400,
      message: 'Solution Type is required',
      type: DeviceErrorType.VALIDATION_ERROR,
    });
  }

  if (!allowedSolutions.includes(solutionType)) {
    throw new APIError({
      status: 400,
      message: `Invalid Solution Type. Allowed values are: ${allowedSolutions.join(', ')}`,
      type: DeviceErrorType.VALIDATION_ERROR,
    });
  }

  return {
    deviceIdentifier,
    deviceName,
    solutionType,
  };
}

function validateUpdateDevicePayload(body) {
  if (!body || typeof body !== 'object') {
    throw new APIError({
      status: 400,
      message: 'Request body must be a valid JSON object',
      type: DeviceErrorType.VALIDATION_ERROR,
    });
  }

  const updates = {};

  if (body.deviceName !== undefined) {
    const trimmed = typeof body.deviceName === 'string' ? body.deviceName.trim() : '';
    if (!trimmed) {
      throw new APIError({
        status: 400,
        message: 'Device Name cannot be blank',
        type: DeviceErrorType.VALIDATION_ERROR,
      });
    }
    if (trimmed.length > 100) {
      throw new APIError({
        status: 400,
        message: 'Device Name cannot exceed 100 characters',
        type: DeviceErrorType.VALIDATION_ERROR,
      });
    }
    updates.deviceName = trimmed;
  }

  if (body.solutionType !== undefined) {
    const trimmed = typeof body.solutionType === 'string' ? body.solutionType.trim() : '';
    if (!trimmed) {
      throw new APIError({
        status: 400,
        message: 'Solution Type cannot be blank',
        type: DeviceErrorType.VALIDATION_ERROR,
      });
    }
    if (!allowedSolutions.includes(trimmed)) {
      throw new APIError({
        status: 400,
        message: `Invalid Solution Type. Allowed values are: ${allowedSolutions.join(', ')}`,
        type: DeviceErrorType.VALIDATION_ERROR,
      });
    }
    updates.solutionType = trimmed;
  }

  if (Object.keys(updates).length === 0) {
    throw new APIError({
      status: 400,
      message: 'Please provide at least one field (deviceName or solutionType) to update',
      type: DeviceErrorType.VALIDATION_ERROR,
    });
  }

  return updates;
}

module.exports = {
  validateCreateDevicePayload,
  validateUpdateDevicePayload,
};
