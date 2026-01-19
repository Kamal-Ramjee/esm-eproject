const Expo = require('../models/Expo');
const Session = require('../models/Session');
const Registration = require('../models/Registration');

// @desc Register for Expo
exports.registerForExpo = async (req, res) => {
    try {
        const expo = await Expo.findById(req.params.id);

        // Add to simple list
        if (!expo.attendees.includes(req.user._id)) {
            expo.attendees.push(req.user._id);
            await expo.save();
        }

        // Always create a detailed registration record for tracking
        const existingReg = await Registration.findOne({ expo: req.params.id, user: req.user._id });
        if (!existingReg) {
            await Registration.create({
                expo: req.params.id,
                user: req.user._id,
                companyTitle: req.body.companyTitle || '',
                shortDescription: req.body.shortDescription || 'Default attendee registration',
                serviceType: req.body.serviceType || 'Attendee'
            });
        }

        res.json({ message: 'Registered for Expo' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get My Registrations
exports.getMyRegistrations = async (req, res) => {
    try {
        const regs = await Registration.find({ user: req.user._id }).populate('expo');
        res.json(regs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Book/Bookmark Session
exports.toggleSessionBookmark = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) return res.status(404).json({ message: 'Session not found' });

        // Update Session record
        const index = session.registeredAttendees.indexOf(req.user._id);
        if (index > -1) {
            session.registeredAttendees.splice(index, 1);
        } else {
            session.registeredAttendees.push(req.user._id);
        }
        await session.save();

        // Update Registration record (for easy My Schedule)
        const reg = await Registration.findOne({ expo: session.expo, user: req.user._id });
        if (reg) {
            const sIndex = reg.sessions.indexOf(session._id);
            if (sIndex > -1) {
                reg.sessions.splice(sIndex, 1);
            } else {
                reg.sessions.push(session._id);
            }
            await reg.save();
        }

        res.json({ message: 'Bookmark toggled', bookmarked: index === -1 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get Exhibitors for an Expo
exports.getExpoExhibitors = async (req, res) => {
    try {
        const exhibitors = await Registration.find({ expo: req.params.expoId })
            .select('companyTitle shortDescription serviceType user')
            .populate('user', 'name email companyDetails');

        // Only return registrations that have company details (exhibitors)
        const filtered = exhibitors.filter(e => e.companyTitle || (e.user && e.user.companyDetails));
        res.json(filtered);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get My Complete Status for an Expo
exports.getMyExpoStatus = async (req, res) => {
    try {
        const reg = await Registration.findOne({ expo: req.params.expoId, user: req.user._id })
            .populate('sessions')
            .populate('expo');
        res.json(reg);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Cancel Registration for Expo
exports.cancelRegistration = async (req, res) => {
    try {
        const expoId = req.params.id;
        const userId = req.user._id;

        // 1. Delete the registration record
        await Registration.findOneAndDelete({ expo: expoId, user: userId });

        // 1.5 Clear booth assignment if any
        const Booth = require('../models/Booth');
        await Booth.updateMany(
            { expo: expoId, exhibitor: userId },
            { status: 'available', exhibitor: null, boothTitle: '', boothDescription: '', productsShowcased: [] }
        );

        // 2. Remove user from Expo.attendees list
        const expo = await Expo.findById(expoId);
        if (expo) {
            expo.attendees = expo.attendees.filter(a => a.toString() !== userId.toString());
            await expo.save();
        }

        // 3. Remove user from all sessions of this expo
        await Session.updateMany(
            { expo: expoId },
            { $pull: { registeredAttendees: userId } }
        );

        res.json({ message: 'Registration cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};