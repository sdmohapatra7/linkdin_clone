const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        headline: {
            type: String,
            default: '',
        },
        about: {
            type: String,
            default: '',
        },
        skills: [String],
        profilePicture: {
            type: String,
            default: '',
        },
        bannerPhoto: {
            type: String,
            default: '',
        },
        connections: [
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

module.exports = mongoose.model('User', userSchema);
