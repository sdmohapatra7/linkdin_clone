const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Search users and posts
// @route   GET /api/search
// @access  Protected
const search = asyncHandler(async (req, res) => {
    const { q, role, location, skills } = req.query;

    let query = {};

    if (q) {
        query.$or = [
            { name: { $regex: q, $options: 'i' } },
            { headline: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } },
        ];
    }

    if (location) {
        query.location = { $regex: location, $options: 'i' };
    }

    if (skills) {
        // skills can be a comma-separated string from the query
        const skillsArray = skills.split(',').map(s => s.trim());
        // Match users who have at least one of the skills
        query.skills = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
    }

    // Role filtering
    if (role) {
        // If role is an ID, use it directly. If it's a name, find the ID.
        // For simplicity, let's assume the frontend sends the Role ID if selecting from a dropdown,
        // or we try to find a role with that name.
        // Check if role is a valid ObjectId
        const isValidObjectId = (id) => id.match(/^[0-9a-fA-F]{24}$/);

        if (isValidObjectId(role)) {
            query.role = role;
        } else {
            // Try to find role by name
            const roleDoc = await require('../models/Role').findOne({ name: { $regex: role, $options: 'i' } });
            if (roleDoc) {
                query.role = roleDoc._id;
            } else {
                // If role name not found, maybe return no users? or just ignore?
                // Let's return no users to be accurate
                query.role = null;
            }
        }
    }

    const users = await User.find(query).select('-password').populate('role', 'name');

    // Post search (keep it simple for now, just text search)
    let postQuery = {};
    if (q) {
        postQuery.text = { $regex: q, $options: 'i' };
    } else {
        // If no keyword, don't return random posts in advanced search unless specifically asked
        // But the original logic returned empty if no q.
        // If filters are applied (location/role), posts don't strictly have location/role fields 
        // (unless we filter posts by user's location/role, which is expensive).
        // Let's only search posts if there is a 'q'.
    }

    // Only fetch posts if 'q' is present, otherwise advanced search is usually for People
    let posts = [];
    if (q) {
        posts = await Post.find(postQuery).populate('user', 'name profilePicture headline');
    }

    res.json({ users, posts });
});

module.exports = { search };
