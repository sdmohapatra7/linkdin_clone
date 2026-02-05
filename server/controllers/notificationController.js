const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Protected
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .populate('sender', 'name profilePicture')
        .populate('post', 'text');

    res.json(notifications);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Protected
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        notification.read = true;
        const updatedNotification = await notification.save();
        res.json(updatedNotification);
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Protected
const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        if (notification.recipient.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized');
        }
        await notification.deleteOne();
        res.json({ id: req.params.id });
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});

// @desc    Delete all notifications
// @route   DELETE /api/notifications
// @access  Protected
const deleteAllNotifications = asyncHandler(async (req, res) => {
    await Notification.deleteMany({ recipient: req.user.id });
    res.json({ message: 'All notifications cleared' });
});

module.exports = { getNotifications, markAsRead, deleteNotification, deleteAllNotifications };
