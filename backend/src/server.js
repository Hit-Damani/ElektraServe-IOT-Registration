const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');
const { initializeDeviceModel } = require('./modules/device/device.model');
const { seedDevices } = require('./db/seed');

// Ensure database schema and seed data are initialized
initializeDeviceModel();
seedDevices();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on Port : ${PORT}`);
});
