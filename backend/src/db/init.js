const { initializeDeviceModel } = require('../modules/device/device.model');
const { seedDevices } = require('./seed');

initializeDeviceModel();
seedDevices(true);

console.log('Database initialized and demo data seeded successfully.');
