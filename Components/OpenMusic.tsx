import axios, { AxiosResponse } from 'axios';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SliderPosition from "./SliderMusicLine";
import { useEffect, useState ,useRef,useContext} from 'react';
import { StyleSheet, Text,Button, View ,SafeAreaView,TextInput,FlatList,Alert,Image,AppRegistry,TouchableOpacity,TouchableHighlight,Pressable } from 'react-native';
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
    // const [trackId, setTrackId] = useState("");
    const [lyrics, setLyrics] = useState("");
    const [TranslateOflyrics, setTranslateOfLyrics] = useState('');
    const [itemIdCrr, setitemIdWithCurrPlaying] = useState('');
    const [itemIdOpen, setitemIdWithOpenSong] = useState('');
    const [isFirstTime, setisFirstTime] = useState(true);
    const [renderTrigger, setRenderTrigger] = useState(false);
    const [RestartPosition, setRestartPosition] = useState(false);
    const [LanguageSelect, setLanguageSelect] = useState("");
    const [DefaultLyrics, setDefaultLyrics] = useState(false);
    const [isLyricsFetched, setIsLyricsFetched] = useState(false);
    const [isFirstButtonEnabled, setIsFirstButtonEnabled] = useState(false);
    const [isSecondButtonEnabled, setIsSecondButtonEnabled] = useState(true);
    let [remainingTime, setRemainingTime] = useState(0);  
    const [currentPosition, setCurrentPosition] = useState(0);
    const[TrackText,setTrackText] = useState('')
    const[ArtistText,setArtistText] = useState('')

  
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

    function skipToNextTrack() {
      setCurrentPosition(0)
      setDefaultLyrics(true)
     
      // Increment the index for next song
      route.params.index++;     
    
      // Fetch the data for the next song
      GetTrackData();
      setRenderTrigger(!renderTrigger)
   
    }
    function skipToPreviousTrack() {
      if(route.params.index!=0)
      {
        setCurrentPosition(0)
        setDefaultLyrics(true)
        route.params.index--;
        GetTrackData();
        setRenderTrigger(!renderTrigger)
       
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
      //  setitemIdWithCurrPlaying(itemId)
      setCurrentPosition(positionMs);





      } catch (error) {
        console.error(error);
        throw error;
      }
    };


    
 
  
    const HandleOpenSong = (Track: any,SongPos:number) => {
    // APIRun
    console.log(access_token)
      const data = {
        
      // context_uri: Track.album.uri,
        uris:route.params.PathURis[0],
        offset: {
          position: route.params.index,
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
         
          setTrackText(Track.name)
          setArtistText(Track.artists[0].name)
        })
        .catch((error:any) => {
       
          if(error=="Error: Request failed with status code 404")
          {
            alert("Please Open Your Spotify App On Mobile")
            
          
          }
          else{
           
            axiosInstance.get("");
            
          }
        });
    };

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
    console.error('Hata:', error);
  

  }
}


// const  getTrackId = () => {

//   axios
//     .get(`https://api.musixmatch.com/ws/1.1/track.search`, {
//       params: {
//         q_artist: artist,
//         q_track: track,
//         apikey:apiKey
//       },
//     })
//     .then(response => {

//       // setTrackId(response.data.message.body.track_list[0].track.track_id);
//     })
//     .catch(error => {
//       console.error(error);
//     });
// };


const GetTrackData = () => {
      const trackIdOnSpotify:string = route.params.DataItems[route.params.index].track.id;
        axios
          .get(

            "https://api.spotify.com/v1/tracks/" +trackIdOnSpotify,
            {

              headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
              )
          .then(result => {
           
             setIsLyricsFetched(false)
            setPlaylist([result.data]);
            setDuration(result.data.duration_ms);
            setArtist(result.data.artists[0].name);          
            setTrack(result.data.name);
            setitemIdWithOpenSong(result.data.id)
            HandleOpenSong(result.data,0);
            setIsPlaying(true); 
            
            
          })
          .catch(error => {
            console.log("An error occurred while fetching the playlist:", error);
            if(Platform.OS==='web')
            {

              window.localStorage.setItem("access_token", '');
            }
            else if(Platform.OS==='ios')
            {
              AsyncStorage.setItem("access_token", '')
            }
           
            axiosInstance.get("")
          });
        };
        
        const options = {
          apiKey: 'KqyQaD95PrHTv3v8Uz5Io-wSdBnC9pbMEz5eKHcYm6FTeW4VJYZv3gnn0txOPsrB',
         title: track,        
          artist: artist,
          optimizeQuery: true
        };
      
        

        if (!isLyricsFetched) {
        
          getLyrics(options)
            .then((lyrics: any) => {
              if (lyrics!=null) { // lyrics değeri null değilse replace metodunu çağır
          
                const lyricsWithoutBrackets = lyrics.replace(/\[[^\]]*\]/g, '')
                setLyrics(lyricsWithoutBrackets);
              }
             
              setIsLyricsFetched(true); // Bayrağı etkinleştir
            });
        }
        
        

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
    console.log('Şarkı 0 ms konumunda başlatıldı.');
    setRestartPosition(newValue)
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


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


const getTranslateOfLyrics = async () => {
  
  setDefaultLyrics(false)
  let originalLines =[];
  let translatedLines ="";
  try {
    
    
    if(lyrics!=""){


      try {
        const requestData = {
          input: lyrics,
          target: LanguageSelect,
        };
      
        const response = await axios.post(
          "https://api-translate.systran.net/translation/text/translate",
          requestData,
          {
            params: {
              key: apiKeyForSystran ,
            },
          }
        );
      
        const translatedText = response.data.outputs[0].output;
      
        const originalLines = lyrics
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
      
        const translatedLines = translatedText
          .split("\n")
          .map((line:any) => line.trim())
          .filter((line:any) => line.length > 0);
      
        const maxLength = Math.max(originalLines.length, translatedLines.length);
      
        const alignedLines = [];
        for (let i = 0; i < maxLength; i++) {
          const originalLine = originalLines[i] || "";
          const translatedLine = translatedLines[i] || "";
      
          alignedLines.push(originalLine, translatedLine);
        }
      
        const alignedText = alignedLines.join("\n");
      
        setTranslateOfLyrics(alignedText.trim());
      } catch (error:any) {
        console.log("Lyrics not loading")
        // Hata yönetimini burada gerçekleştirin veya hata durumunu kullanıcıya bildirin
      }
  
    }
  else{
    
    setDefaultLyrics(true)
  }
  }
    
  catch (error) {
    if(error=="Error: Request failed with status code 400")
    {
      setDefaultLyrics(true)
    }
    else{
      alert("The language of the song does not support the target language");
      setDefaultLyrics(true)
      
    }
  }
};


     useEffect(() => {
  
       
       GetTrackData();
      

    }, []);


    // useEffect(() => {

    //   if (artist ) {
    //     getTrackId();
    //   }
    // }, [artist]);

    useEffect(() => {

      if (artist) {
        getLyrics();
        
      }
    }, [artist]);

    // useEffect(() => {
    //    getTranslateOfLyrics(); 
    
    // }, [LanguageSelect]);

   



    // useEffect(()=>
    // {
     
    //     alignText()
      

    // },[Trues])




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
    
    return (
     
      <View  >
   <LinearGradient
        // Background Linear Gradient
        
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={{backgroundColor:"white",zIndex:-999999999999999999,height:920}}
        start={{ x: 0.5, y: 1 }} // Geçişin başlangıç noktası (aşağıda)
        end={{ x: 0.5, y: 0 }} //
      >
        <FlatList scrollEnabled={false} data={playlist} renderItem={RenderItem} style={{top:180}} />
        {!isFirstButtonEnabled?
        <View  style={styles.container}>
          <Text style={styles.trackTextStyle}>{track}</Text>
    <Text style={styles.artistTextStyle}>{artist}</Text>
     <SliderPosition isPlaying={isPlaying}
    Duration={durationFullTimeOfSong} 
    RestartPosition={RestartPosition} 
    HandleOpenSongForZeroTime={HandleOpenSongForZeroTime}  
    itemIdOpen={itemIdOpen} isFirstTime={isFirstTime}     
    renderTrigger={renderTrigger}
    skipToNextTrack={skipToNextTrack}
    lyrics={lyrics} 
    onPositionChanged={handlePositionChanged}  
    />
   
      <View style={styles.containerMusicButton}>
      <TouchableOpacity onPress={handlePressSecondButton}>
      <Icon name="sliders" size={30} color="orange" />
         
         </TouchableOpacity>
        <TouchableOpacity 
        onPress={
          skipToPreviousTrack 
        }
        style={styles.SkipTrack} 
      >
<Ionicons style={[styles.image,{marginLeft:8}]} name="play-skip-back-outline" size={42}  color="orange" />

     


         </TouchableOpacity>
        <TouchableOpacity 
        onPress={() => {
          if (isPlaying) {
            pause();
          } else {
            play();
          }

        }}
        style={[styles.buttonPlayPause,{ margin: 10 }]}
      >

        <Text>{isPlaying ?  <Ionicons style={styles.imagePlay} name="pause-circle" size={80}  color="orange" />: <Ionicons style={styles.image} name="play-circle" size={80}  color="orange" />}</Text>
         </TouchableOpacity>
         <TouchableOpacity
        onPress={() => {
          skipToNextTrack()
        }
        }
        style={styles.SkipTrack}
      >
<Ionicons style={styles.image} name="play-skip-forward-outline" size={42}  color="orange" />



         </TouchableOpacity>
         <TouchableOpacity onPress={handlePressSecondButton}>
         <Icon name="sliders" size={30} color="orange" />
         
         </TouchableOpacity>
         </View>
        
   {/* <LyricsComponent currentTime={position} lyrics={lyrics} Duration={durationFullTimeOfSong} isPlaying={isPlaying} skipToNextTrack={skipToNextTrack}></LyricsComponent> */}
   </View> :""}

   {isFirstButtonEnabled?
   <TouchableOpacity style={{marginVertical:70}}>
    
      <DualSlider artist={artist} track={track}  Duration={durationFullTimeOfSong} />
      
    
        <TouchableOpacity style={styles.circleButton} onPress={() => HandleOpenSongForZeroTime(false)}>
          <AntDesign name="close" style={{alignItems:'center'}} size={30} color="black" />
        </TouchableOpacity>
    
    </TouchableOpacity> :""}
    </LinearGradient>
    
      </View>
    
    );
  };
  
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
      textAlign: 'center'
    },
    artistTextStyle:{
      top:200,
     
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
  });
 
  export default OpenMusicSelect;
 