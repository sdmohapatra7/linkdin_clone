import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from './chatService';

const initialState = {
    chats: [],
    selectedChat: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const accessChat = createAsyncThunk(
    'chat/access',
    async (userId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await chatService.accessChat(userId, token);
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

export const fetchChats = createAsyncThunk(
    'chat/fetch',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await chatService.fetchChats(token);
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

export const createGroupChat = createAsyncThunk(
    'chat/createGroup',
    async (groupData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await chatService.createGroupChat(groupData, token);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const renameGroup = createAsyncThunk(
    'chat/renameGroup',
    async (groupData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await chatService.renameGroup(groupData, token);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const addToGroup = createAsyncThunk(
    'chat/addToGroup',
    async (groupData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await chatService.addToGroup(groupData, token);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const removeFromGroup = createAsyncThunk(
    'chat/removeFromGroup',
    async (groupData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await chatService.removeFromGroup(groupData, token);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
        resetChat: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(accessChat.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(accessChat.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                if (!state.chats.find((c) => c._id === action.payload._id)) {
                    state.chats.unshift(action.payload);
                }
                state.selectedChat = action.payload;
            })
            .addCase(accessChat.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(fetchChats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.chats = action.payload;
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createGroupChat.fulfilled, (state, action) => {
                state.chats.unshift(action.payload);
                state.selectedChat = action.payload; // Optional: select created chat
            })
            .addCase(renameGroup.fulfilled, (state, action) => {
                state.selectedChat = action.payload;
                // Update in list
                state.chats = state.chats.map(c => c._id === action.payload._id ? action.payload : c);
            })
            .addCase(addToGroup.fulfilled, (state, action) => {
                state.selectedChat = action.payload;
                state.chats = state.chats.map(c => c._id === action.payload._id ? action.payload : c);
            })
            .addCase(removeFromGroup.fulfilled, (state, action) => {
                state.selectedChat = action.payload;
                state.chats = state.chats.map(c => c._id === action.payload._id ? action.payload : c);
            });
    },
});

export const { setSelectedChat, resetChat } = chatSlice.actions;
export default chatSlice.reducer;
