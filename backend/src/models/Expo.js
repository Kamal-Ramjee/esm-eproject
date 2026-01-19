const mongoose = require('mongoose');

const ExpoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    theme: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: String,
    image: String, // Venue image URL
    totalBooths: { type: Number, default: 0 },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Registered attendees
}, { timestamps: true });

module.exports = mongoose.model('Expo', ExpoSchema);