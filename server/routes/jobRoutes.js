const express = require('express');
const { getJobs, createJob, applyJob } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getJobs).post(protect, createJob);
router.route('/apply/:id').put(protect, applyJob);

module.exports = router;
