const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Protected
const getJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find().sort({ createdAt: -1 }).populate('postedBy', 'name profilePicture');
    res.json(jobs);
});

// @desc    Create a job
// @route   POST /api/jobs
// @access  Protected
const createJob = asyncHandler(async (req, res) => {
    const { title, company, location, description, type } = req.body;

    if (!title || !company || !location || !description || !type) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const job = await Job.create({
        title,
        company,
        location,
        description,
        type,
        postedBy: req.user.id,
    });

    res.status(201).json(job);
});

// @desc    Apply for a job
// @route   PUT /api/jobs/apply/:id
// @access  Protected
const applyJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    // Check if already applied
    if (job.applicants.includes(req.user.id)) {
        res.status(400);
        throw new Error('Already applied to this job');
    }

    job.applicants.push(req.user.id);
    await job.save();

    res.json(job);
});

module.exports = { getJobs, createJob, applyJob };
