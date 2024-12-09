import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-picker'; // Assuming you're using this package for image picking

const EditProfileScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mailingAddress, setMailingAddress] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
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
        }
      }
    };

    fetchUserData();
  }, []);

  const handleImagePick = () => {
    launchImageLibrary({}, (response) => {
      if (response.assets && response.assets[0].uri) {
        setPhotoURL(response.assets[0].uri);
      }
    });
  };

  const updateProfile = async () => {
    const user = auth().currentUser;
    await firestore().collection('users').doc(user.uid).update({
      firstName,
      lastName,
      phoneNumber,
      mailingAddress,
      profileImage: photoURL,
    });

    // Update Firebase Auth profile
    await user.updateProfile({
      displayName: `${firstName} ${lastName}`,
      photoURL,
    });

    alert('Profile updated successfully!');
    navigation.goBack(); // Navigate back to the Profile screen
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={handleImagePick} style={styles.profileImageContainer}>
        {photoURL ? (
          <Image source={{ uri: photoURL }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imagePlaceholder}>+ Add Photo</Text>
        )}
      </TouchableOpacity>
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
      <TextInput
        placeholder="Mailing Address"
        value={mailingAddress}
        onChangeText={setMailingAddress}
        style={styles.input}
      />
      </View>
{/* Save Button */}
<TouchableOpacity
        style={styles.saveButton}
        onPress={updateProfile}
      >
            <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    marginRight: 8,
  },
  profileImageContainer: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DA5E42',
    height:44,
    borderRadius:2,
    marginTop: 100,
    marginBottom: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  imagePlaceholder: {
    color: '#888',
    fontSize: 16,
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
  nameField: {
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 7,
    color:'#444749'
  },
});

export default EditProfileScreen;
