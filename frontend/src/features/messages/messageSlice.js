import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messageService from './messageService';

const initialState = {
    messages: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const allMessages = createAsyncThunk(
    'message/allMessages',
    async (chatId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await messageService.allMessages(chatId, token);
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

export const sendMessage = createAsyncThunk(
    'message/sendMessage',
    async (messageData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await messageService.sendMessage(messageData, token);
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



export const markMessagesAsRead = createAsyncThunk(
    'message/markRead',
    async (chatId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await messageService.markMessagesAsRead(chatId, token);
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

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            if (!state.messages.some(m => m._id === action.payload._id)) {
                state.messages = [...state.messages, action.payload];
            }
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        resetMessages: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(allMessages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(allMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.messages = action.payload;
            })
            .addCase(allMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages = [...state.messages, action.payload];
            })
            .addCase(markMessagesAsRead.fulfilled, (state, action) => {
                // Should we update state? state.messages might need to be updated.
                // But usually we rely on socket event to update state to match other users.
                // For optimistic UI, we could update here.
                // Let's rely on socket for now or just ignore if we don't need instant feedback on our own read action (since we know we read it).
            });
    },
});

export const { addMessage, resetMessages, setMessages } = messageSlice.actions;
export default messageSlice.reducer;
