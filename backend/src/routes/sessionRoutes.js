const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getSessions, createSession, updateSession, deleteSession } = require('../controllers/sessionController');

router.get('/:expoId', getSessions);
router.post('/', protect, authorize('admin', 'organizer'), createSession);
router.put('/:id', protect, authorize('admin', 'organizer'), updateSession);
router.delete('/:id', protect, authorize('admin', 'organizer'), deleteSession);

module.exports = router;
