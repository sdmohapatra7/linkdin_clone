import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import searchService from './searchService';

const initialState = {
    results: { users: [], posts: [] },
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const searchGlobal = createAsyncThunk(
    'search/global',
    async (keyword, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await searchService.search(keyword, token);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchGlobal.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(searchGlobal.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.results = action.payload;
            })
            .addCase(searchGlobal.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = searchSlice.actions;
export default searchSlice.reducer;
