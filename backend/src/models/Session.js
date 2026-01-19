const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    expo: { type: mongoose.Schema.Types.ObjectId, ref: 'Expo', required: true },
    title: { type: String, required: true },
    speaker: String,
    startTime: Date,
    endTime: Date,
    location: String, // Room A, Hall B
    registeredAttendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Session', SessionSchema);