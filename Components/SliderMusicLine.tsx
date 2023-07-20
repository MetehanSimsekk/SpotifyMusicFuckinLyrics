import React, { useEffect, useState ,useRef} from 'react';
import { StyleSheet, Text, Button, View, SafeAreaView, TextInput, FlatList, Alert, Image, AppRegistry, TouchableOpacity, TouchableHighlight, Platform } from 'react-native';
import Slider from "@react-native-community/slider";
import axios from 'axios';
import { PanResponder } from 'react-native';
import { set } from 'lodash';
import RangeSlider from './RangeSlider';
import { platform } from 'os';
import AsyncStorage from '@react-native-async-storage/async-storage';

let access_token="";

const SliderPosition =  ({ artist,track,isPlaying , RestartPosition, HandleOpenSongForZeroTime,onPositionChanged ,Duration, itemIdOpen ,isFirstTime,renderTrigger,skipToNextTrack }:{artist:any,track:any,isPlaying:any,RestartPosition:any, HandleOpenSongForZeroTime:any,onPositionChanged:any,Duration:any, itemIdOpen:any,isFirstTime:any,renderTrigger:any,skipToNextTrack:()=>void}) => {
  

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
  const [intervalId, setIntervalId] = useState<any>(null); 
  const [position, setPosition] = useState(0);
  const [StatusrenderTrigger, setrenderTrigger] = useState(false);

  
  
  useEffect(()=>
  {

    if(RestartPosition)
    {
   
      setPosition(0)
      HandleOpenSongForZeroTime(false)
    }
  },[RestartPosition]);

  const handlePositionChange = (value:number) => {
    // console.log("handlePositionChange - value:", value);
    
     setPosition(value);

     if (onPositionChanged) {
      console.log(value)
      onPositionChanged(value);
    }

    


  };



  const TimerPosition = async () => {
    try {
      clearInterval(intervalId);
      const id = setInterval(() => {
        setPosition((prevPosition) => {
          const newPosition = prevPosition + 1000;
          if (newPosition >= Duration) {
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
    isPlaying =false
    
    setIntervalId(null);
  };



const alerts =() =>
{
  alert("sss")
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
    
      TimerPosition(); // Start the interval if the component is playing
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
        <Text style={styles.trackTextStyle}>{track}</Text>
    <Text style={styles.artistTextStyle}>{artist}</Text>
        <Text style={styles.msToTime}>{msToTime(position)}</Text>
        <TouchableHighlight 
        underlayColor="#EDEDED">
      <Slider
        style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }]}}
        minimumValue={0}
        maximumValue={Duration}
        value={position}
        
        onValueChange={handlePositionChange}
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
    </TouchableHighlight>

 <Text style={styles.msToTimeLast}>{msToTimeLast(Duration)}</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  msToTime : {
    position: 'absolute',
    top:27,
    left: 180,
    fontSize: 12,
   
    
    
  }, msToTimeLast : {
    position: 'absolute',
    right: 180,
    fontSize: 12,
   
    top:27
    
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


