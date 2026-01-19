const User = require('../models/User');
const Expo = require('../models/Expo');

// @desc Get Dashboard Stats (Counts)
exports.getStats = async (req, res) => {
    try {
        const attendeeCount = await User.countDocuments({ role: 'attendee' });
        const exhibitorCount = await User.countDocuments({ role: 'exhibitor' });
        const eventCount = await Expo.countDocuments();

        res.json({
            attendeeCount,
            exhibitorCount,
            eventCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
