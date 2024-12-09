import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Save user data
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Save error message
      });
  },
});

export const { setUser, setLoading, setError } = authSlice.actions;

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;

      // Fetch user profile from Firestore
      const userDoc = await firestore().collection('users').doc(userId).get();
      if (!userDoc.exists) {
        throw new Error('User data not found');
      }

      const userData = userDoc.data();
      return { ...userCredential.user, hasOnboarded: userData.hasOnboarded || false };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password, additionalData }, { rejectWithValue }) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);

      const userId = userCredential.user.uid;

    // Save user data in Firestore
    await firestore().collection('users').doc(userId).set({
      email: email,
      ...additionalData, // Include any additional data like name, phone, etc.
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

      return userCredential.user; // Return the created user
    } catch (error) {
      console.error('Signup Error:', error);
      return rejectWithValue(error.message); // Return error message as rejected value
    }
  }
);

export default authSlice.reducer;