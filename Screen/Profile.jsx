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
  Dimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SigninImage from '../Assets/Image/logo.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {handleLogout} from './authentication.js';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LineChart} from 'react-native-chart-kit';
import {firebaseApp} from '../firebaseConfig';
import {getStorage, ref, listAll, getDownloadURL} from 'firebase/storage';
import {getMetadata} from 'firebase/storage';
export default function Profile({navigation}) {
  const [userData, setUserData] = useState({});
  const [dataChart, setDataChart] = useState({
    labels: ['February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
  });
  const uid = useSelector(state => state.account.user.uid);
  const removeUserData = async () => {
    const userData = AsyncStorage.getItem('userData');
    if (userData) {
      await AsyncStorage.removeItem('userData');
    }
  };
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setUserData(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error getting user data: ', error);
      }
    };
    getUserData();
  }, []);

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#1E2923',
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(8, 19, 13, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    // yAxisLabel: yValue => `${Math.round(yValue)}`,
    // formatYLabel: yValue => `${Math.max(0, Math.round(yValue))}`,
  };
  const screenWidth = Dimensions.get('window').width;

  const storage = getStorage(firebaseApp);
  const getMonthYear = date => {
    const d = new Date(date);
    return `${d.getMonth() + 1}`; // Format: MM-YYYY
  };
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

      const imagesCount = {};
      imageUrls.forEach(image => {
        const month = getMonthYear(image.createdDate);
        if (imagesCount[month]) {
          imagesCount[month]++;
        } else {
          imagesCount[month] = 1;
        }
      });

      // Prepare data for chart
      const labels = Object.keys(imagesCount);
      console.log(labels);
      let data = [0, 0, 0, 0, 0, 0];
      labels.forEach(label => (data[label - 2] = imagesCount[label]));
      console.log(data);
      setDataChart({
        labels: ['February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            data: data,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            strokeWidth: 2, // optional
          },
        ],
      });
    } catch (error) {
      console.error('Error getting images from Firebase Storage:', error);
      return [];
    }
  };
  useEffect(() => {
    getImagesByUid(uid);
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={styles.shadowContainer}>
          <LineChart
            data={dataChart}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            formatYLabel={yValue => `${Math.round(yValue)}`}
          />
        </View>
        {/* <Image style={styles.avatar} source={SigninImage} /> */}
        {/* <View style={styles.information}>
          <View style={styles.username}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.text}>{userData?.fullname}</Text>
          </View>
          <View style={styles.email}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.text}>{userData?.email}</Text>
          </View>
        </View> */}
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
  shadowContainer: {
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // For Android
    backgroundColor: '#fff', // Required for iOS shadow to be visible
    borderRadius: 16, // Match the borderRadius of the chart
  },
});
