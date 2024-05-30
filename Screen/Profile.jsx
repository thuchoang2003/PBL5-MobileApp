import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  MyAppText,
  ScrollView,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SigninImage from '../Assets/Image/logo.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {handleLogout} from './authentication.js';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Profile({navigation}) {
  const userData = useSelector(state => state.account.user);
  const removeUserData = async () => {
    const userData = AsyncStorage.getItem('userData');
    if (userData) {
      await AsyncStorage.removeItem('userData');
    }
  };
  useEffect(() => {
    // do stuff
  }, [userData]);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image style={styles.avatar} source={SigninImage} />
        <View style={styles.information}>
          <View style={styles.username}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.text}>{userData?.fullname}</Text>
          </View>
          <View style={styles.email}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.text}>{userData?.email}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleLogout(navigation);
            removeUserData();
          }}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>Đăng xuất</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    resizeMode: 'contain',
  },
  information: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 10,
    width: '100%',
    // height: 40,
  },
  username: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    width: '100%',
    borderStyle: 'solid',
    borderTopWidth: 1, // Độ dày của đường viền trên
    borderTopColor: '#cccc',
    paddingTop: 15, // Màu sắc của đường viền trên
  },
  email: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    width: '100%',
    borderStyle: 'solid',
    borderTopWidth: 1, // Độ dày của đường viền trên
    borderTopColor: '#cccc',
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1, // Độ dày của đường viền trên
    borderBottomColor: '#cccc', // Màu sắc của đường viền trên
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  text: {
    flex: 3,
    fontSize: 16,
    fontWeight: '500',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    // paddingTop:10,
    padding: 15,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#4838D1',
    width: '80%',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#4838D1',
    textAlign: 'center',
    width: '80%',
    marginRight: 10,
  },
});
