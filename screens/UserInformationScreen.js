import React, { useState } from 'react';
import { View, TextInput, TouchableWithoutFeedback, StyleSheet, Text, TouchableOpacity, Keyboard, KeyboardAvoidingView, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const UserInformationScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mailingAddress, setMailingAddress] = useState('');

  const handleFinish = async () => {
    const userId = auth().currentUser.uid;
    await firestore().collection('users').doc(userId).update({
      firstName,
      lastName,
      email,
      phoneNumber,
      mailingAddress,
      hasOnboarded: true,
    });

    // Reset the navigation stack and navigate to Main Tabs
    navigation.dispatch(
      navigation.reset({
        index: 0,
        routes: [{ name: 'Drawer' }], // Reset to DrawerNavigator
      })
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.containerMain} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Different behavior on iOS and Android
    >
    {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Personal info</Text>
      <Text style={styles.subtitle}>You can add your personal data now or do it later</Text>
      <Text style={styles.nameField}>First Name</Text>
      <View style={{ marginTop: 25 }}>
      <Text style={styles.nameField}>First Name</Text>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <Text style={styles.nameField}>Last Name</Text>
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <Text style={styles.nameField}>Email</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <Text style={styles.nameField}>Phone number</Text>
      <TextInput
        placeholder="Phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <Text style={styles.nameField}>Mailing address</Text>
      <TextInput
        placeholder="Mailing address"
        value={mailingAddress}
        onChangeText={setMailingAddress}
        style={styles.input}
      />
      </View>
      <View style={styles.buttonContainer}>
      {/* Button 1 */}
      <TouchableOpacity style={{ ...styles.nextButton, backgroundColor: '#DA5E4214'}} onPress={ () => navigation.goBack()}>
      <Icon name="arrow-back-outline" size={20} color="#000" />
        <Text style={styles.buttonBackText}>Back</Text>
      </TouchableOpacity>

      {/* Button 2 */}
      <TouchableOpacity style={styles.nextButton} onPress={handleFinish} disabled={!firstName || !lastName || !email || !phoneNumber || !mailingAddress}>
        <Text style={styles.buttonText}>Next</Text>
        <Icon name="arrow-forward-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
    </ScrollView>
    {/* </TouchableWithoutFeedback> */}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    marginTop: 50
  },
  containerMain: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: 600,
    color: '#191C1E',
    fontSize: 19,
    fontWeight: 600,
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 400,
    color: '#666',
    marginBottom: 24,
  },
  input: {
    height: 40,
    backgroundColor: '#DA5E4214',
    marginBottom: 12,
    paddingLeft: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'D3D3D3',
    opacity: 0.8
  },
  buttonContainer: {
    flex: 1,
    marginTop: 100,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  nextButton: {
    width: 175,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    backgroundColor: '#DA5E42',
    borderRadius:2
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonBackText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nameField: {
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 7,
    color:'#444749'
  }
});

export default UserInformationScreen;
