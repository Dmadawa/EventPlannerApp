import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Provider from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import LoginScreen from '../screens/LoginScreen';

// Mock dependencies
const mockStore = configureStore([thunk]);

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    reset: jest.fn(),
    navigate: jest.fn(),
  }),
}));

jest.mock('../store/slices/authSlice', () => ({
  login: jest.fn(({ email, password }) => async (dispatch) => {
    if (email === 'valid@example.com' && password === 'password') {
      return { hasOnboarded: true }; // Mocked response
    } else {
      throw new Error('Invalid email or password');
    }
  }),
}));

describe('LoginScreen', () => {
  let store;
  let navigation;

  beforeEach(() => {
    store = mockStore({
      auth: { loading: false, error: null },
    });
    navigation = {
      reset: jest.fn(),
      navigate: jest.fn(),
    };
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );

    expect(getByText('Welcome')).toBeTruthy();
    expect(getByText('Welcome to your Portal')).toBeTruthy();
    expect(getByPlaceholderText('your.email@gmail.com')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('handles login with valid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );

    const emailInput = getByPlaceholderText('your.email@gmail.com');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'valid@example.com');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(navigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Drawer' }],
      });
    });
  });

  it('shows an error on invalid login', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );

    const emailInput = getByPlaceholderText('your.email@gmail.com');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'invalid@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(loginButton);

    const errorMessage = await findByText('Invalid email or password');
    expect(errorMessage).toBeTruthy();
  });

  it('disables login button while loading', () => {
    store = mockStore({
      auth: { loading: true, error: null },
    });

    const { getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );

    const loginButton = getByText('Login');
    expect(loginButton).toBeDisabled();
  });

  it('navigates to sign up screen on "Sign Up" press', () => {
    const { getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );

    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);

    expect(navigation.navigate).toHaveBeenCalledWith('SignUp');
  });

  it('navigates to restore password screen on "Restore password" press', () => {
    const { getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );

    const restorePasswordButton = getByText('Restore password');
    fireEvent.press(restorePasswordButton);

    expect(navigation.navigate).toHaveBeenCalledWith('RestorePassword');
  });
});
