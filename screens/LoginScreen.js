import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';
import { login } from '../store/slices/authSlice';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFeather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    try {
      // Dispatch login action
      const user = await dispatch(login({ email, password })).unwrap();
  
      // Assume user contains a `hasOnboarded` field
      const { hasOnboarded } = user;
  
      // Navigate based on onboarding status
      if (hasOnboarded) {
        Alert.alert('Success', 'Logged in successfully');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Drawer' }], // Reset to DrawerNavigator
        });
      } else {
        Alert.alert('Welcome', 'Please complete your onboarding.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'ProfileImageUpload' }], // Navigate to Profile Image Upload
        });
      }
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'An error occurred'); // Show error to the user
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

      {/* Restore Password */}
      <TouchableOpacity
        style={styles.restorePassword}
        onPress={() => navigation.navigate('RestorePassword')}
      >
        <Text style={styles.restorePasswordText}>Restore password</Text>
        <IconFeather name="arrow-up-right" size={16} color="#E76F51" />
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.buttonText}>Login</Text>
            <Icon name="arrow-forward-outline" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
        <Icon name="arrow-forward-outline" size={20} color="#fff" />
      </TouchableOpacity>

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
    marginBottom: 8,
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
  restorePassword: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 32,
  },
  restorePasswordText: {
    fontSize: 14,
    color: '#E76F51',
    marginRight: 4,
    fontWeight: '500',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DA5E42',
    width:342,
    height:44,
    borderRadius:2,
    paddingVertical: 14,
    marginTop: 100,
    marginBottom: 16,
  },
  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DA5E42',
    borderRadius:2,
    width:342,
    height:44,
    paddingVertical: 14
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    marginRight: 8,
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

export default LoginScreen;
