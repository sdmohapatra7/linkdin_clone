const express = require('express');
const router = express.Router();
const { getUser, updateUser, getUsers, followUser, unfollowUser, forgotPassword, resetPassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, getUsers);
router.put('/profile', protect, upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'bannerPhoto', maxCount: 1 }]), updateUser);
router.put('/follow/:id', protect, followUser);
router.put('/unfollow/:id', protect, unfollowUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.get('/:id', protect, getUser);

module.exports = router;
