const asyncHandler = require('express-async-handler');
const Role = require('../models/Role');

// @desc    Create a new role
// @route   POST /api/roles
// @access  Private (Admin)
const createRole = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        res.status(400);
        throw new Error('Please add a role name');
    }

    // Check if role exists
    const roleExists = await Role.findOne({ name });

    if (roleExists) {
        res.status(400);
        throw new Error('Role already exists');
    }

    const role = await Role.create({
        name,
    });

    res.status(201).json(role);
});

// @desc    Get all roles
// @route   GET /api/roles
// @access  Public
const getRoles = asyncHandler(async (req, res) => {
    const roles = await Role.find({});
    res.json(roles);
});

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Private (Admin)
const deleteRole = asyncHandler(async (req, res) => {
    const role = await Role.findById(req.params.id);

    if (!role) {
        res.status(404);
        throw new Error('Role not found');
    }

    await role.deleteOne();
    res.json({ id: req.params.id });
});

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private (Admin)
const updateRole = asyncHandler(async (req, res) => {
    const role = await Role.findById(req.params.id);

    if (!role) {
        res.status(404);
        throw new Error('Role not found');
    }

    const { name } = req.body;
    if (!name) {
        res.status(400);
        throw new Error('Please add a role name');
    }

    role.name = name;
    const updatedRole = await role.save();

    res.status(200).json(updatedRole);
});

module.exports = {
    createRole,
    getRoles,
    deleteRole,
    updateRole,
};
