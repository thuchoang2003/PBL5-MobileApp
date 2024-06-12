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
  Linking,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SigninImage from '../Assets/Image/imageBookTest2.jpg';
import MyTabs from './Tab_bottom';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {firebaseApp} from '../firebaseConfig'; // Adjust the path based on your project structure
import {getStorage, ref, listAll, getDownloadURL} from 'firebase/storage';
import {Dropdown} from 'react-native-element-dropdown';
import {getMetadata} from 'firebase/storage';
export default function Homepage({navigation}) {
  const userData = useSelector(state => state.account.user);
  const uid = userData.uid;

  //image to render
  const [listImage, setListImage] = useState([]);
  const storage = getStorage(firebaseApp);

  //image all
  const [allImage, setAllImage] = useState();

  const getImagesByUid = async uid => {
    try {
      const imagesRef = ref(storage, `${uid}`);
      const imageList = await listAll(imagesRef);

      const imageUrls = await Promise.all(
        imageList.items.map(async imageRef => {
          const url = await getDownloadURL(imageRef);
          const metadata = await getMetadata(imageRef);
          return {
            url: url,
            name: metadata.name,
            createdDate: metadata.timeCreated,
          };
        }),
      );
      setListImage(imageUrls);
      setAllImage(imageUrls);
    } catch (error) {
      console.error('Error getting images from Firebase Storage:', error);
      return [];
    }
  };

  //Dropdown
  const dataDropDown = [
    {label: 'Hôm nay', value: 'today'},
    {label: 'Hôm qua', value: 'yesterday'},
    {label: 'Tuần này', value: 'onweek'},
    {label: 'Tuần trước', value: 'lastweek'},
    {label: 'Tháng này', value: 'onmonth'},
    {label: 'Tháng trước', value: 'lastmonth'},
    {label: 'Tất cả', value: 'all'},
  ];
  const [value, setValue] = useState(null);
  const handleChangeOption = async item => {
    setValue(item.value); // Cập nhật giá trị đã chọn
    // Nếu người dùng chọn 'Tất cả', hiển thị tất cả các ảnh

    const imagesRef = ref(storage, `${uid}`);
    const imageList = await listAll(imagesRef);

    const imageUrls = await Promise.all(
      imageList.items.map(async imageRef => {
        const url = await getDownloadURL(imageRef);
        const metadata = await getMetadata(imageRef);
        return {
          url: url,
          name: metadata.name,
          createdDate: metadata.timeCreated,
        };
      }),
    );

    if (item.value === 'all') {
      setListImage(imageUrls);
      return;
    }

    // Lọc danh sách ảnh theo mốc thời gian đã chọn
    const filteredImages = imageUrls.filter(image => {
      const createdDate = new Date(image.createdDate);
      const currentDate = new Date();

      switch (item.value) {
        case 'today':
          return (
            createdDate.getDate() === currentDate.getDate() &&
            createdDate.getMonth() === currentDate.getMonth() &&
            createdDate.getFullYear() === currentDate.getFullYear()
          );
        case 'yesterday':
          const yesterday = new Date();
          yesterday.setDate(currentDate.getDate() - 1);
          return (
            createdDate.getDate() === yesterday.getDate() &&
            createdDate.getMonth() === yesterday.getMonth() &&
            createdDate.getFullYear() === yesterday.getFullYear()
          );
        case 'onweek':
          const firstDayOfWeek = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - currentDate.getDay() + 1,
          );
          const lastDayOfWeek = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + (7 - currentDate.getDay()),
          );
          return createdDate >= firstDayOfWeek && createdDate <= lastDayOfWeek;
        case 'lastweek':
          const firstDayOfLastWeek = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - currentDate.getDay() - 6,
          );
          const lastDayOfLastWeek = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - currentDate.getDay(),
          );
          return (
            createdDate >= firstDayOfLastWeek &&
            createdDate <= lastDayOfLastWeek
          );
        case 'onmonth':
          return (
            createdDate.getMonth() === currentDate.getMonth() &&
            createdDate.getFullYear() === currentDate.getFullYear()
          );
        case 'lastmonth':
          const firstDayOfLastMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
            1,
          );
          const lastDayOfLastMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            0,
          );
          return (
            createdDate >= firstDayOfLastMonth &&
            createdDate <= lastDayOfLastMonth
          );
        default:
          return false;
      }
    });

    // Cập nhật danh sách ảnh hiển thị trên giao diện
    setListImage(filteredImages);
  };

  useEffect(() => {
    getImagesByUid(uid);
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const handleConfirm = () => {
    const url = `http://${ipAddress.trim()}:8000/index.html`;
    Linking.openURL(url);
    setModalVisible(false);
  };

  function convertISOToFormattedDate(isoString) {
    // Tạo một đối tượng Date từ chuỗi ISO
    const dateObj = new Date(isoString);

    // Lấy thông tin thời gian
    const hours = dateObj.getUTCHours().toString().padStart(2, '0');
    const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getUTCSeconds().toString().padStart(2, '0');

    // Lấy thông tin ngày tháng năm
    const day = dateObj.getUTCDate().toString().padStart(2, '0');
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
    const year = dateObj.getUTCFullYear();

    // Kết hợp thành chuỗi kết quả
    const formattedDate = `${hours}:${minutes}:${seconds}-${day}/${month}/${year}`;

    return formattedDate;
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={dataDropDown}
            itemTextStyle={styles.itemTextStyle}
            // search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Tất cả"
            searchPlaceholder="Search..."
            value={value}
            onChange={item => {
              handleChangeOption(item);
            }}
          />
          <Text style={styles.title}>Gần đây:</Text>
        </KeyboardAwareScrollView>
      </View>
      <ScrollView>
        <View style={styles.divImage}>
          {listImage &&
            listImage.length > 0 &&
            listImage.map((item, index) => {
              return (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    navigation.navigate('detail', {
                      dataImage: item,
                      listFullImage: allImage,
                    });
                  }}
                  key={`image-${index}`}>
                  <Image src={item.url} style={styles.itemImage} />
                  <View
                    style={{
                      backgroundColor: 'white',
                      width: '100%',
                      display: 'flex',
                      paddingTop: 5,
                      paddingBottom: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontWeight: '700',
                      }}>
                      {item.name}
                      {/* ({convertISOToFormattedDate(item.createdDate)}) */}
                      {/* {item.name}({item.createdDate}) */}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
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
  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D2A32',
    marginLeft: 10,
  },
  divImage: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 20,
    // width: '100%',
    // height: '100%',
    width: 400,
    height: '100%',
    paddingLeft: 5,
    paddingBottom: 50,
  },
  // item: {
  //   flex: 1, // This also allows wrapping
  //   flexBasis: 100,
  //   // Adjust as needed
  // },
  itemImage: {
    width: 380,
    height: 300,
    resizeMode: 'stretch',
    borderRadius: 10,
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
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    color: 'black',
  },
  icon: {
    marginRight: 5,
    color: 'black',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'black',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
    // color: 'black',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
  itemTextStyle: {
    fontSize: 16,
    color: 'black',
  },
});
