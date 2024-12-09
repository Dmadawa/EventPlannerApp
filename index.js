/**
 * @format
 */
import 'react-native-reanimated';
import { initializeApp } from '@react-native-firebase/app';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

const firebaseConfig = {
    apiKey: "AIzaSyAS5ycz4PVDs-qPvdFUkFtvT5yT6fWYy60",
    authDomain: "eventplannerapp-681e9.firebaseapp.com",
    projectId: "eventplannerapp-681e9",
    storageBucket: "eventplannerapp-681e9.firebasestorage.app",
    messagingSenderId: "907205114275",
    appId: "1:907205114275:web:d330a7ebf026f23d4e8216",
  };
  
  initializeApp(firebaseConfig);

AppRegistry.registerComponent(appName, () => App);
