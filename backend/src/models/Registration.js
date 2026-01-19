const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    expo: { type: mongoose.Schema.Types.ObjectId, ref: 'Expo', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyTitle: String,
    shortDescription: String,
    serviceType: String,
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
    registrationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', RegistrationSchema);
