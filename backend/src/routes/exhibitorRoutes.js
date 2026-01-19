const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { requestBooth, updateProfile } = require('../controllers/exhibitorController');

router.post('/booth-request', protect, authorize('exhibitor'), requestBooth);
router.put('/profile', protect, authorize('exhibitor'), updateProfile);


module.exports = router;