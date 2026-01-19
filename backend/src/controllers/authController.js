const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc Register User
exports.register = async (req, res) => {
    const { name, email, password, role, companyDetails } = req.body;
    try {
        debugger;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = await User.create({ name, email, password, role, companyDetails });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc Get Users (Filter by role)
exports.getUsers = async (req, res) => {
    try {
        const { role } = req.query;
        let query = {};
        if (role) query.role = role;

        let users = await User.find(query).select('-password').lean();

        // Enrich data manual lookup
        for (let user of users) {
            if (user.role === 'attendee') {
                const Expo = require('../models/Expo');
                const joinedExpos = await Expo.find({ attendees: user._id }).select('title');
                user.joinedEvents = joinedExpos.map(e => e.title);
            } else if (user.role === 'exhibitor') {
                const Booth = require('../models/Booth');
                const booths = await Booth.find({ exhibitor: user._id }).select('boothNumber expo');
                user.booths = booths.map(b => b.boothNumber);
                user.boothCount = booths.length;
            }
        }

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = await bcrypt.hash(req.body.password, 10);
            }
            if (req.body.companyDetails) {
                user.companyDetails = { ...user.companyDetails, ...req.body.companyDetails };
            }
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                companyDetails: updatedUser.companyDetails,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete User
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update User (Admin)
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};