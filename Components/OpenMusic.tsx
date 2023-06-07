import axios from 'axios';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SliderMusicLine from "./SliderMusicLine";
import { useEffect, useState ,useRef} from 'react';
import { StyleSheet, Text,Button, View ,SafeAreaView,TextInput,FlatList,Alert,Image,AppRegistry,TouchableOpacity,TouchableHighlight } from 'react-native';
import Slider from "@react-native-community/slider";
import { ArtistNames } from '../Models/artistModel';
import DualSlider from "../Components/SliderEffectsReal";
import _ from 'lodash';

const Stack = createNativeStackNavigator();
import SpotifyWebApi from 'spotify-web-api-js';
import APIRun from './API';

var access_token  = window.localStorage.getItem("access_token")
var device_id  = window.localStorage.getItem("device_id")
var apiKey  = window.localStorage.getItem("apiKey")
var baseURL  = window.localStorage.getItem("baseURL")
const CLIENT_ID="081f04c9fc134332a54d2e1c567e7096";/*****/
const CLIENT_SECRET="9be70720ac1044dbb78f3a10476978a9";/*****/
const SPOTFY_AUTHORIZE_ENDPOINT="https://accounts.spotify.com/authorize"
const REDIRECT_URI="http://localhost:19006/callback"
const SCOPES=["user-library-read","playlist-modify-private","user-read-currently-playing","user-read-playback-state","user-modify-playback-state","app-remote-control"]

const spotifyApi = new SpotifyWebApi();

//NOT : Şarkıya tıklanıldığında şarkının açılması

spotifyApi.setAccessToken(access_token);
// PUT isteği için gönderilecek parametreler
const params = {
    "device_id": device_id
  };


  const OpenMusicSelect = ({ route}:{route:any}) => {

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [playlist, setPlaylist] = useState<ArtistNames[]>([]);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [position, setPosition] = useState(0);
    const [durationFullTimeOfSong, setDuration] = useState(0);
    const [intervalId, setIntervalId] = useState<any>(null);
    const [clickCount, setClickCount] = useState(0); 
    const clickTimeout = useRef(null);
    const [artist, setArtist] = useState("");
    const [track, setTrack] = useState("");
    const [trackId, setTrackId] = useState("");
    const [lyrics, setLyrics] = useState('');
    const [itemIdCrr, setitemIdWithCurrPlaying] = useState('');
    const [itemIdOpen, setitemIdWithOpenSong] = useState('');
    const [isFirstTime, setisFirstTime] = useState(true);
    const [renderTrigger, setRenderTrigger] = useState(false);
   

 
    const handlePositionChanged = (position: number) => {

      setCurrentPosition(position);
            
    };

  
    const play = () => {

     handlePositionChanged(currentPosition);
    
        HandleOpenSong(playlist[0], currentPosition); //İlk defa oynatılıyorsa, position değeri ile çağırın.
       
        setIsPlaying(true);   
      
    };

    const pause = () => {
      PauseMusic();
     setIsPlaying(false);
   setIntervalId("")
    clearInterval(intervalId);
    };

    function skipToNextTrack() {
      
  
      // Increment the index for next song
      route.params.index++;     
    
      // Fetch the data for the next song
      GetTrackData();
      setRenderTrigger(!renderTrigger)
    
   
    }
    function skipToPreviousTrack() {
      if(route.params.index!=0)
      {
        route.params.index--;
        GetTrackData();
        setRenderTrigger(!renderTrigger)
      }
      
      
      
    
      // Fetch the data for the next song
     
    }
    const msToTime = (ms: any) => {
      const minutes = Math.floor(ms / 60000);
      let seconds = Math.floor(((ms % 60000) / 1000)); // here is the change

      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    };
    const msToTimeLast = (ms: any) => {
      const minutes = Math.floor(ms / 60000);
      let seconds = Math.floor(((ms % 60000) / 1000)); // and here too

      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    };
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
       setitemIdWithCurrPlaying(itemId)
       setPosition(positionMs);
        console.log(`Current position: ${positionMs}, Duration: ${tracksDurationMS}`);




          // const id = setInterval(() => {
          //   setPosition((positionMs) => positionMs +1000);
          // }, 1000);
          // setIntervalId(id);







      } catch (error) {
        console.error(error);
        throw error;
      }
    };


    const HandleOpenSong = (Track: any,SongPos:number) => {
     APIRun
      const data = {
      // context_uri: Track.album.uri,
        uris:route.params.PathURis,
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
            params: params,
          }
        )
        .then((response) => {
          console.log("Başarılı:", response.data);
          
        })
        .catch((error) => {
          console.error("Hata:", error);
          alert(error);
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
    console.log('Şarkı durduruldu.');
    // const result = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
    //   headers: {
    //     'Authorization': 'Bearer ' + access_token
    //   }
    // });

  //  setPosition(result.data.progress_ms);
  } catch (error) {
    console.error('Hata:', error);
  }
}


const getTrackId = () => {

  axios
    .get(`https://api.musixmatch.com/ws/1.1/track.search`, {
      params: {
        q_artist: artist,
        q_track: track,
        apikey:apiKey
      },
    })
    .then(response => {

      setTrackId(response.data.message.body.track_list[0].track.track_id);
    })
    .catch(error => {
      console.error(error);
    });
};


const GetTrackData = () => {
      const trackIdOnSpotify = route.params.DataItems[route.params.index].track.id;
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
            window.localStorage.setItem("access_token", "");
          });
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






//NOT PREMIUM
const getLyrics = async () => {
  try {
    const response = await axios.get(`https://api.musixmatch.com/ws/1.1/track.lyrics.get`, {
      params: {
        track_id: trackId,
        apikey: apiKey,
      },
    });
    const fullLyrics = response.data.message.body.lyrics.lyrics_body;
    const cutOffIndex = fullLyrics.indexOf('...');

    if (cutOffIndex !== -1) {
      setLyrics(fullLyrics.slice(0, cutOffIndex));
    } else {
      setLyrics(fullLyrics);
    }
  } catch (error) {
    console.error(error);
  }
};
//PREMİU
// const getLyricsPremium = async () => {
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
      //  currentlyPlayingGetPosition();
      //  handleOpenSongForTimeWithSwitch();
       
       GetTrackData();
      

    }, []);


    useEffect(() => {

      if (artist && track) {
        getTrackId();
      }
    }, [artist, track]);

    useEffect(() => {

      if (trackId) {
        getLyrics();
      }
    }, [trackId]);



    const RenderItem = ({ item, index }: { item: any; index: number }) => {

      return (
        <View>


       <View style={{ flexDirection: 'row' }}>
            <Image
              style={{ width: 250, height: 250 }}
              source={{
                uri: item.album.images[index].url, //Array görüntü kalitesini ayarlıyor 0>1>2
              }}
            />
<Text>{lyrics}</Text>
</View>

        </View>
      );
    };

    return (
      <View>

        <FlatList data={playlist} renderItem={RenderItem} />
        <TouchableOpacity
        onPress={() => {
          if (isPlaying) {
            pause();
          } else {
            play();
          }

        }}
        style={{ margin: 10 }}
      >

        <Text>{isPlaying ? "Pause" : "Play"}</Text>
         </TouchableOpacity>
         <TouchableOpacity
        onPress={() => {

          skipToNextTrack()
        }
        }
        style={{ margin: 10 }}
      >

        <Text>{"İleri"}</Text>

         </TouchableOpacity>
         <TouchableOpacity
        onPress={
          skipToPreviousTrack 
        }
        style={{ margin: 10 }}
      >

        <Text>{"Geri"}</Text>

         </TouchableOpacity>
     <TouchableOpacity>
     <Text>{msToTime(currentPosition)}</Text>
     <SliderMusicLine isPlaying={isPlaying}
    Duration={durationFullTimeOfSong} itemIdOpen={itemIdOpen} isFirstTime={isFirstTime} 
         currentPosition={currentPosition} onPositionChanged={handlePositionChanged} renderTrigger={renderTrigger} skipToNextTrack={skipToNextTrack}/>

        <Text>{msToTimeLast(durationFullTimeOfSong)}</Text>
        </TouchableOpacity>
     <TouchableOpacity>
        <DualSlider />
        </TouchableOpacity>
      </View>
    );
  };

  export default OpenMusicSelect;
