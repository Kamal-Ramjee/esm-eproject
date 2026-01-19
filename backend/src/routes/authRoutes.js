const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
// http://localhost:5000/api/auth/register
// http://localhost:5000/api/auth/login
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/users', require('../controllers/authController').getUsers);
router.get('/profile', protect, require('../controllers/authController').getUserProfile);
router.put('/profile', protect, require('../controllers/authController').updateProfile);
router.delete('/users/:id', protect, require('../controllers/authController').deleteUser);
router.put('/users/:id', protect, require('../controllers/authController').updateUser);

module.exports = router;