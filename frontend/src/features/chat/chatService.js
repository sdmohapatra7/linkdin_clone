import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/chat/';

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

const createGroupChat = async (groupData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(API_URL + 'group', groupData, config);
    return response.data;
};

const renameGroup = async (groupData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + 'rename', groupData, config);
    return response.data;
};

const addToGroup = async (groupData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + 'groupadd', groupData, config);
    return response.data;
};

const removeFromGroup = async (groupData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + 'groupremove', groupData, config);
    return response.data;
};

const chatService = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
};

export default chatService;
