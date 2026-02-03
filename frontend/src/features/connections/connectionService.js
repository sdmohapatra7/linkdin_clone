import axios from 'axios';

const API_URL = 'http://localhost:5000/api/connections/';

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

// Get suggestions (using getUsers from user API, but logically handled here for UI)
// Actually suggestions usually come from Users API (getAllUsers)
// So we might use userService for that, or here.
// Let's stick to requests here.

const connectionService = {
    getRequests,
    acceptRequest
};

export default connectionService;
