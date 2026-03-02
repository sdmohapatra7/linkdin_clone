import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import groupService from './groupService';

const initialState = {
    groups: [],
    group: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Create new group
export const createGroup = createAsyncThunk(
    'groups/create',
    async (groupData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await groupService.createGroup(groupData, token);
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

// Get user groups
export const getGroups = createAsyncThunk(
    'groups/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await groupService.getGroups(token);
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

// Get single group
export const getGroup = createAsyncThunk(
    'groups/getGroup',
    async (groupId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await groupService.getGroup(groupId, token);
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

// Join Group
export const joinGroup = createAsyncThunk(
    'groups/joinGroup',
    async (groupId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await groupService.joinGroup(groupId, token);
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

// Leave Group
export const leaveGroup = createAsyncThunk(
    'groups/leaveGroup',
    async (groupId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await groupService.leaveGroup(groupId, token);
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

export const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createGroup.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.groups.unshift(action.payload);
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getGroups.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getGroups.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.groups = action.payload;
            })
            .addCase(getGroups.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getGroup.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getGroup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.group = action.payload;
            })
            .addCase(getGroup.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(joinGroup.fulfilled, (state, action) => {
                // Update specific group state if we're viewing it
                if (state.group && state.group._id === action.payload._id) {
                    state.group = action.payload;
                }
                // Update in full list
                state.groups = state.groups.map(group =>
                    group._id === action.payload._id ? action.payload : group
                );
            })
            .addCase(leaveGroup.fulfilled, (state, action) => {
                // Update specific group state if we're viewing it
                if (state.group && state.group._id === action.payload._id) {
                    state.group = action.payload;
                }
                // Update in full list
                state.groups = state.groups.map(group =>
                    group._id === action.payload._id ? action.payload : group
                );
            });
    },
});

export const { reset } = groupSlice.actions;
export default groupSlice.reducer;
