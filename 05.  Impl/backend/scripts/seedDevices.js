const mongoose = require('mongoose');
const Device = require('../models/Device');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Device.deleteMany({});
    await Device.insertMany([
      { deviceName: 'Tablet 1', deviceId: 'DEV-001' },
      { deviceName: 'Tablet 2', deviceId: 'DEV-002' },
      { deviceName: 'Tablet 3', deviceId: 'DEV-003' }
    ]);
    console.log('Devices seeded!');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });