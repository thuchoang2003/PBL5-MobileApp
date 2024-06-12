import React, {useEffect, useState} from 'react';
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
  Linking,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SigninImage from '../Assets/Image/imageBookTest2.jpg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {firebaseApp} from '../firebaseConfig';
import {getFirestore, collection, doc, getDoc} from 'firebase/firestore';
import {useSelector} from 'react-redux';
export default function Detail({route, navigation}) {
  const {dataImage} = route.params;
  const firestore = getFirestore(firebaseApp);
  const userData = useSelector(state => state.account.user);
  const [content, setContent] = useState('');
  const [listText, setListText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const handleConfirm = () => {
    const url = `http://${ipAddress.trim()}:8000/index.html`;
    Linking.openURL(url);
    setModalVisible(false);
  };
  const getTextByUid = async uid => {
    try {
      const textDocRef = doc(firestore, 'Text', uid);
      const textDocSnapshot = await getDoc(textDocRef);

      if (!textDocSnapshot.exists()) {
        console.log('Document does not exist.');
        return null;
      }

      const textData = textDocSnapshot.data();
      const nameImage = dataImage.name.split('.')[0];
      setListText(textData);
      setContent(textData[nameImage]);
      // return textData;
    } catch (error) {
      console.error('Error getting text data from Firestore:', error);
      // return null;
    }
  };
  useEffect(() => {
    getTextByUid(userData.uid);
  }, []);

  return (
    <>
      <View>
        {!content && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 300,
            }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
      {content && (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <ScrollView>
            <View style={styles.container}>
              <KeyboardAwareScrollView>
                <View style={styles.viewImg}>
                  <Image src={dataImage.url} style={styles.img}></Image>
                </View>
              </KeyboardAwareScrollView>
            </View>
            <View style={styles.formAction}>
              <TouchableOpacity>
                <View style={styles.btn}>
                  <Text
                    style={styles.btnText}
                    onPress={() =>
                      navigation.navigate('audio', {
                        content: content,
                        dataImage: dataImage,
                        listText: listText,
                      })
                    }>
                    Lắng nghe
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.translate}>
              <Text style={styles.title}>Văn bản nhận diện:</Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  textAlign: 'justify',
                  color: 'black',
                }}>
                {content}
              </Text>
            </View>
          </ScrollView>
          <View style={styles.navbarBottom}>
            <TouchableOpacity style={styles.itemNavbar}>
              <Ionicons
                name="home-outline"
                size={25}
                color="black"
                onPress={() => {
                  navigation.navigate('homepage');
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.itemNavbar}>
              <Ionicons
                name="camera-outline"
                size={25}
                color="black"
                onPress={() => setModalVisible(!modalVisible)}
              />

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 20,
                      borderRadius: 10,
                      width: '80%',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                      }}>
                      Nhập địa chỉ IP của trang web?
                    </Text>
                    <TextInput
                      style={{
                        height: 40,
                        borderColor: 'gray',
                        borderWidth: 1,
                        marginBottom: 10,
                        color: 'black',
                      }}
                      onChangeText={text => setIpAddress(text)}
                      value={ipAddress}
                      placeholder="Nhập địa chỉ IP"
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 20,
                      }}>
                      <TouchableOpacity onPress={handleConfirm}>
                        <Text
                          style={{
                            color: 'black',
                          }}>
                          Confirm
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text
                          style={{
                            color: 'black',
                          }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.itemNavbar}
              onPress={() => {
                navigation.navigate('Profile');
              }}>
              <Ionicons name="person-outline" size={25} color="black" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  viewImg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  img: {
    // width: 310,
    // height: 330,
    width: 380,
    height: 300,
    borderRadius: 15,
  },
  formAction: {
    paddingHorizontal: 60,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#4838D1',
    borderColor: '#4838D1',
  },
  btnText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  translate: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: 'black',
  },
  navbarBottom: {
    paddingHorizontal: 48,
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: -10,
    // position: 'relative',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 40, // Chiều cao của footer
    // backgroundColor: 'lightblue',
    backgroundColor: '#f6f7fb',
    borderStyle: 'solid',
    borderTopWidth: 1, // Độ dày của đường viền trên
    borderTopColor: '#cccc', // Màu sắc của đường viền trên
  },
});
