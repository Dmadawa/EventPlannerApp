import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RestorePasswordScreen from '../screens/RestorePasswordScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PostsScreen from '../screens/PostsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CommentsScreen from '../screens/CommentsScreen';
import ProfileImageUploadScreen from '../screens/ProfileImageUploadScreen';
import UserInformationScreen from '../screens/UserInformationScreen';
import { Routes }  from '../navigation/Routes';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Fetch User Data Helper
const useFetchUserData = () => {
  const [userData, setUserData] = useState(null);
  const user = auth().currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) setUserData(userDoc.data());
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchData();
  }, [user]);

  return userData;
};

// Tab Navigator
const Tabs = ({ navigation }) => {
  const userData = useFetchUserData();
  const profileImage = userData?.profileImage || 'https://via.placeholder.com/100';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === 'Home' ? 'home' : 'user';
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { backgroundColor: 'black' },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => navigation.toggleDrawer()}
            >
              <Image source={{ uri: profileImage }} style={styles.profileImageSmall} />
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Custom Drawer Content
const CustomDrawerContent = ({ navigation }) => {
  const userData = useFetchUserData();
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
        <View style={styles.userInfoContainer}>
          <Image
            source={{
              uri: userData?.profileImage || 'https://via.placeholder.com/100',
            }}
            style={styles.profileImage}
          />
          <View style={styles.userInfoText}>
            <Text style={styles.displayName}>{userData?.displayName || 'Guest User'}</Text>
            <Text style={styles.email}>{userData?.email || user?.email}</Text>
          </View>
        </View>
      </View>
      <DrawerItem
        label="Logout"
        icon={() => <FontAwesome name="sign-out" size={20} color="#DB2424" />}
        onPress={handleLogout}
        labelStyle={{ color: '#DB2424' }}
      />
      <View style={{  flex: 2 }}></View>
      <View style={styles.footerLabel}>
        <Text style={styles.footerText}>App Version: 0.0.1</Text>
      </View>
    </DrawerContentScrollView>
  );
};

// Drawer Navigator
const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Drawer.Screen name="Main" component={Tabs} />
  </Drawer.Navigator>
);

// Root Navigator
const RootNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (!user) return setIsAuthenticated(false);

      try {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        setIsOnboardingComplete(userDoc.exists && userDoc.data().hasOnboarded);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name={Routes.LOGIN} component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name={Routes.SIGNUP} component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name={Routes.RESTOREPASSWORDSCREEN} component={RestorePasswordScreen} options={{ headerShown: false }} />
          </>
        ) : isOnboardingComplete ? (
          <>
            <Stack.Screen name={Routes.DRAWER} component={DrawerNavigator} options={{ headerShown: false, title: 'Home' }} />
            <Stack.Screen name={Routes.POSTS} component={PostsScreen} options={{ title: 'Posts' }} />
            <Stack.Screen name={Routes.COMMENTS} component={CommentsScreen} options={{ title: 'Comments' }} />
            <Stack.Screen name={Routes.EDITPROFILE}component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
          </>
        ) : (
          <>
            <Stack.Screen name={Routes.LOGIN} component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name={Routes.RESTOREPASSWORDSCREEN} component={RestorePasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name={Routes.PROFILEIMAGEUPLOAD}
              component={ProfileImageUploadScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={Routes.USERINFORMATION}
              component={UserInformationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name={Routes.SIGNUP} component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name={Routes.DRAWER} component={DrawerNavigator} options={{ headerShown: false, title: 'Home' }} />
            <Stack.Screen name={Routes.POSTS} component={PostsScreen} options={{ title: 'Posts' }} />
            <Stack.Screen name={Routes.COMMENTS} component={CommentsScreen} options={{ title: 'Comments' }} />
            <Stack.Screen name={Routes.EDITPROFILE}component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1 },
  drawerHeader: { marginBottom: 20 },
  userInfoContainer: { flexDirection: 'row', alignItems: 'center' },
  profileImage: { width: 80, height: 80, borderRadius: 40 },
  profileImageSmall: { width: 40, height: 40, borderRadius: 20 },
  userInfoText: { marginLeft: 10 },
  displayName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 14, color: '#666' },
  footerLabel: { alignItems: 'center', paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#ddd' },
  footerText: { fontSize: 14, color: '#666', fontWeight: '600' },
  headerIcon: { paddingLeft: 10, paddingBottom: 16 },
});

export default RootNavigator;
