const asyncHandler = require('express-async-handler');
const Group = require('../models/Group');
const User = require('../models/User');

// @desc    Get all groups
// @route   GET /api/groups
// @access  Private
const getAllGroups = asyncHandler(async (req, res) => {
    // Return all groups, sorted by newest first
    const groups = await Group.find()
        .populate('admin', 'name profilePicture')
        .sort({ createdAt: -1 });

    res.status(200).json(groups);
});

// @desc    Get group by ID
// @route   GET /api/groups/:id
// @access  Private
const getGroupById = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id)
        .populate('admin', 'name profilePicture title')
        .populate('members', 'name profilePicture title');

    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    res.status(200).json(group);
});

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
const createGroup = asyncHandler(async (req, res) => {
    const { name, description, coverImage } = req.body;

    if (!name || !description) {
        res.status(400);
        throw new Error('Please add a name and description');
    }

    // Create the group, setting the creator as admin and the first member
    const group = await Group.create({
        name,
        description,
        coverImage: coverImage || 'https://via.placeholder.com/800x200?text=Group+Cover',
        admin: req.user.id,
        members: [req.user.id] // Creator is automatically a member
    });

    res.status(201).json(group);
});

// @desc    Join a group
// @route   PUT /api/groups/:id/join
// @access  Private
const joinGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    // Check if user is already a member
    if (group.members.includes(req.user.id)) {
        res.status(400);
        throw new Error('You are already a member of this group');
    }

    group.members.push(req.user.id);
    await group.save();

    res.status(200).json(group);
});

// @desc    Leave a group
// @route   PUT /api/groups/:id/leave
// @access  Private
const leaveGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    // Prevent admin from leaving without transferring admin rights
    if (group.admin.toString() === req.user.id) {
        res.status(400);
        throw new Error('Admin cannot leave the group. Delete the group or transfer admin rights.');
    }

    // Check if user is actually a member
    if (!group.members.includes(req.user.id)) {
        res.status(400);
        throw new Error('You are not a member of this group');
    }

    // Remove user from members array
    group.members = group.members.filter(
        (memberId) => memberId.toString() !== req.user.id
    );

    await group.save();

    res.status(200).json(group);
});

// @desc    Delete a group
// @route   DELETE /api/groups/:id
// @access  Private
const deleteGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    // Check for admin permission
    if (group.admin.toString() !== req.user.id && !req.user.isAdmin) {
        res.status(401);
        throw new Error('User not authorized to delete this group');
    }

    await group.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getAllGroups,
    getGroupById,
    createGroup,
    joinGroup,
    leaveGroup,
    deleteGroup
};
