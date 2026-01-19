const Session = require('../models/Session');

// @desc Get Sessions for an Expo
exports.getSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ expo: req.params.expoId });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Create Session
exports.createSession = async (req, res) => {
    try {
        const session = await Session.create(req.body);
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update Session
exports.updateSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete Session
exports.deleteSession = async (req, res) => {
    try {
        await Session.findByIdAndDelete(req.params.id);
        res.json({ message: 'Session removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
