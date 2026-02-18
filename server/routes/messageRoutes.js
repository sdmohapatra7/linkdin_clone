const express = require('express');
const { allMessages, sendMessage, markMessagesAsRead } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Place specific routes before parameterized routes
router.route('/read').put(protect, markMessagesAsRead);
router.route('/:chatId').get(protect, allMessages);
router.route('/').post(protect, upload.fields([{ name: 'image', maxCount: 5 }, { name: 'video', maxCount: 2 }]), sendMessage);

module.exports = router;
