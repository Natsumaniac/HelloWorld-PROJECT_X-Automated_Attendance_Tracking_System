const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  middleInitial: String,
  extensionName: String,
  studentId: { type: String, required: true, unique: true },
  year: String,
  faculty: String,
  program: String,
  profilePic: String, // store image URL or base64 string
  password: String,   // default: studentId
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);