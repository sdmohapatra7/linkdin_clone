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

const fs = require('fs');
const path = require('path');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUser = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.headline = req.body.headline || user.headline;
        user.about = req.body.about || user.about;

        // Handle skills (check if it is a string or array)
        if (req.body.skills) {
            user.skills = Array.isArray(req.body.skills) ? req.body.skills : req.body.skills.split(',').map(s => s.trim());
        }

        // Handle file uploads
        if (req.files) {
            const targetDir = path.join('uploads', 'user');
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            // Handle Profile Picture
            if (req.files.profilePicture) {
                const file = req.files.profilePicture[0];
                const oldPath = file.path;
                const newFilename = `user-pfp-${user._id}-${Date.now()}${path.extname(file.originalname)}`;
                const newPath = path.join(targetDir, newFilename);

                fs.renameSync(oldPath, newPath);

                const relativePath = path.join('uploads', 'user', newFilename).replace(/\\/g, '/');
                user.profilePicture = `http://localhost:5000/${relativePath}`;
            }

            // Handle Banner Photo
            if (req.files.bannerPhoto) {
                const file = req.files.bannerPhoto[0];
                const oldPath = file.path;
                const newFilename = `user-banner-${user._id}-${Date.now()}${path.extname(file.originalname)}`;
                const newPath = path.join(targetDir, newFilename);

                fs.renameSync(oldPath, newPath);

                const relativePath = path.join('uploads', 'user', newFilename).replace(/\\/g, '/');
                user.bannerPhoto = `http://localhost:5000/${relativePath}`;
            }
        } else if (req.file) {
            // Fallback for single file upload legacy support specifically for profilePicture if mistakenly used
            // This block might not be reached if using upload.fields strictly, but good for safety if middleware changes back temporarily
            const targetDir = path.join('uploads', 'user');
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            const oldPath = req.file.path;
            const newFilename = `user-${user._id}-${Date.now()}${path.extname(req.file.originalname)}`;
            const newPath = path.join(targetDir, newFilename);

            fs.renameSync(oldPath, newPath);

            const relativePath = path.join('uploads', 'user', newFilename).replace(/\\/g, '/');
            user.profilePicture = `http://localhost:5000/${relativePath}`;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            headline: updatedUser.headline,
            profilePicture: updatedUser.profilePicture,
            bannerPhoto: updatedUser.bannerPhoto,
            about: updatedUser.about,
            skills: updatedUser.skills,
            token: req.body.token,
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
