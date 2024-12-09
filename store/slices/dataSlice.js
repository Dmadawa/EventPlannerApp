import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const fetchPhotos = createAsyncThunk('data/fetchPhotos', async () => {
  const response = await axios.get(`${BASE_URL}/photos`);
  return response.data.slice(0, 10);
});

export const fetchUsers = createAsyncThunk('data/fetchUsers', async () => {
  const response = await axios.get(`${BASE_URL}/users`);
  return response.data;
});

export const fetchPosts = createAsyncThunk('data/fetchPosts', async () => {
  const response = await axios.get(`${BASE_URL}/posts`);
  return response.data;
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
      // Add cases for users and posts
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
      });
  },
});

export default dataSlice.reducer;
