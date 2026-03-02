import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/groups/';

// Create new group
const createGroup = async (groupData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(API_URL, groupData, config);
    return response.data;
};

// Get all groups
const getGroups = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL, config);
    return response.data;
};

// Get single group by ID
const getGroup = async (groupId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL + groupId, config);
    return response.data;
};

// Join a group
const joinGroup = async (groupId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + groupId + '/join', {}, config);
    return response.data;
};

// Leave a group
const leaveGroup = async (groupId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + groupId + '/leave', {}, config);
    return response.data;
};

const groupService = {
    createGroup,
    getGroups,
    getGroup,
    joinGroup,
    leaveGroup,
};

export default groupService;
