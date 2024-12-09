import React, { useEffect } from 'react';
import { PermissionsAndroid, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { Provider } from 'react-redux';
import store from './store/store';
import RootNavigator from './navigation/RootNavigator';

const App = () => {
  useEffect(() => {
    // Request permissions for notifications (Android only)
    const requestPermissions = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permissions granted.');
        } else {
          console.log('Notification permissions denied.');
        }
      } catch (error) {
        console.error('Permission error:', error);
      }
    };

    const setupFCM = async () => {
      // Request FCM permissions
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('FCM Authorization status:', authStatus);

        // Get the FCM token
        const fcmToken = await messaging().getToken();
        console.log('FCM Token:', fcmToken);

        // Save or use the FCM token as needed
        // Example: Send token to your server
      }
    };

    const handleForegroundNotifications = () => {
      // Handle messages when the app is in the foreground
      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        console.log('FCM Message Received in foreground:', remoteMessage);
        Alert.alert('New Notification', remoteMessage.notification?.body || 'You have a new message.');
      });

      return unsubscribe;
    };

    const setupNotificationListeners = () => {
      // Background and terminated state messages
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('FCM Message Received in background:', remoteMessage);
      });

      // Handle notification when the app is opened by tapping on it
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage) {
            console.log('Notification caused app to open from quit state:', remoteMessage);
          }
        });
    };

    // Initialize the FCM setup
    requestPermissions();
    setupFCM();
    setupNotificationListeners();

    // Listen to notifications in the foreground
    const unsubscribeForeground = handleForegroundNotifications();

    // Cleanup listeners
    return () => unsubscribeForeground();
  }, []);

  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
};

export default App;
