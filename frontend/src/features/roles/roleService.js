import axios from 'axios';

const API_URL = 'http://localhost:5000/api/roles/';

// Get roles
const getRoles = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Create role
const createRole = async (roleData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(API_URL, roleData, config);
    return response.data;
};

// Delete role
const deleteRole = async (roleId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.delete(API_URL + roleId, config);
    return response.data;
};

// Update role
const updateRole = async (roleId, roleData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + roleId, roleData, config);
    return response.data;
};

const roleService = {
    getRoles,
    createRole,
    deleteRole,
    updateRole,
};

export default roleService;
