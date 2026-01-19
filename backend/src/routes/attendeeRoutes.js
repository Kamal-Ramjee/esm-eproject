const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    registerForExpo,
    toggleSessionBookmark,
    getMyRegistrations,
    getExpoExhibitors,
    getMyExpoStatus,
    cancelRegistration
} = require('../controllers/attendeeController');

router.post('/expo/:id/register', protect, registerForExpo);
router.post('/session/:id/bookmark', protect, toggleSessionBookmark);
router.get('/registrations', protect, getMyRegistrations);
router.get('/expo/:expoId/exhibitors', protect, getExpoExhibitors);
router.get('/expo/:expoId/status', protect, getMyExpoStatus);
router.delete('/expo/:id/cancel', protect, cancelRegistration);

module.exports = router;