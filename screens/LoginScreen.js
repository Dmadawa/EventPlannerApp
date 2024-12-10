// LoginScreen.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';
import { login } from '../store/slices/authSlice';
import TextInputWithIcon from '../components/TextInputWithIcon';
import IconFeather from 'react-native-vector-icons/Feather'; 
import CustomButton from '../components/CustomButton'; 
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Routes }  from '../navigation/Routes';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    try {
      const user = await dispatch(login({ email, password })).unwrap();
      const { hasOnboarded } = user;

      if (hasOnboarded) {
        Alert.alert('Success', 'Logged in successfully');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Drawer' }]
        });
      } else {
        Alert.alert('Welcome', 'Please complete your onboarding.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'ProfileImageUpload' }]
        });
      }
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'An error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Welcome to your Portal</Text>

      {/* Email Input */}
      <Text style={styles.nameField}>Email</Text>
      <TextInputWithIcon
        value={email}
        onChangeText={setEmail}
        placeholder="your.email@gmail.com"
        leftIconName="mail-outline"
        leftIconLibrary="Ionicons" // Specify Ionicons library for the email icon
      />

      {/* Password Input */}
      <Text style={styles.nameField}>Password</Text>
      <TextInputWithIcon
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry={!isPasswordVisible}
        leftIconName="lock"
        leftIconLibrary="AntDesign" // Specify AntDesign library for the lock icon
        rightIconName={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
        rightIconLibrary="Ionicons" // Specify Ionicons library for the eye icon
        onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
      />
      {/* Restore Password */}
      <TouchableOpacity
        style={styles.restorePassword}
        onPress={() => navigation.navigate(Routes.RESTOREPASSWORDSCREEN)}
      >
        <Text style={styles.restorePasswordText}>Restore password</Text>
        <IconFeather name="arrow-up-right" size={16} color="#E76F51" />
      </TouchableOpacity>
      <View style={{ marginTop: 150 }}>
      {/* Login Button */}
      <CustomButton
        onPress={handleLogin}
        text="Login"
        loading={loading}
        iconName="arrow-forward-outline"
        disabled={loading}
      />


      {/* Sign Up Button */}
      <CustomButton
        onPress={() => navigation.navigate(Routes.SIGNUP)}
        text="Sign Up"
        loading={loading}
        iconName="arrow-forward-outline"
        disabled={loading}
      />
      </View>

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
    fontWeight: '600',
    color: '#191C1E',
    fontSize: 32,
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
  nameField: {
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 7,
    color: '#444749',
  },
  error: {
    color: 'red',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default LoginScreen;
