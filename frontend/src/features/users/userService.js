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

const userService = {
    getUser,
};

export default userService;
