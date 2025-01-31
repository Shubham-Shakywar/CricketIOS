/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import Navigation from './src/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Text, View } from 'react-native';

const App = () => {
 
  const [isLoggedIn, setIsLoggedIn] = useState(null); 

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const loginToken = await AsyncStorage.getItem('loginToken');
        console.log('Retrieved token from storage:', loginToken);
        
        if (loginToken) {
          setIsLoggedIn(true);
          await getToken(); // Get FCM token if user is logged in
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Failed to fetch the token from storage', error);
        setIsLoggedIn(false); // Ensure login is prompted if there's an error
      } finally {
        SplashScreen.hide(); // Hide the splash screen after token check
      }
    };
  
    initializeApp();
  }, []);
  

  const getToken = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        console.log('FCM token:', token);
        await AsyncStorage.setItem('fcmToken', token);
      } else {
        console.log('Notification permission not granted');
      }
    } catch (error) {
      console.error('Failed to get FCM token:', error);
    }
  };

  if (isLoggedIn === null) {
   
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <NavigationContainer>
      <Navigation isLoggedIn={isLoggedIn} />
    </NavigationContainer>
  );
};

export default App;

