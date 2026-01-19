const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { createExpo, addBooth, getAnalytics, getAllExpos, getExpoById, updateExpo, deleteExpo } = require('../controllers/expoController');

router.post('/', protect, authorize('admin', 'organizer'), createExpo);
router.post('/booth', protect, authorize('admin', 'organizer'), addBooth);
router.put('/booth/:id', protect, authorize('admin', 'organizer', 'exhibitor'), require('../controllers/expoController').updateBooth);
router.put('/booth/:id/request', protect, authorize('exhibitor'), require('../controllers/expoController').requestBooth);
router.get('/:id/analytics', protect, authorize('admin', 'organizer'), getAnalytics);
router.get('/:id/booths', require('../controllers/expoController').getBooths);
// Add specific route before generic /:id
router.get('/booths/mine', protect, authorize('exhibitor'), require('../controllers/expoController').getMyBooths);

router.put('/:id', protect, updateExpo);
router.delete('/:id', protect, deleteExpo);
// Add this line BEFORE the /:id routes
router.get('/:id', getExpoById);
router.get('/', getAllExpos);



module.exports = router;