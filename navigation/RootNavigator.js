import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PostsScreen from '../screens/PostsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CommentsScreen from '../screens/CommentsScreen';
import ProfileImageUploadScreen from '../screens/ProfileImageUploadScreen';
import UserInformationScreen from '../screens/UserInformationScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Tabs (Home and Profile)
const Tabs = ({ navigation }) => {
  const user = auth().currentUser;
  const profileImage = user?.photoURL || 'https://via.placeholder.com/100'; // Default profile image if none is available

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = route.name === 'Home' ? 'home' : 'user';
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: 'black', // Set tab bar background color
        },
        tabBarActiveTintColor: 'white', // Color for active tab icon and text
        tabBarInactiveTintColor: 'gray', // Color for inactive tab icon and text
      })}
    >
      {/* Home Screen: No Header */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false, // Hide header for Home
        }}
      />

      {/* Profile Screen: Show Header with Drawer Icon */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile', // Custom title
          headerLeft: () => (
            <TouchableOpacity
              style={{ paddingLeft: 16 }}
              onPress={() => {
                navigation.toggleDrawer(); // Open/Close the drawer
              }}
            >
              <Image
              source={{ uri: profileImage }}
              style={styles.profileImageSmall}
            />
            </TouchableOpacity>
          ),
          headerLeftContainerStyle: {
            paddingBottom: 16
          },
        }}
      />
    </Tab.Navigator>
  );
};

// Custom Drawer Content
const CustomDrawerContent = ({ navigation }) => {
  const user = auth().currentUser;

  const handleLogout = async () => {
    try {
      await auth().signOut();
      Alert.alert('Success', 'Logged out successfully');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to log out');
    }
  };

  return (
    <DrawerContentScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.drawerHeader}>
        <View style={{ flexDirection: 'row' }}>
        <Image
          source={{
            uri: user?.photoURL || 'https://via.placeholder.com/100',
          }}
          style={styles.profileImage}
        />
        <View style={{ flexDirection: 'coloumn', marginTop: 25, marginLeft: 10 }}>
        <Text style={styles.displayName}>{user?.displayName || 'Guest User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        </View>
        </View>
      </View>
      <DrawerItem
        label="Logout"
        icon={() => <FontAwesome name="sign-out" size={20} color="#DB2424" />}
        onPress={handleLogout}
        labelStyle={{ color: "#DB2424" }}
      />
      <View style={{  flex: 2 }}></View>
      {/* Footer Label*/}
      <View style={styles.footerLabel}>
        <Text style={styles.footerText}>App Version: 0.0.1</Text>
      </View>
    </DrawerContentScrollView>
  );
};

// Drawer Navigator
const DrawerNavigator = () => {
  const user = auth().currentUser;
  const profileImage = user?.photoURL || 'https://via.placeholder.com/100'; // Default profile image

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false, // Disable header for Drawer
      }}
    >
      <Drawer.Screen name="Main" component={Tabs} />
    </Drawer.Navigator>
  );
};

// Root Navigator
const RootNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists && userDoc.data().hasOnboarded) {
            setIsOnboardingComplete(true);
          } else {
            setIsOnboardingComplete(false);
          }
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error fetching user data:', error.message);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          </>
        ) : !isOnboardingComplete ? (
          <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="ProfileImageUpload"
              component={ProfileImageUploadScreen}
              options={{ title: 'Upload Profile Image' }}
            />
            <Stack.Screen
              name="UserInformation"
              component={UserInformationScreen}
              options={{ title: 'User Information' }}
            />
            <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Posts" component={PostsScreen} options={{ title: 'Posts' }} />
            <Stack.Screen name="Comments" component={CommentsScreen} options={{ title: 'Comments' }} />
            <Stack.Screen name="Edit" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1
  },
  drawerHeader: {
    marginBottom: 20
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileImageSmall: {
    width: 40,
    height: 40,
    borderRadius: 20, // Circular icon
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: 14,
    color: '#fff',
  },
  footerLabel: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
});

export default RootNavigator;
