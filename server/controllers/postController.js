const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
const fs = require('fs');
const path = require('path');

const createPost = async (req, res) => {
    console.log('Hit createPost endpoint');
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    if (!req.body.text && (!req.files || Object.keys(req.files).length === 0)) {
        res.status(400);
        throw new Error('Please add text or media');
    }

    // 1. Create a temporary post object to get an ID (or just new mongoose.Types.ObjectId())
    // Using new Post() generates an _id but doesn't save to DB yet.
    const newPost = new Post({
        text: req.body.text,
        user: req.user.id,
        image: [],
        video: []
    });

    const postId = newPost._id.toString();
    const targetDir = path.join('uploads', postId);

    // 2. Create the directory
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // 3. Move images
    const imagePaths = [];
    if (req.files && req.files['image']) {
        for (const file of req.files['image']) {
            const oldPath = file.path;
            const newFilename = file.filename;
            const newPath = path.join(targetDir, newFilename);

            fs.renameSync(oldPath, newPath);
            // Store the relative path (normalized for URL)
            // Windows path separator needs to be replaced with forward slash for URLs
            imagePaths.push(`http://localhost:5000/${projectIdToUrlPath(path.join('uploads', postId, newFilename))}`);
        }
    }

    // 4. Move videos
    const videoPaths = [];
    if (req.files && req.files['video']) {
        for (const file of req.files['video']) {
            const oldPath = file.path;
            const newFilename = file.filename;
            const newPath = path.join(targetDir, newFilename);

            fs.renameSync(oldPath, newPath);
            videoPaths.push(`http://localhost:5000/${projectIdToUrlPath(path.join('uploads', postId, newFilename))}`);
        }
    }

    // UPDATE: The helper function projectIdToUrlPath is just a concept, let's just do it inline
    // replace backslashes with slashes
    newPost.image = imagePaths.map(p => p.replace(/\\/g, '/'));
    newPost.video = videoPaths.map(p => p.replace(/\\/g, '/'));

    const post = await newPost.save();

    const populatedPost = await Post.findById(post._id).populate('user', 'name profilePicture headline');

    const io = req.app.get('io');
    if (io) {
        io.emit('new post', populatedPost);
    }

    res.status(200).json(populatedPost);
};

// Helper to sanitize path for URL
function projectIdToUrlPath(p) {
    return p.replace(/\\/g, '/');
}

// @desc    Get posts
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
        .populate('user', 'name profilePicture headline')
        .populate('comments.user', 'name profilePicture headline')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.status(200).json(posts);
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(400);
        throw new Error('Post not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the post user
    if (post.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await post.remove();

    res.status(200).json({ id: req.params.id });
};

// @desc    Like post
// @route   PUT /api/posts/like/:id
// @access  Private
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if the post has already been liked

        if (
            post.likes.filter((like) => like.user.toString() === req.user.id).length > 0
        ) {
            // Get remove index
            const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
            post.likes.splice(removeIndex, 1);
        } else {
            post.likes.unshift({ user: req.user.id });

            // Create Notification if not liking own post
            if (post.user.toString() !== req.user.id) {
                const notification = await Notification.create({
                    recipient: post.user,
                    sender: req.user.id,
                    type: 'like',
                    post: post._id,
                });

                await notification.populate('sender', 'name profilePicture');
                await notification.populate('post', 'text');

                // Real-time update
                const io = req.app.get('io');
                if (io) {
                    io.in(post.user.toString()).emit('notification received', notification);
                }
            }
        }

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Add comment
// @route   POST /api/posts/comment/:id
// @access  Private
const addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            user: req.user.id,
        };

        post.comments.unshift(newComment);

        await post.save();

        // Re-fetch to get populated data
        const populatedPost = await Post.findById(req.params.id)
            .populate('comments.user', 'name profilePicture headline')
            .populate('user', 'name profilePicture headline');

        // Notification for comment
        if (post.user.toString() !== req.user.id) {
            const notification = await Notification.create({
                recipient: post.user,
                sender: req.user.id,
                type: 'comment',
                post: post._id,
            });

            await notification.populate('sender', 'name profilePicture');
            await notification.populate('post', 'text');

            const io = req.app.get('io');
            if (io) {
                io.in(post.user.toString()).emit('notification received', notification);
            }
        }

        res.json(populatedPost.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    createPost,
    getPosts,
    deletePost,
    likePost,
    addComment,
};
