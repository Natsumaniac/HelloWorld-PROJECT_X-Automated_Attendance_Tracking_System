const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceName: { type: String, required: true },
  deviceId: { type: String, required: true, unique: true },
  status: { type: String, default: 'available' }, // available, assigned, lost, etc.
  assignedTo: { type: String, default: '' }, // instructorId or ''
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);