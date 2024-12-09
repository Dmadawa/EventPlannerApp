import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/apiServices';

export const fetchPhotos = createAsyncThunk('data/fetchPhotos', async () => {
  return await apiService.fetchPhotos();
});

export const fetchUsers = createAsyncThunk('data/fetchUsers', async () => {
  return await apiService.fetchUsers();
});

export const fetchPosts = createAsyncThunk('data/fetchPosts', async () => {
  return await apiService.fetchPosts();
});

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    photos: [],
    users: [],
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = action.payload;
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
      });
  },
});

export default dataSlice.reducer;
