import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

// Get user profile
const getUser = async (userId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL + userId, config);

    return response.data;
};

// Update user profile
const updateUser = async (userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            // Content-Type header is set automatically by axios when passing FormData
        },
    };

    const response = await axios.put(API_URL + 'profile', userData, config);

    return response.data;
};

const userService = {
    getUser,
    updateUser,
};

export default userService;
