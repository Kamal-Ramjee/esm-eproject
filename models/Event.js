const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    theme: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
