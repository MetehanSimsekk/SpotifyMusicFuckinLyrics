import axios, { AxiosResponse } from 'axios';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SliderPosition from "./SliderMusicLine";
import { useEffect, useState ,useRef,useContext} from 'react';
import { ActivityIndicator,StyleSheet, Text,Button, View ,SafeAreaView,TextInput,FlatList,Alert,Image,AppRegistry,TouchableOpacity,TouchableHighlight,Pressable,Dimensions, PixelRatio } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from "@react-native-community/slider";
import { ArtistNames } from '../Models/artistModel';
import DualSlider from "../Components/SliderEffectsReal";
import _ from 'lodash';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from './HomeScreen';
const Stack = createNativeStackNavigator();
import SpotifyWebApi from 'spotify-web-api-js';
import APIRun from './API';
import { AntDesign } from '@expo/vector-icons';
import FlagButton from './Flag';
import { getLyrics, getSong } from 'genius-lyrics-api';
import { SelectList } from 'react-native-dropdown-select-list'
import { findBestMatch } from 'string-similarity';
import SystranForTranslate from './TranslateAPI/SystranForTranslate';
import axiosInstance from './TokenTimeGoToRefreshToken/RefreshToken';
import { ErrorModel } from './Error/ErrorModel';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LyricsComponent from './lyricsComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LyricsElementModel } from '../Models/lyrics';
import Modal from 'react-native-modal';
import RNRestart from 'react-native-restart';
import {reloadAsync} from 'expo-updates'
import * as Updates from "expo-updates"
import CodePush from 'react-native-code-push';


;
let device_id:any ="";
let access_token:any="";
let apiKeyForSystran:any="";
const imagePause = require('../assets/Pause.png')
const imagePlay = require('../assets/Play.png')
const imageForward = require('../assets/fastforward.png')
const imageBack = require('../assets/backforward.png')
let params:any="";


if(Platform.OS === 'web')
{
 access_token= window.localStorage.getItem("access_token")
device_id  = window.localStorage.getItem("device_id")
params = {
  "device_id": device_id || "" 
 
};
var apiKey  = window.localStorage.getItem("apiKey")
 apiKeyForSystran  = window.localStorage.getItem("apiKeyForSystran")
var apiKeyForTranslate  = window.localStorage.getItem("apiKeyForTranslate")
var baseURL  = window.localStorage.getItem("baseURL")
}
if (Platform.OS === 'ios') {
  AsyncStorage.getItem('access_token')
    .then(token => {
      access_token = token;
      // Diğer işlemler
    })
    .catch(error => {
    

      console.error(error);
      // Hata yönetimi
    });

  AsyncStorage.getItem('device_id')
    .then(id => {
      device_id = id;

       params = {
        "device_id": device_id 
       
      };
      // Diğer işlemler
    })
    .catch(error => {

      console.error(error);
    });

  AsyncStorage.getItem('apiKeyForSystran')
    .then(apiKey => {
      apiKeyForSystran = apiKey;
      // Diğer işlemler
    })
    .catch(error => {
     console.error(error);
    });
    params = {
      "device_id": device_id || "" 
     
    };
}
if (Platform.OS === 'android') {
  AsyncStorage.getItem('access_token')
    .then(token => {
      access_token = token;
      // Diğer işlemler
    })
    .catch(error => {
    

      console.error(error);
      // Hata yönetimi
    });

  AsyncStorage.getItem('device_id')
    .then(id => {
      device_id = id;

       params = {
        "device_id": device_id 
       
      };
      // Diğer işlemler
    })
    .catch(error => {

      console.error(error);
    });

  AsyncStorage.getItem('apiKeyForSystran')
    .then(apiKey => {
      apiKeyForSystran = apiKey;
      // Diğer işlemler
    })
    .catch(error => {
     console.error(error);
    });
    params = {
      "device_id": device_id || "" 
     
    };
}
const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(access_token);

//NOT : Şarkıya tıklanıldığında şarkının açılması


// PUT isteği için gönderilecek parametreler

 

  const OpenMusicSelect = ({ route,navigation}:{route:any,navigation:any}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [playlist, setPlaylist] = useState<ArtistNames[]>([]);
    // const [currentPosition, setCurrentPosition] = useState(0);
    const [position, setPosition] = useState(0);
    const [durationFullTimeOfSong, setDuration] = useState(0);
    const [intervalId, setIntervalId] = useState<any>(null);
    const [clickCount, setClickCount] = useState(0); 
    const clickTimeout = useRef(null);
    const [artist, setArtist] = useState("");
    const [track, setTrack] = useState("");
    const [performedBy, setPerformedBy] = useState('');
    const [producedBy, setProducedBy] = useState('');

    
    const [lyrics, setLyrics] = useState("");
    const [TranslateOflyrics, setTranslateOfLyrics] = useState('');
    const [itemIdCrr, setitemIdWithCurrPlaying] = useState('');
    const [itemIdOpen, setitemIdWithOpenSong] = useState('');
    const [isFirstTime, setisFirstTime] = useState(true);
    const [renderTrigger, setRenderTrigger] = useState(false);
    const [LanguageSelect, setLanguageSelect] = useState("");
    const [DefaultLyrics, setDefaultLyrics] = useState(false);
    const [isLyricsFetched, setIsLyricsFetched] = useState(false);
    const [isFirstButtonEnabled, setIsFirstButtonEnabled] = useState(false);
    const [isSecondButtonEnabled, setIsSecondButtonEnabled] = useState(true);
    let [remainingTime, setRemainingTime] = useState(0);  
    const [currentPosition, setCurrentPosition] = useState(0);
    const[TrackText,setTrackText] = useState('')
    const[ArtistText,setArtistText] = useState('')
    const [selectedValue, setSelectedValue] = useState(0);
    const [isLyricsVisible, setIsLyricsVisible] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const sourceRef = useRef({
      token: null,
    });
  
    const handlePressSecondButton = () => {
      setIsFirstButtonEnabled(true);
      setIsSecondButtonEnabled(false);
    };



    const handlePositionChanged = (position: number) => {
     setCurrentPosition(position)
    
    };

  
    const play = () => {
      
        handlePositionChanged(currentPosition);
   
        HandleOpenSong(playlist[0], currentPosition); //İlk defa oynatılıyorsa, position değeri ile çağırın.
       
        setIsPlaying(true);   
        
 
    
  }
    const pause = () => {
      PauseMusic();
     setIsPlaying(false);
     clearInterval(intervalId);
     currentlyPlayingGetPosition()
    //  setIntervalId(null);
    };

   
    async function skipToNextTrack() {
      setCurrentPosition(0);
      setIsPlaying(true);
    
      // Increment the index for the next song
      const nextIndex = route.params.index + 1;
    
      if (nextIndex < route.params.DataItems.length) {
        // Kullanılmadan önce index'i artır
        route.params.index++;
    
        const nextTrackId = route.params.DataItems[nextIndex].track.id;
    
        await GetTrackData(nextTrackId);
  
        setRenderTrigger(!renderTrigger);
      }
      // setIsLyricsFetched(false)
    }
  

    async function skipToPreviousTrack() {
      if (route.params.index >= 0) {
      
        setIsLyricsFetched(false);
        const prevIndex = route.params.index!=0 ? route.params.index - 1: route.params.index;
        const prevTrackId = route.params.DataItems[prevIndex].track.id;
    
        await GetTrackData(prevTrackId);
        setRenderTrigger(!renderTrigger);
    
        route.params.index = prevIndex;
      }
    }
    
    const currentlyPlayingGetPosition = async () => {
      try {
        const result = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            'Authorization': 'Bearer ' + access_token
          }
        });
        const positionMs = result.data.progress_ms;

        const tracksDurationMS = result.data.item.duration_ms;


       const itemId = result.data.item.id
      setCurrentPosition(positionMs);





      } catch (error) {
        console.error(error);
        throw error;
      }
    };


    
 
  
     const  HandleOpenSong = async(Track: any,SongPos:number) => {
      await startMusic(Track,SongPos);

    


    };


    const startMusic = async(Track: any,SongPos:number)=>
    {
  
      // alert(route.params.PathURis[0])

      const data = {
        //Burayı kontrol et çok gazla kayıt geliyor PathURis hatalı kod
        uris:["spotify:track:"+Track.id],
          offset: {
            position: 0,
          },
          position_ms: SongPos
        };
        axios
          .put(
            'https://api.spotify.com/v1/me/player/play',
            data,
            {
              headers: {
                Authorization: "Bearer " + access_token,
                "Content-Type": "application/json",
              },
              params: {
                params
              }
            }
          )
          .then((response) => {
       
          })
          .catch((error:any) => {
                     
            if (error.response.status === 404) {
              Alert.alert(
                  "Uyarı",
                  "Lütfen Spotify Mobil Uygulamanızdan herhangi bir şarkıyı açın ve tekrar deneyin.",
                  [
                      {
                          text: "Tamam",
                          onPress: () => Updates.reloadAsync()
                      },
                     
                  ]
              );
          }
            else{
             
              axiosInstance.get("");
              
            }
          });
    } 
    const PauseMusic = async ()=>
{
  try {
    await axios.put(
      'https://api.spotify.com/v1/me/player/pause',
      {},
      {
        headers: {
          Authorization: "Bearer " + access_token,
          'Content-Type': 'application/json',
        },
      }
    );
   
  } catch (error) {
    console.error('Hata: OpenMusic Component içerisinde alınan hata', error);
  

  }
}



const GetTrackData = async (trackId: string) => {
  try {
    const trackIdOnSpotify = trackId === "" ? route.params.track : trackId;
    

   
    const result = await axios.get(
      `https://api.spotify.com/v1/tracks/${trackIdOnSpotify}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
       
      }
    );

  

    HandleOpenSong(result.data, 0);  
    setTrackText(result.data.name);
    setDefaultLyrics(true)
    setIsLyricsFetched(false);
    setPlaylist([result.data]);
    setDuration(result.data.duration_ms);
    setitemIdWithOpenSong(result.data.id);
    setIsPlaying(true);
    setCurrentPosition(0);
    setArtistText(result.data.artists[0].name);
  }  catch (error) {
    console.log("An error occurred while fetching the playlist:", error);
    if (Platform.OS === "web") {
      window.localStorage.setItem("access_token", "");
    } else if (Platform.OS === "ios") {
      AsyncStorage.setItem("access_token", "");
    }
    axiosInstance.get("");
  }
};
  
       
        
        

const handleOpenSongForTimeWithSwitch = async () => {
  
  try {
    setPosition(position);
     await axios({
      method: 'PUT',
      url: `https://api.spotify.com/v1/me/player/seek?position_ms=${position}`,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    

   
   
  } catch (error) {
    console.error(error);
   
    throw error;
  }
  // AsyncPlay();
};


async function HandleOpenSongForZeroTime(newValue:boolean) {
  setIsFirstButtonEnabled(false);
  try {
    const response = await axios({
      method: 'PUT',
      url: `https://api.spotify.com/v1/me/player/seek?position_ms=0`,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
 

const handleDisableButton = () => {

  setIsFirstButtonEnabled(false);
};
// //NOT PREMIUM
// const getLyricsFormat = async () => {
//   try {
//     const response = await axios.get(`https://api.musixmatch.com/ws/1.1/track.lyrics.get`, {
//       params: {
//         track_id: trackId,
//         apikey: apiKey,
//       },
//     });
//     const fullLyrics = response.data.message.body.lyrics.lyrics_body;
//     const cutOffIndex = fullLyrics.indexOf('...');
   
//     if (cutOffIndex !== -1) {
//       setLyrics(fullLyrics.slice(0, cutOffIndex));

//     } else {
//       setLyrics(fullLyrics);


//     }
//   } catch (error) {
//     console.error(error);
//   }
// };



     useEffect(() => {
  
       
       GetTrackData("");
       
    }, []);


    useEffect(() => {

      if (ArtistText) {
       
      
        getLyricsMethod();
      }
    }, [ArtistText]);

    useEffect(() => {
      // Component mount olduğunda verileri çek
      getTrackDataCreditsInfo();
    }, [ArtistText]);
    const getLyricsMethod =()=>{


     
      const options = {
        apiKey: 'KqyQaD95PrHTv3v8Uz5Io-wSdBnC9pbMEz5eKHcYm6FTeW4VJYZv3gnn0txOPsrB',
        title: TrackText ,
        artist: ArtistText ,
        optimizeQuery: true
      };
      
      if (!isLyricsFetched) {
      
       
        getLyrics(options)
          
         .then((lyrics: any) => {
        
           if (lyrics!=null) { // lyrics değeri null değilse replace metodunu çağır
   
      
            
             const lyricsWithoutBrackets = lyrics.replace(/\[[^\]]*\]/g, '')           
            
             setLyrics(lyricsWithoutBrackets);
            }             
            else {
              setLyrics("");
            }
         
          });
     }
    } 
    
////////////////////Düzenelecenk aşağısı
const getTrackDataCreditsInfo = async () => {
  
  try {
    

    const options = {
      apiKey: 'KqyQaD95PrHTv3v8Uz5Io-wSdBnC9pbMEz5eKHcYm6FTeW4VJYZv3gnn0txOPsrB',
      title: TrackText,
      artist: ArtistText,
      optimizeQuery: true,
    };

    const id = await getSong(options);
    const apiKey = 'KqyQaD95PrHTv3v8Uz5Io-wSdBnC9pbMEz5eKHcYm6FTeW4VJYZv3gnn0txOPsrB';
    const songId = id.id;

    const apiUrl = `https://api.genius.com/songs/${songId}?access_token=${apiKey}`;

    const response = await axios.get(apiUrl);
    const songInfo = response.data.response.song;

    // İlgili bilgileri çıkarma
    const performedBy = songInfo.writer_artists.map((artist: { name: any; }) => artist.name).join(', ');
    setPerformedBy(performedBy)
    const producedBy = songInfo.producer_artists.map((artist:{name:any;})=>artist.name).join(',')
    setProducedBy(producedBy)
  } catch (error) {
    
  }
};
    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };

const DualSliders=()=>
{
  setIsFirstButtonEnabled(true)
}

    const RenderItem = ({ item, index }: { item: any; index: number }) => {

      return (
       
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>


     
      
            <Image
              style={{ width: 550, height: 300 ,resizeMode:'contain'}}
              source={{
                uri: item.album.images[index].url, //Array görüntü kalitesini ayarlıyor 0>1>2
              }}
            />
      
     
        </View>

      );
    };
    const scaleFontSize = (fontSize:any) => {
      const ratio = PixelRatio.getFontScale();
      return Math.round(fontSize * ratio);
    };
    return (
      
      <View>
        <LinearGradient
          // Linear Gradient içeriği
          colors={['black']}
          style={{ backgroundColor: "orange", zIndex: -999999999999999999, height: 920 }}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
        >
          <FlatList scrollEnabled={false} data={playlist} renderItem={RenderItem} style={{ top: 180 }} />
          {!isFirstButtonEnabled ? (
            <View style={styles.container}>
              <Text style={styles.trackTextStyle}>{TrackText}</Text>
              <Text style={styles.artistTextStyle}>{ArtistText}</Text>
              <SliderPosition
                isPlaying={isPlaying}
                DefaultLyrics={true}
                Duration={durationFullTimeOfSong}
                
                HandleOpenSongForZeroTime={HandleOpenSongForZeroTime}
                itemIdOpen={itemIdOpen}
                isFirstTime={isFirstTime}
                renderTrigger={renderTrigger}
                skipToNextTrack={skipToNextTrack}
                lyrics={lyrics}
                // onPositionChanged={handlePositionChanged}
                onSkipToNextTrack ={true}
              />
            
              <View style={styles.containerMusicButton}>
                <TouchableOpacity onPress={()=>toggleModal()}>
                  <Icon name="sliders" size={30} color="orange" />
                </TouchableOpacity>
                <TouchableOpacity  onPress={skipToPreviousTrack} style={styles.SkipTrack}>
               
                  <Ionicons style={[styles.image, { marginLeft: 8 }]} name="play-skip-back-outline" size={42} color="orange" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    if (isPlaying) {
                      pause();
                    } else {
                      play();
                    }
                  }}
                  style={[styles.buttonPlayPause, { margin: 10 }]}
                >
                  <Text>
                    {isPlaying ? (
                      <Ionicons style={styles.imagePlay} name="pause-circle" size={80} color="orange" />
                    ) : (
                      <Ionicons style={styles.image} name="play-circle" size={80} color="orange" /> 
                    )}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={skipToNextTrack} style={styles.SkipTrack}>
                  <Ionicons style={styles.image} name="play-skip-forward-outline" size={42} color="orange" />
                  </TouchableOpacity>
                <TouchableOpacity onPress={ DualSliders }>
                  <Icon name="sliders" size={30} color="orange" />                  
                </TouchableOpacity>
              </View>
              {/* Diğer içerik */}
              <Modal animationIn="flash" animationOut="slideOutDown" animationOutTiming={700} isVisible={isModalVisible}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
          <Text>
            <Icon style={{position:'absolute'}} name="close" size={45} color="orange" />
          </Text>
        </TouchableOpacity>
        <View style={styles.modalContent}>
        <Text style={[styles.title, styles.orangeText]}>Produced By</Text>
        <Text numberOfLines={2} ellipsizeMode="clip"  style={[styles.text, styles.hipFont ]}>{producedBy}</Text>

      
          <Text style={[styles.title, styles.orangeText]}>Performed By</Text>
          <Text numberOfLines={4} ellipsizeMode="clip"  style={[styles.text, styles.hipFont]}>{performedBy}</Text>
        </View>
      </View>
    </Modal>
            </View>
          ) : (
            ""
          )}
          {isFirstButtonEnabled ? (
            <TouchableOpacity style={{ marginVertical: 70 }}>
              <DualSlider artist={ArtistText} track={TrackText} Duration={durationFullTimeOfSong}  onClosePressed={handleDisableButton}/>
             
            </TouchableOpacity>
          ) : (
            ""
          )}

          
        </LinearGradient>
        
      </View>
   
    
    );
  };
  const { width, height } = Dimensions.get('window');
  
  const styles = StyleSheet.create({
    container :{
      position: "relative",
     
    },
   
    containerMusicButton :{
      marginTop:20,
      flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
   
    },
    circleButton: {
      width: 70,
      height: 70,
      borderRadius: 25,
      backgroundColor: 'orange',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal:160,
      marginBottom:60
    },
    button: {
      padding: 10,
    },
    SkipTrack:{
     
        margin: 18,
        
    },
    buttonPlayPause: {
      margin: 10,
    },
   
  
    imagePlay:{
      width:  65, 
      height: 65
    },
    image:{
      width:  50, 
      height: 50
    },
    trackTextStyle : {
      top:200,
      justifyContent:'center',
      zIndex:99999999,
      fontSize: 18,
      fontFamily:'Avenir-Heavy',
      textAlign: 'center',
      color:'orange'
    },
    artistTextStyle:{
      top:200,
      color:'orange',
      justifyContent:'center',
      zIndex:99999999,
      fontSize: 17,
      fontFamily:'Avenir-Light',
      textAlign: 'center'
    },
    linearGradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
   
    modalContainer: {
      flex: 1,
     
      justifyContent: 'center', // Ekranın dikey ortasına yerleştir
      alignItems: 'center', // Ekranın yatay ortasına yerleştir
      backgroundColor: 'rgba(0, 0, 0, 0)', 
      bottom:70,
    },
    modalContent: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: 20,
      borderRadius: 10,
      width: width * 0.76, // Ekran genişliğinin 0.8'i kadar genişlik
      height: height * 0.3,
      position: 'relative',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    text: {
      fontSize: width *0.044,
      marginBottom: 15,
     lineHeight:width * 0.066
    },
    orangeText: {
      color: 'orange',
    },
    hipFont: {
      fontFamily: 'AlNile-Bold', // Özel bir font ekleyin
      color: 'white',
    },
    closeButton: {
   
   zIndex:1,
     top: 25,
     left: 145,
    
    },
  });
 
  export default OpenMusicSelect;
 