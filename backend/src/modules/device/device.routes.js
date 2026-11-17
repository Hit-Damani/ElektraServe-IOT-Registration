const express = require('express');
const deviceController = require('./device.controller');

const router = express.Router();

// CRUD
router.get('/', deviceController.getDevices);
router.get('/:deviceId', deviceController.getDeviceById);
router.post('/', deviceController.createDevice);
router.put('/:deviceId', deviceController.updateDevice);
router.delete('/:deviceId', deviceController.deleteDevice);

// IoT State Transitions & Actions
router.post('/:deviceId/register', deviceController.registerDevice);
router.post('/:deviceId/simulate-online', deviceController.simulateOnline);
router.post('/:deviceId/simulate-offline', deviceController.simulateOffline);
router.post('/:deviceId/retry-registration', deviceController.retryRegistration);

module.exports = router;
