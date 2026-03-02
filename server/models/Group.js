const mongoose = require('mongoose');

const groupSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a group name'],
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [500, 'Description cannot be more than 500 characters'],
        },
        coverImage: {
            type: String,
            default: 'https://via.placeholder.com/800x200?text=Group+Cover',
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        members: [
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

module.exports = mongoose.model('Group', groupSchema);
