import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postReducer from '../features/posts/postSlice';
import userReducer from '../features/users/userSlice';
import connectionReducer from '../features/connections/connectionSlice';
import chatReducer from '../features/chat/chatSlice';
import messageReducer from '../features/messages/messageSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import jobReducer from '../features/jobs/jobSlice';
import searchReducer from '../features/search/searchSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        post: postReducer,
        user: userReducer,
        connection: connectionReducer,
        chat: chatReducer,
        message: messageReducer,
        notification: notificationReducer,
        job: jobReducer,
        search: searchReducer,
    },
});
