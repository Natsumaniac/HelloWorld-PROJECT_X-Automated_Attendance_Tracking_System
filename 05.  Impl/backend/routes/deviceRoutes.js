const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const Instructor = require('../models/Instructor');

// GET /api/devices
router.get('/', async (req, res) => {
  try {
    const devices = await Device.find();
    const instructors = await Instructor.find({}, 'assignedDevice fullName idNumber');
    // Map deviceId to instructor
    const deviceToInstructor = {};
    instructors.forEach(inst => {
      if (inst.assignedDevice) {
        deviceToInstructor[inst.assignedDevice] = {
          assignedToName: inst.fullName,
          assignedTo: inst.idNumber
        };
      }
    });
    // Attach instructor info and status to each device
    const devicesWithNames = devices.map(dev => {
      const info = deviceToInstructor[dev.deviceId];
      return {
        ...dev.toObject(),
        status: info ? 'assigned' : dev.status, // force status to 'assigned' if in use
        assignedToName: info ? info.assignedToName : undefined,
        assignedTo: info ? info.assignedTo : dev.assignedTo
      };
    });
    res.json(devicesWithNames);
  } catch (err) {
    console.error('Error fetching devices:', err);
    res.status(500).json({ message: 'Failed to fetch devices', error: err.message });
  }
});

// Add new device
router.post('/', async (req, res) => {
  try {
    const { deviceName, deviceId, deviceType, status, assignedTo } = req.body;
    // Check for duplicate deviceId
    const existing = await Device.findOne({ deviceId });
    if (existing) {
      return res.status(400).json({ message: 'Device ID already exists' });
    }
    const device = await Device.create({
      deviceName,
      deviceId,
      deviceType,
      status: status || 'available',
      assignedTo: assignedTo || ''
    });
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add device', error: err.message });
  }
});

// Delete device by Mongo _id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Device.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json({ message: 'Device deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete device', error: err.message });
  }
});

// Unassign a device
router.post('/unassign', async (req, res) => {
  try {
    const { deviceId } = req.body; // deviceId is actually the MongoDB _id
    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    device.status = 'available';
    device.assignedTo = '';
    await device.save();
    res.json({ message: 'Device unassigned' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to unassign device', error: err.message });
  }
});

// Mark a device as lost
router.post('/mark-lost', async (req, res) => {
  try {
    const { deviceId } = req.body; // deviceId is actually the MongoDB _id
    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    device.status = 'lost';
    await device.save();
    res.json({ message: 'Device marked as lost' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark device as lost', error: err.message });
  }
});

module.exports = router;