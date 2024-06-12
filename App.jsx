/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import LoginComponents from './Screen/LoginComponents.jsx';
import SignupComponents from './Screen/SignupComponents.jsx';
import Homepage from './Screen/Homepage.jsx';
import Detail from './Screen/Detail.jsx';
import Audio from './Screen/Audio.jsx';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Profile from './Screen/Profile.jsx';
import Ionicons from 'react-native-vector-icons/Ionicons';
import store from './redux/store.js';
import {Provider} from 'react-redux';
import {LogBox} from 'react-native';

import TrackPlayer, {
  Capability,
  State,
  RepeatMode,
  useProgress,
  useTrackPlayerEvents,
  usePlaybackState,
} from 'react-native-track-player';
import Camera from './Screen/Camera.jsx';
const Stack = createNativeStackNavigator();

function App() {
  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();
  useEffect(() => {
    const isPlayerInitialized = async () => {
      let isInitialized = false;

      try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
        });

        isInitialized = true;
      } catch (e) {
        console.log(e);
        // Handle errors if needed
      }

      // You can use the value of isInitialized here or set it in state if needed
    };

    isPlayerInitialized();

    // Since we only want this effect to run once, we pass an empty dependency array
  }, []);
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="login" component={LoginComponents} />
          <Stack.Screen name="signup" component={SignupComponents} />
          <Stack.Screen
            name="homepage"
            component={Homepage}
            options={{headerShown: false}}
          />
          <Stack.Screen name="detail" component={Detail} />
          <Stack.Screen name="audio" component={Audio} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Camera" component={Camera} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
