import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LoginScreen from '../screens/LoginScreen'; // Adjust the import based on your file structure
import { login } from '../store/slices/authSlice';
import { Alert } from 'react-native';

// Mock navigation
const mockNavigate = jest.fn();
const mockReset = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    reset: mockReset,
  }),
}));

jest.mock('react-native', () => {
  return {
    StyleSheet: {
      create: jest.fn(() => ({})),
    },
  };
});

// Mock Redux actions
jest.mock('../store/slices/authSlice', () => ({
  login: jest.fn(),
}));

describe('LoginScreen', () => {
  const mockStore = configureStore([]);
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        loading: false,
        error: null,
      },
    });
    jest.clearAllMocks();
  });

  it('renders the login screen correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    expect(getByText('Welcome')).toBeTruthy();
    expect(getByText('Welcome to your Portal')).toBeTruthy();
    expect(getByPlaceholderText('your.email@gmail.com')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('displays an error message when login fails', async () => {
    const mockError = 'Invalid credentials';
    login.mockRejectedValueOnce(new Error(mockError));

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    fireEvent.changeText(getByPlaceholderText('your.email@gmail.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Login Failed', mockError);
    });
  });

  it('navigates to the onboarding screen when the user is not onboarded', async () => {
    const mockUser = { hasOnboarded: false };
    login.mockResolvedValueOnce(mockUser);

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <LoginScreen navigation={{ reset: mockReset }} />
      </Provider>
    );

    fireEvent.changeText(getByPlaceholderText('your.email@gmail.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'ProfileImageUpload' }],
      });
    });
  });

  it('navigates to the drawer screen when the user is onboarded', async () => {
    const mockUser = { hasOnboarded: true };
    login.mockResolvedValueOnce(mockUser);

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <LoginScreen navigation={{ reset: mockReset }} />
      </Provider>
    );

    fireEvent.changeText(getByPlaceholderText('your.email@gmail.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Drawer' }],
      });
    });
  });

  it('shows a loading indicator when login is in progress', () => {
    store = mockStore({
      auth: {
        loading: true,
        error: null,
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    expect(getByTestId('ActivityIndicator')).toBeTruthy();
  });
});
