import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileImageUploadScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);

  const handleImageUpload = () => {
    // Open the image picker
    launchImageLibrary(
      {
        mediaType: 'photo', // Specify media type (photo or video)
        includeBase64: false, // Set to true if you need base64 image
        maxWidth: 300, // Resize the image to a maximum width
        maxHeight: 300, // Resize the image to a maximum height
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri); // Save the selected image URI
        }
      }
    );
  };

  const handleImagePick = () => {
    launchImageLibrary({}, (response) => {
      if (response.assets && response.assets[0].uri) {
        setPhotoURL(response.assets[0].uri);
      }
    });
  };

  const handleNext = async () => {
    try {
      const userId = auth().currentUser.uid;

      // Update Firestore with the selected image URI
      await firestore().collection('users').doc(userId).update({
        profileImage: imageUri,
      });

      Alert.alert('Success', 'Profile image uploaded successfully!');
      navigation.navigate('UserInformation');
    } catch (error) {
      console.log('Error updating profile image: ', error);
      Alert.alert('Error', 'Failed to upload profile image.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>You are logged in for the first time and can upload a profile picture</Text>
      
      <TouchableOpacity onPress={handleImageUpload} style={styles.profileImageContainer}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.profileImage} />}
        <Image
        source={require('../assets/images/photo-camera.png')}
        style={styles.image}
      />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={handleNext}
        disabled={!imageUri}
      >
        <Text style={styles.buttonText}>Next</Text>
        <Icon name="arrow-forward-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: 600,
    color: '#191C1E',
    fontSize: 32,
    fontWeight: 600,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  profileImageContainer: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#ccc',
    backgroundColor: '#F1E6E3',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E76F51',
    paddingVertical: 14,
    marginTop: 200,
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
  image: {
    width: 24,
    height: 24,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ProfileImageUploadScreen;
