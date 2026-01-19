const Expo = require('../models/Expo');
const Booth = require('../models/Booth');
const Session = require('../models/Session');

// @desc Create Expo
exports.createExpo = async (req, res) => {
    try {
        const expo = await Expo.create({ ...req.body, organizer: req.user._id });
        res.status(201).json(expo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Update Expo
// @route   PUT /api/expos/:id
// @access  Private (Organizer only)
exports.updateExpo = async (req, res) => {
    console.log(req.user)
    try {
        let expo = await Expo.findById(req.params.id);

        if (!expo) {
            return res.status(404).json({ message: 'Expo not found' });
        }

        // Check if the user is the owner (organizer) of this expo
        if (expo.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to update this expo' });
        }

        // Update with new data from req.body
        expo = await Expo.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // returns the modified document
            runValidators: true
        });

        res.json(expo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Expo
// @route   DELETE /api/expos/:id
// @access  Private (Organizer only)
exports.deleteExpo = async (req, res) => {
    // console.log("------------",req.user)

    try {
        const expo = await Expo.findById(req.params.id);

        if (!expo) {
            return res.status(404).json({ message: 'Expo not found' });
        }

        console.log(expo.organizer.toString())
        console.log(req.user._id.toString())
        // Check ownership
        if (expo.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this expo' });
        }

        await expo.deleteOne();
        res.json({ message: 'Expo removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Add Booths (Floor Plan)
exports.addBooth = async (req, res) => {
    try {
        const booth = await Booth.create(req.body);
        res.status(201).json(booth);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update Booth (Assign/Edit)
exports.updateBooth = async (req, res) => {
    try {
        const booth = await Booth.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('exhibitor', 'name');
        res.json(booth);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get Analytics
exports.getAnalytics = async (req, res) => {
    try {
        const expoId = req.params.id;
        const attendeeCount = await Expo.findById(expoId).select('attendees');
        const boothsReserved = await Booth.countDocuments({ expo: expoId, status: 'reserved' });

        res.json({
            totalAttendees: attendeeCount.attendees.length,
            boothsReserved,
            revenue: boothsReserved * 1000 // Dummy calculation
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get All Expos
exports.getAllExpos = async (req, res) => {
    try {
        const expos = await Expo.find({});
        res.json(expos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get Single Expo
exports.getExpoById = async (req, res) => {
    try {
        const expo = await Expo.findById(req.params.id);
        if (!expo) return res.status(404).json({ message: 'Expo not found' });
        res.json(expo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get Booths for an Expo
exports.getBooths = async (req, res) => {
    try {
        const booths = await Booth.find({ expo: req.params.id }).populate('exhibitor', 'name');
        res.json(booths);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get My Booths (Exhibitor)
exports.getMyBooths = async (req, res) => {
    try {
        const booths = await Booth.find({ exhibitor: req.user._id }).populate('expo', 'title location');
        res.json(booths);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Request Booth (Exhibitor)
exports.requestBooth = async (req, res) => {
    try {
        const booth = await Booth.findById(req.params.id);
        if (booth.status !== 'available') {
            return res.status(400).json({ message: 'Booth not available' });
        }

        booth.status = 'pending';
        booth.exhibitor = req.user._id;
        await booth.save();
        res.json(booth);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};