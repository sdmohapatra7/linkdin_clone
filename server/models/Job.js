const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        company: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
        },
        type: {
            type: String, // Full-time, Part-time, Contract, etc.
            required: true,
            default: 'Full-time',
        },
        description: {
            type: String,
            required: true,
        },
        skills: [String], // Array of skill strings
        applyLink: {
            type: String, // Optional external link
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        applicants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Job', jobSchema);
