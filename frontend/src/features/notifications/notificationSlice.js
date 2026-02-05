import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from './notificationService';

const initialState = {
    notifications: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

// Get user notifications
export const getNotifications = createAsyncThunk(
    'notifications/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await notificationService.getNotifications(token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }

);

// Mark notification as read
export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await notificationService.markAsRead(id, token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
    'notifications/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await notificationService.deleteNotification(id, token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete all notifications
export const deleteAllNotifications = createAsyncThunk(
    'notifications/deleteAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await notificationService.deleteAllNotifications(token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        reset: (state) => initialState,
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotifications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.notifications = action.payload;
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                state.notifications = state.notifications.map((notification) =>
                    notification._id === action.payload._id ? action.payload : notification
                );
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.notifications = state.notifications.filter(
                    (notification) => notification._id !== action.payload.id
                );
            })
            .addCase(deleteAllNotifications.fulfilled, (state) => {
                state.notifications = [];
            });
    },
});

export const { reset, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
