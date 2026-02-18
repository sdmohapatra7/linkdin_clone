import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/message/';

// Get all messages
const allMessages = async (chatId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL + chatId, config);

    return response.data;
};

// Send new message
const sendMessage = async (messageData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // If it's not FormData, set JSON header (optional as axios usually detects, but good for explicit)
    if (!(messageData instanceof FormData)) {
        config.headers['Content-type'] = 'application/json';
    }

    const response = await axios.post(API_URL, messageData, config);

    return response.data;
};

// Mark messages as read
const markMessagesAsRead = async (chatId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + 'read', { chatId }, config);
    return response.data;
};

const messageService = {
    allMessages,
    sendMessage,
    markMessagesAsRead,
};

export default messageService;
