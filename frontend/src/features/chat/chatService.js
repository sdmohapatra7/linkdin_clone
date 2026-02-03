import axios from 'axios';

const API_URL = 'http://localhost:5000/api/chat/';

// Create or fetch one-on-one chat
const accessChat = async (userId, token) => {
    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(API_URL, { userId }, config);

    return response.data;
};

// Fetch all chats
const fetchChats = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL, config);

    return response.data;
};

const chatService = {
    accessChat,
    fetchChats,
};

export default chatService;
