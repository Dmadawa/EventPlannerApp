import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../store/slices/authSlice'; // Update with correct path
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSignUp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }

    try {
      await dispatch(signup({ email, password })).unwrap(); // Handle async result with `.unwrap()`
      Alert.alert('Success', 'Account created successfully');
      navigation.navigate('Login'); // Navigate to Login on success
    } catch (err) {
      console.error('Signup Error:', err);
      Alert.alert('Signup Failed', err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Heading */}
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Welcome to your Portal</Text>

      {/* Email Input */}
      <Text style={styles.nameField}>Email</Text>
      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="your.email@gmail.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <Text style={styles.nameField}>Password</Text>
      <View style={styles.inputContainer}>
        <AntDesign name="lock" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Icon
            name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <Text style={styles.nameField}>Confirm Password</Text>
      <View style={styles.inputContainer}>
        <AntDesign name="lock" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry={!isConfirmPasswordVisible}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
        >
          <Icon
            name={isConfirmPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.buttonText}>Sign Up</Text>
            <Icon name="arrow-forward-outline" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login</Text>
        <Icon name="arrow-back" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Error Message */}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: 600,
    color: '#191C1E',
    fontSize: 32,
    fontWeight: 600,
    color: '#333',
    textAlign: 'center',
    marginTop: 180,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    backgroundColor: '#DA5E4214'
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E76F51',
    paddingVertical: 14,
    marginTop: 100,
    width: 342,
    height: 44,
    marginBottom: 16,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E76F51',
    paddingVertical: 14,
    marginTop: 10,
    width: 342,
    height: 44,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    marginRight: 8,
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#E76F51',
    fontWeight: '500',
  },
  error: {
    color: 'red',
    marginTop: 16,
    textAlign: 'center',
  },
  nameField: {
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 7,
    color:'#444749'
  }
});

export default SignUpScreen;