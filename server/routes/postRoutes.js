const express = require('express');
const router = express.Router();
const {
    createPost,
    getPosts,
    deletePost,
    likePost,
    addComment,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.route('/').post(protect, upload.fields([{ name: 'image', maxCount: 5 }, { name: 'video', maxCount: 5 }]), createPost).get(protect, getPosts);
router.route('/:id').delete(protect, deletePost);
router.route('/like/:id').put(protect, likePost);
router.route('/comment/:id').post(protect, addComment);

module.exports = router;
