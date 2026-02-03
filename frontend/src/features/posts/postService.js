import axios from 'axios';

const API_URL = 'http://localhost:5000/api/posts/';

// Create new post
const createPost = async (postData, token, onUploadProgress) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data' // axios sets this automatically
        },
        onUploadProgress: (progressEvent) => {
            if (onUploadProgress) {
                const percentage = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                onUploadProgress(percentage);
            }
        },
    };

    const response = await axios.post(API_URL, postData, config);
    console.log('createPost response:', response.data);

    return response.data;
};

// Get user posts
const getPosts = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL, config);

    return response.data;
};

// Like post
const likePost = async (postId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + 'like/' + postId, {}, config);

    return response.data;
};

// Add comment
const addComment = async (postId, text, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(
        API_URL + 'comment/' + postId,
        { text },
        config
    );

    return response.data;
};

const postService = {
    createPost,
    getPosts,
    likePost,
    addComment,
};

export default postService;
