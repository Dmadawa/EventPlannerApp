import React, { useEffect } from 'react';
import { PermissionsAndroid, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { Provider } from 'react-redux';
import store from './store/store';
import RootNavigator from './navigation/RootNavigator';
import { LogBox } from 'react-native';

// Ignore all logs
LogBox.ignoreAllLogs(true); // Set to false to re-enable

const App = () => {
  useEffect(() => {
    const requestFCMPermissions = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'You need to enable notifications.');
      }

      const authStatus = await messaging().requestPermission();
      const isAuthorized =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (isAuthorized) {
        console.log('FCM Permissions Granted:', authStatus);
        await messaging().subscribeToTopic('all'); // Subscribe to topic "all"
        console.log('Subscribed to FCM topic: all');
      }
    };

    requestFCMPermissions();

    // Listen for notifications
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert(
        'Notification Received',
        remoteMessage.notification.body
      );
    });

    return unsubscribe; // Cleanup listener
  }, []);

  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
};

export default App;
