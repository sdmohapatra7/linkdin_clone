const express = require('express');
const router = express.Router();
const { getUser, updateUser, getUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, getUsers);
router.put('/profile', protect, upload.single('profilePicture'), updateUser);
router.get('/:id', protect, getUser);

module.exports = router;
