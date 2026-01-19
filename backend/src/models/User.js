const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'organizer', 'exhibitor', 'attendee'],
        default: 'attendee'
    },
    // For Exhibitors
    companyDetails: {
        description: String,
        website: String,
        logoUrl: String,
        products: [String],
        serviceType: String
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true });

// src/models/User.js

// ... imports (UserSchema definition) ...

// CORRECTED CODE: Remove 'next' parameter and calls
UserSchema.pre('save', async function () {
    // 1. If password is not modified, simply return (exits the function)
    if (!this.isModified('password')) return;

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // 3. Do NOT call next(). The completion of the async function signals success.
});

module.exports = mongoose.model('User', UserSchema);