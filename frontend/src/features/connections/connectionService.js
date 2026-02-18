import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/connections/';

// Get connection requests
const getRequests = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL + 'requests', config);

    return response.data;
};

// Accept connection request
const acceptRequest = async (requestId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + 'accept/' + requestId, {}, config);
    return response.data;
}

// Withdraw connection request
const withdrawRequest = async (requestId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.delete(API_URL + 'withdraw/' + requestId, config);
    return response.data;
}

// Get connections
const getConnections = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL, config);
    return response.data;
}

// Send connection request
const sendConnectionRequest = async (receiverId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(API_URL + 'request', { receiverId }, config);
    return response.data;
}

// Get suggestions (using getUsers from user API)
// Ideally this should be in userService, but we'll include it here for simplicity in this context
const getSuggestions = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(import.meta.env.VITE_API_BASE_URL + '/api/users', config);
    return response.data;
}

const connectionService = {
    getRequests,
    acceptRequest,
    withdrawRequest,
    getConnections,
    sendConnectionRequest,
    getSuggestions
};

export default connectionService;
