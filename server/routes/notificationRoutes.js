const express = require('express');
const {
    getNotifications,
    markAsRead,
    deleteNotification,
    deleteAllNotifications,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getNotifications).delete(protect, deleteAllNotifications);
router.route('/:id').put(protect, markAsRead).delete(protect, deleteNotification);

module.exports = router;
