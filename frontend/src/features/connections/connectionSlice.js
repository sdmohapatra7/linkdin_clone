import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import connectionService from './connectionService';

const initialState = {
    requests: [],
    connections: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Get connection requests
export const getRequests = createAsyncThunk(
    'connections/getRequests',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await connectionService.getRequests(token);
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

// Accept request
export const acceptRequest = createAsyncThunk(
    'connections/acceptRequest',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            await connectionService.acceptRequest(id, token);
            return id; // Return id to remove from state
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

// Withdraw/Reject request
export const withdrawRequest = createAsyncThunk(
    'connections/withdrawRequest',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            await connectionService.withdrawRequest(id, token);
            return id;
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

// Get connections
export const getConnections = createAsyncThunk(
    'connections/getConnections',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await connectionService.getConnections(token);
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

// Send connection request
export const sendConnectionRequest = createAsyncThunk(
    'connections/sendConnectionRequest',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await connectionService.sendConnectionRequest(id, token);
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

export const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRequests.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.requests = action.payload;
            })
            .addCase(getRequests.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(acceptRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.requests = state.requests.filter((req) => req._id !== action.payload);
            })
            .addCase(withdrawRequest.fulfilled, (state, action) => {
                state.requests = state.requests.filter((req) => req._id !== action.payload);
            })
            .addCase(getConnections.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getConnections.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.connections = action.payload;
            })
            .addCase(getConnections.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(sendConnectionRequest.fulfilled, (state, action) => {
                state.isSuccess = true;
                // Ideally we should remove the user from suggestions list here, 
                // but suggestions are local state in MyNetwork or we need a new slice state for it.
            });
    },
});

export const { reset } = connectionSlice.actions;
export default connectionSlice.reducer;
