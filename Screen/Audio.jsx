import React, {useEffect, useRef, useState} from 'react';
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
import Slider from '@react-native-community/slider';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TrackPlayer, {
  Capability,
  State,
  RepeatMode,
  useProgress,
  useTrackPlayerEvents,
  usePlaybackState,
  TrackPlayerEvents,
  Event,
} from 'react-native-track-player';
import {play} from 'react-native-track-player/lib/trackPlayer';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {getStorage, ref, listAll, getDownloadURL} from 'firebase/storage';
import {firebaseApp} from '../firebaseConfig';
import {getMetadata} from 'firebase/storage';
import {Dropdown, SelectCountry} from 'react-native-element-dropdown';
export default function Audio({route, navigation}) {
  const [listAudio, setAudioFile] = useState([]);
  const playBackState = usePlaybackState();
  const [indexCurrent, setIndexCurrent] = useState(0);
  const [isMute, setIsMute] = useState(false);
  const {content, dataImage, listFullImage, listText} = route.params;
  const userData = useSelector(state => state.account.user);
  const storage = getStorage(firebaseApp);

  const progress = useProgress();
  const getAudioByUid = async uid => {
    try {
      const audiosRef = ref(storage, `${uid}_Audio`);
      const audioList = await listAll(audiosRef);

      const audioUrls = await Promise.all(
        audioList.items.map(async audioRef => {
          const url = await getDownloadURL(audioRef);
          const metadata = await getMetadata(audioRef);
          return {
            url: url,
            name: metadata.name,
            createdDate: metadata.timeCreated,
          };
        }),
      );
      const dataTmp = audioUrls.map((item, index) => {
        const element = listFullImage.find(
          child => child.name.split('.')[0] === item.name.split('.')[0],
        );
        return {
          url: item.url,
          image: element?.url,
          text: listText[`${item.name.split('.')[0]}`],
        };
      });
      const currentIndex = dataTmp.findIndex(item => {
        return item.image == dataImage?.url && item.text == content;
      });
      setIndexCurrent(currentIndex);
      setAudioFile(dataTmp);
    } catch (error) {
      console.error('Error getting audios from Firebase Storage:', error);
      return [];
    }
  };

  const setupPlayer = async listAudio => {
    try {
      // await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
      await TrackPlayer.reset();
      await TrackPlayer.add(listAudio);
      await TrackPlayer.skip(indexCurrent);
    } catch (e) {
      console.log(e);
    }
  };
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    let position = progress.position;
    let duration = progress.duration;
    // Kiểm tra xem trạng thái phát nhạc đã kết thúc chưa
    if (position >= duration - 1 && position != 0 && duration != 0) {
      console.log('check event');
      console.log('check position', progress.position);
      console.log('check duration', progress.duration);
      if (indexCurrent + 1 <= listAudio.length - 1) {
        setIndexCurrent(indexCurrent + 1);
      }
    }
  });
  useEffect(() => {
    getAudioByUid(userData.uid);
  }, []);

  useEffect(() => {
    if (listAudio.length > 0) {
      setupPlayer(listAudio);
    }
  }, [listAudio]);

  const togglePlayBack = async playBackState => {
    if (
      playBackState.state === State.Paused ||
      playBackState.state === State.Ready ||
      playBackState.state === State.Buffering ||
      playBackState.state === State.Loading
    ) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  };
  const handleClickPrevious = async playBackState => {
    try {
      if (indexCurrent - 1 >= 0) {
        setIndexCurrent(indexCurrent => indexCurrent - 1);
        await TrackPlayer.skipToPrevious();
      }
    } catch (error) {
      console.error('Error skipping to previous track:', error);
    }
  };
  const handleClickNext = async playBackState => {
    try {
      if (indexCurrent + 1 <= listAudio.length - 1) {
        setIndexCurrent(indexCurrent => indexCurrent + 1);
        await TrackPlayer.skipToNext();
      }
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  };
  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds,
    ).padStart(2, '0')}`;
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const handleConfirm = () => {
    const url = `http://${ipAddress.trim()}:8000/index.html`;
    Linking.openURL(url);
    setModalVisible(false);
  };

  return (
    <>
      <View>
        {listAudio.length == 0 && (
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
      {listAudio.length > 0 && (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <ScrollView>
            <View style={styles.container}>
              <KeyboardAwareScrollView>
                <View style={styles.viewImg}>
                  <Image
                    // source={SigninImage}
                    src={listAudio[indexCurrent]?.image}
                    // src={dataImage.url}
                    style={styles.img}></Image>
                </View>
                <View style={styles.viewProgressBar}>
                  <Slider
                    value={progress.position}
                    minimumValue={0}
                    maximumValue={progress.duration}
                    minimumTrackTintColor="#4838D1"
                    maximumTrackTintColor="#4838D1"
                    style={styles.progressBar}
                    thumbTintColor="#4255ff"
                    onValueChange={async value => {
                      await TrackPlayer.seekTo(value);
                    }}
                  />
                </View>
                <View style={styles.viewTimeAudio}>
                  <Text style={styles.viewTimeAudioStart}>
                    {formatTime(progress.position)}
                  </Text>
                  <Text style={styles.viewTimeAudioEnd}>
                    {formatTime(progress.duration)}
                  </Text>
                </View>
                <View style={styles.actionControlAudio}>
                  <TouchableOpacity>
                    {!isMute && (
                      <Ionicons
                        name="volume-medium-outline"
                        size={25}
                        color="black"
                        onPress={() => {
                          TrackPlayer.setVolume(0);
                          setIsMute(true)}}
                      />
                    )}
                    {isMute && (
                      <Ionicons
                        name="volume-mute-outline"
                        size={23}
                        color="black"
                        onPress={() => {
                          TrackPlayer.setVolume(1);
                          setIsMute(false)}}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleClickPrevious(playBackState)}>
                    <Ionicons
                      name="chevron-back-circle-outline"
                      size={40}
                      color="black"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => togglePlayBack(playBackState)}>
                    <Ionicons
                      name={
                        playBackState.state === 'playing'
                          ? 'pause-circle-outline'
                          : 'caret-forward-circle'
                      }
                      size={55}
                      color="#4838D1"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleClickNext(playBackState)}>
                    <Ionicons
                      name="chevron-forward-circle-outline"
                      size={40}
                      color="black"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    {/* <Ionicons
                      name="settings-outline"
                      size={22}
                      color="black"
                      onPress={async () => {
                        await TrackPlayer.setRate(1.2);
                      }}
                    /> */}
                  </TouchableOpacity>
                </View>
                <View style={styles.translate}>
                  <Text style={styles.title}>Văn bản nhận diện:</Text>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 16,
                      fontWeight: 400,
                      textAlign: 'justify',
                    }}>
                    {listAudio[indexCurrent]?.text}
                  </Text>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </ScrollView>
          <View style={styles.navbarBottom}>
            <TouchableOpacity
              style={styles.itemNavbar}
              onPress={() => {
                navigation.navigate('homepage');
              }}>
              <Ionicons name="home-outline" size={25} color="black" />
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
    // width: 370,
    // height: 330,
  },
  img: {
    width: 380,
    height: 300,
    // width: '100%',
    // height: undefined,
    // aspectRatio: 1,
    borderRadius: 15,
  },
  viewProgressBar: {
    paddingHorizontal: 12,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    width: 350,
    height: 40,
    marginTop: 5,
    flexDirection: 'row',
  },
  viewTimeAudio: {
    paddingHorizontal: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewTimeAudioStart: {
    fontWeight: '500',
    color: 'black',
  },
  viewTimeAudioEnd: {
    fontWeight: '500',
    color: 'black',
  },
  actionControlAudio: {
    paddingHorizontal: 24,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    gap: 25,
  },
  translate: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 40,
    color: 'black',
  },
  title: {
    fontSize: 18,
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
