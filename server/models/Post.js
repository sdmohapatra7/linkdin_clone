const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            default: null,
        },
        text: {
            type: String,
            required: true,
        },
        image: [
            {
                type: String,
            },
        ],
        video: [
            {
                type: String,
            },
        ],
        likes: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            },
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                text: {
                    type: String,
                    required: true,
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

postSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
