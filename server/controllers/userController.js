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
        user.location = req.body.location || user.location;

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
                user.profilePicture = `${process.env.BASE_URL}/${relativePath}`;
            }

            // Handle Banner Photo
            if (req.files.bannerPhoto) {
                const file = req.files.bannerPhoto[0];
                const oldPath = file.path;
                const newFilename = `user-banner-${user._id}-${Date.now()}${path.extname(file.originalname)}`;
                const newPath = path.join(targetDir, newFilename);

                fs.renameSync(oldPath, newPath);

                const relativePath = path.join('uploads', 'user', newFilename).replace(/\\/g, '/');
                user.bannerPhoto = `${process.env.BASE_URL}/${relativePath}`;
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
            user.profilePicture = `${process.env.BASE_URL}/${relativePath}`;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            headline: updatedUser.headline,
            profilePicture: updatedUser.profilePicture,
            bannerPhoto: updatedUser.bannerPhoto,
            bannerPhoto: updatedUser.bannerPhoto,
            about: updatedUser.about,
            location: updatedUser.location,
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

// @desc    Follow a user
// @route   PUT /api/users/follow/:id
// @access  Private
const followUser = async (req, res) => {
    if (req.user.id === req.params.id) {
        res.status(400);
        throw new Error('You cannot follow yourself');
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (userToFollow && currentUser) {
        if (!userToFollow.followers.includes(req.user.id)) {
            await userToFollow.updateOne({ $push: { followers: req.user.id } });
            await currentUser.updateOne({ $push: { following: req.params.id } });
            res.status(200).json({ message: 'User followed' });
        } else {
            res.status(400).json({ message: 'You already follow this user' });
        }
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}

// @desc    Unfollow a user
// @route   PUT /api/users/unfollow/:id
// @access  Private
const unfollowUser = async (req, res) => {
    if (req.user.id === req.params.id) {
        res.status(400);
        throw new Error('You cannot unfollow yourself');
    }

    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (userToUnfollow && currentUser) {
        if (userToUnfollow.followers.includes(req.user.id)) {
            await userToUnfollow.updateOne({ $pull: { followers: req.user.id } });
            await currentUser.updateOne({ $pull: { following: req.params.id } });
            res.status(200).json({ message: 'User unfollowed' });
        } else {
            res.status(400).json({ message: 'You do not follow this user' });
        }
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}



const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// @desc    Forgot Password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Get Reset Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        // In real app, send email here
        // await sendEmail({
        //   email: user.email,
        //   subject: 'Password Reset Token',
        //   message,
        // });

        console.log('----------------------------------------------------');
        console.log(`To: ${user.email}`);
        console.log(`Subject: Password Reset Request`);
        console.log(`Message: ${message}`);
        console.log('----------------------------------------------------');

        res.status(200).json({ success: true, data: 'Email sent (check server console)' });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(500);
        throw new Error('Email could not be sent');
    }
};

// @desc    Reset Password
// @route   PUT /api/users/reset-password/:resetToken
// @access  Public
const resetPassword = async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid token');
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        data: 'Password updated success',
    });
};

module.exports = { getUser, updateUser, getUsers, followUser, unfollowUser, forgotPassword, resetPassword };
