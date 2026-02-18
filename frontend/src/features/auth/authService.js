import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/auth/';

// Register user
const register = async (userData) => {
    const response = await axios.post(API_URL + 'register', userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

// Login user
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

// Logout user
const logout = () => {
    localStorage.removeItem('user');
};

const USERS_API_URL = import.meta.env.VITE_API_BASE_URL + '/api/users/';

// Forgot Password
const forgotPassword = async (email) => {
    const response = await axios.post(USERS_API_URL + 'forgot-password', { email });
    return response.data;
};

// Reset Password
const resetPassword = async (token, password) => {
    const response = await axios.put(USERS_API_URL + 'reset-password/' + token, { password });
    return response.data;
};

const authService = {
    register,
    logout,
    login,
    forgotPassword,
    resetPassword,
};

export default authService;
