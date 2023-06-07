import React, { useEffect, useState ,useRef} from 'react';
import { StyleSheet, Text, Button, View, SafeAreaView, TextInput, FlatList, Alert, Image, AppRegistry, TouchableOpacity, TouchableHighlight } from 'react-native';
import Slider from "@react-native-community/slider";
import axios from 'axios';
import { PanResponder } from 'react-native';
import { set } from 'lodash';
import RangeSlider from './RangeSlider';

const SliderPosition =  ({ isPlaying ,currentPosition, onPositionChanged ,Duration, itemIdOpen ,isFirstTime,renderTrigger,skipToNextTrack}:{isPlaying:any,currentPosition:number,onPositionChanged:any,Duration:any, itemIdOpen:any,isFirstTime:any,renderTrigger:any,skipToNextTrack:()=>void}) => {

  const [intervalId, setIntervalId] = useState<any>(null);
  const access_token = window.localStorage.getItem("access_token");
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isSliding, setIsSliding] = useState(false);
  const [isManualChange, setIsManualChange] = useState(false); 
  const [position, setPosition] = useState(0);
  const [StatusrenderTrigger, setrenderTrigger] = useState(false); 
  
  const handlePositionChange = (value:any) => {



    
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
    // try {
     
      
    //     clearInterval(intervalId); 
    //     const id = setInterval(() => {
         
    //       setPosition((position) => position + 1000);
        
    //       if(position==Duration)
    //       {
           
    //         setPosition(0)
    //       }
    //     }, 1000);
    //     setIntervalId(id);
      
    
    // } catch (error) {
    //   console.error(error);
    //   throw error;
    // }
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
        // onValueChange={(value) => {
        //   //  setPosition(value);
        //   ControlPlay();
        // }}
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


