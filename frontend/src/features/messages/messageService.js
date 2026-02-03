import axios from 'axios';

const API_URL = 'http://localhost:5000/api/message/';

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
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(API_URL, messageData, config);

    return response.data;
};

const messageService = {
    allMessages,
    sendMessage,
};

export default messageService;
