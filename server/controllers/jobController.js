const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Admin/Recruiter)
const createJob = asyncHandler(async (req, res) => {
    const { title, company, location, type, description, skills, applyLink } = req.body;

    if (!title || !company || !location || !description) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    // Optional: Check if user is admin (req.user.isAdmin) - for now allowing anyone

    const job = await Job.create({
        title,
        company,
        location,
        type,
        description,
        skills: skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : [],
        applyLink,
        postedBy: req.user._id,
    });

    res.status(201).json(job);
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({}).sort({ createdAt: -1 }).populate('postedBy', 'name profilePicture headline');
    res.json(jobs);
});

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name profilePicture headline');

    if (job) {
        res.json(job);
    } else {
        res.status(404);
        throw new Error('Job not found');
    }
});

// @desc    Apply for a job (Internal)
// @route   PUT /api/jobs/:id/apply
// @access  Private
const applyForJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (job) {
        // Check if already applied
        if (job.applicants.includes(req.user._id)) {
            res.status(400);
            throw new Error('You have already applied to this job');
        }

        job.applicants.push(req.user._id);
        await job.save();

        res.json({ message: 'Application successful' });
    } else {
        res.status(404);
        throw new Error('Job not found');
    }
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Owner/Admin)
const deleteJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    // Check user (Simple check: must be poster)
    if (job.postedBy.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await job.deleteOne();

    res.json({ id: req.params.id });
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Owner/Admin)
const updateJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    // Check user
    if (job.postedBy.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedJob);
});

module.exports = {
    createJob,
    getJobs,
    getJobById,
    applyForJob,
    deleteJob,
    updateJob,
};
