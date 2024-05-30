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
  Modal,
} from 'react-native';
import logo from '../Assets/Image/logo.png';
import {firebaseApp} from '../firebaseConfig';
import {getDatabase, ref, get, onValue} from 'firebase/database';
const Camera = () => {
  const [image, setImage] = useState();
  let unsubscribe = null;
  const fetchImages = async () => {
    try {
      const db = getDatabase(firebaseApp);
      const reference = ref(db, '/FuGXoCCnDzUpT9SFoj7dxtmmkab2');

      unsubscribe = onValue(reference, snapshot => {
        if (snapshot.exists()) {
          // Kiểm tra xem snapshot có tồn tại không
          const data = snapshot.val();
          setImage(data.image);
        } else {
          setImage(null); // Set image thành null khi không có dữ liệu trên Firebase
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchImages();
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Hủy đăng ký sự kiện onChange
      }
    };
  }, []);

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.container}>
          <View style={styles.imageViewContainer}>
            <Image
              source={{uri: image ? `data:image/jpeg;base64,${image}` : ''}}
              style={styles.imageView}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewContainer: {
    borderWidth: 2, // Kích thước của border
    borderColor: 'red', // Màu sắc của border
    borderRadius: 8, // Độ cong của góc border
    padding: 4, // Padding để tạo khoảng cách giữa border và hình ảnh
  },
  imageView: {
    // flex: 1,
    // resizeMode: 'cover',
    // objectFit: 'center',

    width: 350, // Chiều rộng của hình ảnh
    height: 650, // Chiều cao của hình ảnh
    resizeMode: 'contain', // Đảm bảo hình ảnh không bị kéo dãn, giữ tỉ lệ gốc
  },
});
export default Camera;
