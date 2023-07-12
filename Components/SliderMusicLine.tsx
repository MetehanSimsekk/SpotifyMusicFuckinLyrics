import React, { useEffect, useState ,useRef} from 'react';
import { StyleSheet, Text, Button, View, SafeAreaView, TextInput, FlatList, Alert, Image, AppRegistry, TouchableOpacity, TouchableHighlight, Platform } from 'react-native';
import Slider from "@react-native-community/slider";
import axios from 'axios';
import { PanResponder } from 'react-native';
import { set } from 'lodash';
import RangeSlider from './RangeSlider';
import { platform } from 'os';
import AsyncStorage from '@react-native-async-storage/async-storage';

let access_token:any="";

const SliderPosition =  ({ isPlaying ,currentPosition, RestartPosition, HandleOpenSongForZeroTime,onPositionChanged ,Duration, itemIdOpen ,isFirstTime,renderTrigger,skipToNextTrack}:{isPlaying:any,currentPosition:number,RestartPosition:any, HandleOpenSongForZeroTime:any,onPositionChanged:any,Duration:any, itemIdOpen:any,isFirstTime:any,renderTrigger:any,skipToNextTrack:()=>void}) => {


  if(Platform.OS=="web"){
   access_token = window.localStorage.getItem("access_token");
}
else if(Platform.OS=="ios")
{
  AsyncStorage.getItem('access_token')
  .then(token => {
    access_token = token;
   
    // Diğer işlemler
  })
  .catch(error => {
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

  const handlePositionChange = (value:any) => {
    console.log("handlePositionChange - value:", value);
    console.log(RestartPosition)



  setPosition(value);
  if (onPositionChanged) {
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
    <View style={{ margin: 15 }}>
      <Slider
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
      
      />


    </View>
  );
};



export default SliderPosition;


