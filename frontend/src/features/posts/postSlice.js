import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postService from './postService';

const initialState = {
    posts: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    uploadProgress: 0,
};

// Create new post
export const createPost = createAsyncThunk(
    'posts/create',
    async (postData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await postService.createPost(postData, token, (progress) => {
                thunkAPI.dispatch(postSlice.actions.setUploadProgress(progress));
            });
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

// Get user posts
export const getPosts = createAsyncThunk(
    'posts/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await postService.getPosts(token);
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

// Like post
export const likePost = createAsyncThunk(
    'posts/like',
    async (postId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await postService.likePost(postId, token);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Add comment
export const addComment = createAsyncThunk(
    'posts/comment',
    async ({ postId, text }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await postService.addComment(postId, text, token);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        reset: (state) => {
            state.posts = [];
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
            state.uploadProgress = 0;
        },
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPost.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.posts.unshift(action.payload);
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getPosts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.posts = action.payload;
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(likePost.fulfilled, (state, action) => {
                const index = state.posts.findIndex(post => post._id === action.meta.arg);
                if (index !== -1) {
                    state.posts[index].likes = action.payload;
                }
            })
            .addCase(addComment.fulfilled, (state, action) => {
                const index = state.posts.findIndex(post => post._id === action.meta.arg.postId);
                if (index !== -1) {
                    state.posts[index].comments = action.payload;
                }
            });
    },
});

export const { reset } = postSlice.actions;
export default postSlice.reducer;
