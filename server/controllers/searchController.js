const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Search users and posts
// @route   GET /api/search
// @access  Protected
const search = asyncHandler(async (req, res) => {
    const keyword = req.query.q
        ? {
            $or: [
                { name: { $regex: req.query.q, $options: 'i' } },
                { headline: { $regex: req.query.q, $options: 'i' } },
                { email: { $regex: req.query.q, $options: 'i' } },
            ],
        }
        : {};

    const users = await User.find(keyword).select('-password');

    const postKeyword = req.query.q
        ? { text: { $regex: req.query.q, $options: 'i' } }
        : {};

    const posts = await Post.find(postKeyword).populate('user', 'name profilePicture headline');

    res.json({ users, posts });
});

module.exports = { search };
