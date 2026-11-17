const express = require('express');
const deviceRoutes = require('./modules/device/device.routes');
const deviceController = require('./modules/device/device.controller');

const router = express.Router();

router.use('/devices', deviceRoutes);
router.get('/dashboard/summary', deviceController.getDashboardSummary);

module.exports = router;
