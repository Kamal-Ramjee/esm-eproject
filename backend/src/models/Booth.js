const mongoose = require('mongoose');

const BoothSchema = new mongoose.Schema({
    expo: { type: mongoose.Schema.Types.ObjectId, ref: 'Expo', required: true },
    boothNumber: { type: String, required: true },
    size: String,
    locationOnFloor: String, // Coordinates or section
    price: Number,
    status: {
        type: String,
        enum: ['available', 'pending', 'reserved'],
        default: 'available'
    },
    exhibitor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    productsShowcased: [String],
    boothTitle: String,
    boothDescription: String
});

module.exports = mongoose.model('Booth', BoothSchema);