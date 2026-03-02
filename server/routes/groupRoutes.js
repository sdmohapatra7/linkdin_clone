const express = require('express');
const router = express.Router();
const {
    getAllGroups,
    getGroupById,
    createGroup,
    joinGroup,
    leaveGroup,
    deleteGroup
} = require('../controllers/groupController');

const { protect } = require('../middleware/authMiddleware');

// All group routes are protected
router.route('/').get(protect, getAllGroups).post(protect, createGroup);
router.route('/:id').get(protect, getGroupById).delete(protect, deleteGroup);
router.route('/:id/join').put(protect, joinGroup);
router.route('/:id/leave').put(protect, leaveGroup);

module.exports = router;
