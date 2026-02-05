import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications/';

// Get user notifications
const getNotifications = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL, config);

    return response.data;
};

// Mark notification as read
const markAsRead = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + id, {}, config);

    return response.data;
};

// Delete notification
const deleteNotification = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.delete(API_URL + id, config);

    return response.data;
};

// Delete all notifications
const deleteAllNotifications = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.delete(API_URL, config);

    return response.data;
};

const notificationService = {
    getNotifications,
    markAsRead,
    deleteNotification,
    deleteAllNotifications,
};

export default notificationService;
