import React, {useState} from 'react';
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SigninImage from '../Assets/Image/SignIn.2.png';
import logo from '../Assets/Image/logo.png';
import {createNewUser} from './authentication.js';
export default function SignupComponents({navigation}) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleClickSignUp = async () => {
    console.log('Form Data:', form);
    await createNewUser(form, navigation);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Image
              alt="App Logo"
              resizeMode="contain"
              style={styles.headerImg}
              source={logo}
            />

            <Text style={styles.title}>
              Sign up to <Text style={{color: '#4838D1'}}>MyApp</Text>
            </Text>

            <Text style={styles.subtitle}>
              The App is an assistant that helps blind people can read a book by
              audio
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email address</Text>

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={email => setForm({...form, email})}
                placeholder="nguyenthuchoang@gmail.com"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.email}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>

              <TextInput
                autoCorrect={false}
                onChangeText={password => setForm({...form, password})}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.password}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Confirm Password:</Text>

              <TextInput
                autoCorrect={false}
                onChangeText={confirmPassword =>
                  setForm({...form, confirmPassword})
                }
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.confirmPassword}
              />
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity>
                <View style={styles.btn}>
                  <Text
                    style={styles.btnText}
                    onPress={() => handleClickSignUp()}>
                    Sign up
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* <Text style={styles.formLink}>Forgot password?</Text> */}
          </View>
        </KeyboardAwareScrollView>

        <TouchableOpacity
          onPress={() => {
            // handle link
          }}
          style={{marginTop: 'auto'}}>
          <Text style={styles.formFooter}>
            Have an account?{' '}
            <Text
              style={{textDecorationLine: 'underline'}}
              onPress={() => {
                // handle onPress
                navigation.navigate('login');
              }}>
              Sign in
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    padding: '2px 5px',
    textAlign: 'center',
  },
  /** Header */
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  headerImg: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 12,
  },
  /** Form */
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075eec',
    textAlign: 'center',
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#4838D1',
    borderColor: '#4838D1',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});
