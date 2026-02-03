import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jobService from './jobService';

const initialState = {
    jobs: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

// Get all jobs
export const getJobs = createAsyncThunk('jobs/getAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await jobService.getJobs(token);
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create job
export const createJob = createAsyncThunk(
    'jobs/create',
    async (jobData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await jobService.createJob(jobData, token);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Apply job
export const applyJob = createAsyncThunk(
    'jobs/apply',
    async (jobId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await jobService.applyJob(jobId, token);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getJobs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getJobs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.jobs = action.payload;
            })
            .addCase(getJobs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createJob.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.jobs.unshift(action.payload);
            })
            .addCase(createJob.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(applyJob.fulfilled, (state, action) => {
                const index = state.jobs.findIndex(
                    (job) => job._id === action.payload._id
                );
                if (index !== -1) {
                    state.jobs[index] = action.payload;
                }
            });
    },
});

export const { reset } = jobSlice.actions;
export default jobSlice.reducer;
