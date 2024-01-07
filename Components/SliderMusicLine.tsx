import React, { useEffect, useState ,useRef} from 'react';
import { StyleSheet, Text, Button, View, SafeAreaView, TextInput, FlatList, Alert, Image, AppRegistry, TouchableOpacity, TouchableHighlight, Platform ,Vibration } from 'react-native';
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
let access_token="";

const SliderPosition =  ({ isPlaying ,HandleOpenSongForZeroTime,DefaultLyrics,Duration, onSkipToNextTrack,itemIdOpen ,isFirstTime,renderTrigger,lyrics,skipToNextTrack}:{isPlaying:any,onSkipToNextTrack:any,DefaultLyrics:any, HandleOpenSongForZeroTime:any,Duration:any, itemIdOpen:any,isFirstTime:any,renderTrigger:any,lyrics:any,skipToNextTrack:()=>void}) => {
 
  if (Platform.OS === "web") {
    access_token = window.localStorage.getItem("access_token") || "";
  } else if (Platform.OS === "ios") {
    AsyncStorage.getItem("access_token")
      .then((token) => {
        access_token = token || "";
        // Diğer işlemler
      })
      .catch((error) => {
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
  const [intervalId, setIntervalId] = useState<any>(null); 
  const [position, setPosition] = useState(0);
  const[defaultlyrics,setdefaultlyric] = useState(false)
  const [StatusrenderTrigger, setrenderTrigger] = useState(false);




 

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
          const newPosition = prevPosition + 1000;
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


  return (
    
    <View style={{ top:210,
      width: '180%', 
      alignSelf: 'center', 
      height: '45%'  }}>
       
    <TouchableHighlight 
        underlayColor="#EDEDED">
        <Text style={styles.msToTime}>{msToTime(position)}</Text>
        </TouchableHighlight>
      <Slider
        style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }]}}
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
 <LyricsComponent currentTime={position} lyrics={lyrics} Duration={Duration} isPlaying={isPlaying} skipToNextTrack={skipToNextTrack} ></LyricsComponent>

    </View>



   
  );
};

const styles = StyleSheet.create({
  msToTime : {
    position: 'absolute',
    top:27,
    left: 180,
    fontSize: 12,
   color:'orange'
    
    
  }, msToTimeLast : {
    position: 'absolute',
    right: 180,
    fontSize: 12,
   color:"orange",
    top:27
    
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


