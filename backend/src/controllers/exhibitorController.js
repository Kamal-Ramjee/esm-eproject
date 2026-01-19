const Booth = require('../models/Booth');
const User = require('../models/User');

// @desc Request/Book a Booth
exports.requestBooth = async (req, res) => {
    try {
        const { boothId } = req.body;
        const booth = await Booth.findById(boothId);

        if (booth.status !== 'available') {
            return res.status(400).json({ message: 'Booth not available' });
        }

        booth.status = 'pending'; // Requires Admin approval
        booth.exhibitor = req.user._id;
        await booth.save();

        res.json({ message: 'Booth requested successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, {
            companyDetails: req.body.companyDetails
        }, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};