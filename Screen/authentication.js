import {firebaseApp} from '../firebaseConfig';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  connectAuthEmulator,
  initializeAuth,
} from 'firebase/auth';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

let auth = getAuth(firebaseApp);
const isEmailValid = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const createNewUser = async (form, navigation) => {
  if (!form.email || !form.password || !form.confirmPassword) {
    Alert.alert('Validation Error', 'Please fill in all fields');
    return;
  }

  if (!isEmailValid(form.email)) {
    Alert.alert('Validation Error', 'Please enter a valid email address');
    return;
  }

  if (form.password !== form.confirmPassword) {
    Alert.alert('Validation Error', 'Passwords do not match');
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, form.email, form.password);
    Alert.alert('Sign-up successful!');
    navigation.navigate('login');

    console.log('Sign-up successful!');
  } catch (error) {
    console.error('Sign-up error:', error.message);
    Alert.alert('Sign-up Error', error.message);
  }
};
const handleLogin = async (form, navigation) => {
  if (!form.email || !form.password) {
    Alert.alert('Validation Error', 'Please fill in all fields');
    return;
  }

  if (!isEmailValid(form.email)) {
    Alert.alert('Validation Error', 'Please enter a valid email address');
    return;
  }

  try {
    const response = await signInWithEmailAndPassword(
      auth,
      form.email,
      form.password,
    );

    if (response) {
      Alert.alert('Login successful!');
      navigation.navigate('homepage');
      console.log('Login successful!');
      return response;
    } else return null;
  } catch (error) {
    console.error('Login error:', error.message);
    Alert.alert('Login Error', error.message);
  }
};
const handleLogout = async navigation => {
  try {
    await signOut(auth);
    Alert.alert('Logout successful!');
    // Perform any additional actions after successful logout
    navigation.navigate('login');
    console.log('Logout successful!');
  } catch (error) {
    console.error('Logout error:', error.message);
    Alert.alert('Logout Error', error.message);
  }
};
module.exports = {
  createNewUser,
  handleLogin,
  handleLogout,
};
