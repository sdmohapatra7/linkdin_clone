const express = require('express');
const router = express.Router();
const {
    createJob,
    getJobs,
    getJobById,
    applyForJob,
    deleteJob,
    updateJob,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getJobs).post(protect, createJob);
router.route('/:id').get(getJobById).delete(protect, deleteJob).put(protect, updateJob);
router.route('/:id/apply').put(protect, applyForJob);

module.exports = router;
