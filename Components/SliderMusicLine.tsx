import React, { useEffect, useState ,useRef} from 'react';
import { StyleSheet, Text, Button, View, SafeAreaView, TextInput, FlatList, Alert, Image, AppRegistry, TouchableOpacity, TouchableHighlight, Platform ,Vibration , Dimensions} from 'react-native';
import Slider from "@react-native-community/slider";
import axios from 'axios';
import { PanResponder } from 'react-native';
import { set } from 'lodash';
import RangeSlider from './RangeSlider';
import { platform } from 'os';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LyricsComponent from './lyricsComponent';
import Ionicons from '@expo/vector-icons/Ionicons';
import { skip } from 'node:test';
import * as Haptics from 'expo-haptics';

let access_token: any = "";
if (Platform.OS === "web") {
  access_token = window.localStorage.getItem("access_token") || "";
} 
if (Platform.OS === 'ios') {
  // AsyncStorage'den alınacak anahtarların bir listesini oluşturun
  const keys = ['access_token', 'device_id', 'apiKeyForSystran'];

  // Tüm anahtarlar için AsyncStorage.getItem çağrısını yapın ve Promise.all ile bekleyin
  Promise.all(keys.map(key => AsyncStorage.getItem(key)))
    .then(([accessToken, deviceId, apiKeyForSystran]) => {
      // Değerleri alın ve gerekli işlemleri yapın
      access_token = accessToken;
   
      apiKeyForSystran = apiKeyForSystran;


      // Burada diğer işlemlerinizi gerçekleştirebilirsiniz
    })
    .catch(error => {
      console.error(error);
      // Hata yönetimi
    });
}
else if (Platform.OS === "android") {
  AsyncStorage.getItem("access_token")
    .then((token) => {
      access_token = token || "";
      // Diğer işlemler
    })
    .catch((error) => {
      // Hata yönetimi
    });
}
const SliderPosition =  ({ isPlaying ,HandleOpenSongForZeroTime,DefaultLyrics,Duration, onSkipToNextTrack,itemIdOpen ,isFirstTime,renderTrigger,lyrics,skipToNextTrack}:{isPlaying:any,onSkipToNextTrack:any,DefaultLyrics:any, HandleOpenSongForZeroTime:any,Duration:any, itemIdOpen:any,isFirstTime:any,renderTrigger:any,lyrics:any,skipToNextTrack:()=>void}) => {
 
  


  const [intervalId, setIntervalId] = useState<any>(null); 
  const [position, setPosition] = useState(0);
  const[defaultlyrics,setdefaultlyric] = useState(false)
  const [StatusrenderTrigger, setrenderTrigger] = useState(false);




  const screenWidth = Dimensions.get('window').width;

  const msToTime = (ms: any) => {
    const minutes = Math.floor(ms / 60000);
    let seconds = Math.floor(((ms % 60000) / 1000)); // and here too
   
 
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  };
  const msToTimeLast = (ms: any) => {
      
    const minutes = Math.floor(ms / 60000);
    let seconds = Math.floor(((ms % 60000) / 1000)); // and here too
    
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  };

  
  const WhileCurrentlyPlay = async () => {
    try {
      clearInterval(intervalId);
      const id = setInterval(() => {
        setPosition((prevPosition) => {
          const newPosition = prevPosition + 999;
          if (newPosition >= Duration) {
           
            setPosition(0)
           skipToNextTrack();
            clearInterval(id);
          } else {
            setPosition(newPosition);
          }
          return newPosition;
        });
      }, 1000);
      setIntervalId(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
 
  };

  const stopSlider = () => {
    clearInterval(intervalId);
   
    setIntervalId(null);
    isPlaying =false
  };

  function PositionChange(ms:any){
    alert(ms)
  }



  useEffect(() => {
    
    if(StatusrenderTrigger!=renderTrigger)
    {
      setPosition(0)
    }

    setrenderTrigger(renderTrigger)
     // Reset the position state
    //  stopSlider();   // Stop any existing intervals
   
    if (isPlaying) {
     
      WhileCurrentlyPlay(); // Start the interval if the component is playing
    }
    else{
    
      stopSlider(); 
    }
  }, [isPlaying,renderTrigger]);


  
 
  const handleOpenSongForTimeWithSwitch = async (ms:any) => {
  
    const flooredMs = Math.floor(ms);
    isPlaying =true
   
    try {
       await axios({
        method: 'PUT',
        url: `https://api.spotify.com/v1/me/player/seek?position_ms=${flooredMs}`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setPosition(ms);
      console.log(`Şarkı ${ms} ms konumunda başlatıldı.`);
      isPlaying =false
    } catch (error) {
      console.error(error);
     
      throw error;
    }
    // AsyncPlay();
  };
const HandleVibrate =() => {

  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}
  return (
    
    <View style={{ 
      width: '190%', 
      alignSelf: 'center', 
      height: '50%',marginTop:310 }}>
       
  
        <Text style={styles.msToTime}>{msToTime(position)}</Text>
     
      <Slider
        style={{ transform: [{ scaleX: 0.45 }, { scaleY: 0.48 }]}}
        
        minimumValue={0}
        maximumValue={Duration}
        value={position}        
      //  onValueChange={handlePositionChange}
     

        onSlidingComplete={(value) => {
         
          if(isPlaying)
          {WhileCurrentlyPlay()}

        
         handleOpenSongForTimeWithSwitch(value);
        }}
        onSlidingStart={() => {
         stopSlider();
        }}
        thumbTintColor="white"
        
        minimumTrackTintColor="white"   
        maximumTrackTintColor="orange"
      />
   

 <Text style={styles.msToTimeLast}>{msToTimeLast(Duration)}</Text>
<TouchableHighlight style={{marginHorizontal:170}}
>
  
 <LyricsComponent currentTime={position} lyrics={lyrics} Duration={Duration} isPlaying={isPlaying} skipToNextTrack={skipToNextTrack} ></LyricsComponent>
 </TouchableHighlight>
    </View>
 


   
  );
};

const styles = StyleSheet.create({
  msToTime : {
    position: 'absolute',
    top:30,
    left: 205,
    fontSize: 12,
   color:'orange'
    
    
  }, msToTimeLast : {
    position: 'absolute',
    right: 205,
    fontSize: 12,
   color:"orange",
   top:30,
    
  },SkipTrack:{
     
    margin: 18,
    
},
  image:{
    width:  50, 
    height: 50
  },
  trackTextStyle : {
    bottom:230,
    position:'absolute',
    justifyContent:'center',
    
    left: '35%', // Ortalama için yarısını kullanıyoruz
    fontSize: 18,
    fontFamily:'Avenir-Heavy',
    textAlign: 'center'
  },
  artistTextStyle:{
    bottom:210,
    position:'absolute',
    justifyContent:'center',
    
    left: '35%', // Ortalama için yarısını kullanıyoruz
    fontSize: 17,
    fontFamily:'Avenir-Light',
    textAlign: 'center'
  }
})

export default SliderPosition;


