const express = require('express');
const router = express.Router();
const {
    createRole,
    getRoles,
    deleteRole,
    updateRole,
} = require('../controllers/roleController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getRoles).post(protect, createRole);
router.route('/:id').delete(protect, deleteRole).put(protect, updateRole);

module.exports = router;
