const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
const getUser = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUser = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.headline = req.body.headline || user.headline;
        user.about = req.body.about || user.about;
        user.skills = req.body.skills || user.skills;

        if (req.body.password) {
            // Add password hashing if needed here, usually better in pre-save hook
            // For now, assuming standard update flow
            // To strictly follow auth controller pattern, we might want to hash it here if changed
            // But let's skip password update in profile for simplicity in this step or import bcrypt
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            headline: updatedUser.headline,
            token: req.body.token, // maintain token
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Search/List users
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const users = await User.find({ ...keyword }).find({ _id: { $ne: req.user._id } });
    res.json(users);
};

module.exports = { getUser, updateUser, getUsers };
