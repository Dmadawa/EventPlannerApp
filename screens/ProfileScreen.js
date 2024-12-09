import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true); // For showing a loading indicator
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mailingAddress, setMailingAddress] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  // Function to fetch user data from Firestore
  const fetchUserData = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        // Fetch user data from Firestore
        const userDoc = await firestore().collection('users').doc(user.uid).get();

        if (userDoc.exists) {
          const data = userDoc.data();
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setEmail(data.email || '');
          setPhoneNumber(data.phoneNumber || '');
          setMailingAddress(data.mailingAddress || '');
          setPhotoURL(data.profileImage || '');
        } else {
          console.log('User document not found');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  // Fetch user data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchUserData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoURL || 'https://via.placeholder.com/100' }} style={styles.profileImage} />
      <View style={{ marginTop: 25 }}>
      <Text style={styles.nameField}>First Name</Text>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={{...styles.input, backgroundColor: '#D3D3D3' }}
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
        style={styles.input}
        editable={false} // Email is non-editable
      />
      <Text style={styles.nameField}>Phone Number</Text>
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
      />
      <Text style={styles.nameField}>Mailing Address</Text>
      <View style={styles.mailingContainer}>
        <TextInput
          placeholder="Mailing Address"
          value={mailingAddress}
          onChangeText={setMailingAddress}
          style={[styles.input, styles.mailingAddress]}
        />
      </View>
</View>
{/* Save Button */}
<TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('Edit')}
      >
            <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    marginRight: 8,
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
  mailingContainer: {
    marginBottom: 12,
  },
  nameField: {
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 7,
    color:'#444749'
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DA5E42',
    height:44,
    borderRadius:2,
    marginTop: 25,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 16
  }
});

export default ProfileScreen;
