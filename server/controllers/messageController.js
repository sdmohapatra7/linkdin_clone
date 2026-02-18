const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Notification = require('../models/Notification');

// @desc    Get all Messages
// @route   GET /api/message/:chatId
// @access  Protected
const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate('sender', 'name profilePicture email')
            .populate('chat');
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const fs = require('fs');
const path = require('path');

// @desc    Create New Message
// @route   POST /api/message
// @access  Protected
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if ((!content && (!req.files || Object.keys(req.files).length === 0)) || !chatId) {
        console.log('Invalid data passed into request');
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content || '',
        chat: chatId,
        image: [],
        video: []
    };

    // Handle File Uploads
    if (req.files) {
        // We'll use a specific upload folder or just 'uploads/chat/{chatId}'
        // Ideally we structure uploads/chat_media/{messageId} but we don't have messageId yet
        // So let's generate a temporary ID or use timestamp+random

        const timestamp = Date.now();
        const targetDir = path.join('uploads', 'chat_media');

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        if (req.files['image']) {
            req.files['image'].forEach(file => {
                const newFilename = `chat-${chatId}-${timestamp}-${file.originalname}`;
                const newPath = path.join(targetDir, newFilename);
                fs.renameSync(file.path, newPath);

                // Construct URL
                const relativePath = path.join('uploads', 'chat_media', newFilename).replace(/\\/g, '/');
                newMessage.image.push(`http://localhost:5000/${relativePath}`);
            });
        }

        if (req.files['video']) {
            req.files['video'].forEach(file => {
                const newFilename = `chat-${chatId}-${timestamp}-${file.originalname}`;
                const newPath = path.join(targetDir, newFilename);
                fs.renameSync(file.path, newPath);

                const relativePath = path.join('uploads', 'chat_media', newFilename).replace(/\\/g, '/');
                newMessage.video.push(`http://localhost:5000/${relativePath}`);
            });
        }
    }

    try {
        var message = await Message.create(newMessage);

        message = await message.populate('sender', 'name profilePicture');
        message = await message.populate('chat');
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name profilePicture email',
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        // Create Notification for recipients
        message.chat.users.forEach(async (user) => {
            if (user._id.toString() === req.user._id.toString()) return;

            const notification = await Notification.create({
                recipient: user._id,
                sender: req.user._id,
                type: 'message',
                post: null, // No post associated
            });

            await notification.populate('sender', 'name profilePicture');

            const io = req.app.get('io');
            if (io) {
                io.in(user._id.toString()).emit('notification received', notification);
            }
        });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const markMessagesAsRead = asyncHandler(async (req, res) => {
    const { chatId } = req.body;

    if (!chatId) {
        res.status(400);
        throw new Error('Chat ID is required');
    }

    // Update all messages in this chat where user is NOT in readBy array
    await Message.updateMany(
        { chat: chatId, readBy: { $ne: req.user._id } },
        { $addToSet: { readBy: req.user._id } }
    );

    // Emit socket event so other users see it's read
    // We need to fetch the chat to know who to emit to? 
    // Or just emit to the chat room
    const io = req.app.get('io');
    if (io) {
        io.in(chatId).emit('messages read', { chatId, userId: req.user._id });
    }

    res.status(200).json({ success: true });
});

module.exports = { allMessages, sendMessage, markMessagesAsRead };
