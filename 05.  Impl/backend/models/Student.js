const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, trim: true }, // <-- use studentId
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  year: { type: String },
  faculty: { type: String },
  program: { type: String },
  password: { type: String, required: true },
  profilePic: { type: String }
}, { timestamps: true });

// Hash password before saving
studentSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();ss
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
studentSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model('Student', studentSchema);