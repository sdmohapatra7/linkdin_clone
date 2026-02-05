import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jobService from './jobService';

const initialState = {
    jobs: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

// Create new job
export const createJob = createAsyncThunk(
    'jobs/create',
    async (jobData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await jobService.createJob(jobData, token);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get all jobs
export const getJobs = createAsyncThunk(
    'jobs/getAll',
    async (_, thunkAPI) => {
        try {
            return await jobService.getJobs();
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Apply for job
export const applyJob = createAsyncThunk(
    'jobs/apply',
    async (jobId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await jobService.applyJob(jobId, token);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete job
export const deleteJob = createAsyncThunk(
    'jobs/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await jobService.deleteJob(id, token);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update job
export const updateJob = createAsyncThunk(
    'jobs/update',
    async ({ id, jobData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await jobService.updateJob(id, jobData, token);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
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
            .addCase(applyJob.fulfilled, (state, action) => {
                // Could update local state to show 'Applied', but simple toast/success is fine for now
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.jobs = state.jobs.filter((job) => job._id !== action.payload.id);
            })
            .addCase(updateJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.jobs = state.jobs.map((job) => (job._id === action.payload._id ? action.payload : job));
            });
    },
});

export const { reset } = jobSlice.actions;
export default jobSlice.reducer;
