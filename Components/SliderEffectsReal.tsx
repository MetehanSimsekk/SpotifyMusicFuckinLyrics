import React, { useState,useRef } from 'react';
import { StyleSheet, View, Text ,TouchableOpacity} from 'react-native';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import SliderPosition from './SliderMusicLine';
import { Platform } from 'react-native';

let access_token:any = "";
if(Platform.OS === 'web')
{
 access_token  = window.localStorage.getItem("access_token")
}
const MySlider = () => {
  const [values, setValues] = useState('00:00');
  const [valuesOther, setValuesOther] = useState('00:00');
  const intervalRef = useRef<NodeJS.Timer  | null>(null);
  const [counter, setCounter] = useState(0); // Not Premium Properties
  const [position, setPosition] = useState(1);
   const [RestartPosition ,setRestartPosition ] = useState(false);
  const multiSliderValuesChange = (values:any) => {

   
   
    const totalMinutes =values[0]
    const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  //  const alphaMs=totalMinutes * 1000
   
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  const startMs = parseInt(formattedTime.substring(0, 2)) * 60 + parseInt(formattedTime.substring(3));
  const endMs = parseInt(valuesOther.substring(0, 2)) * 60 + parseInt(valuesOther.substring(3));
  const durationMs = (endMs - startMs) * 1000;


  if (intervalRef.current) 
  clearInterval(intervalRef.current);
  intervalRef.current = null;
  
  if (startMs < endMs) {
    intervalRef.current = setInterval(() => {
      HandleOpenSongForTime(startMs* 1000);

    }, durationMs);
  }

  if (totalMinutes >= parseInt(valuesOther.substring(0, 2)) * 60 + parseInt(valuesOther.substring(3))) {
    setValues(formattedTime);
    setValuesOther(formattedTime);
  } else {
    setValues(formattedTime);
  }
  setCounter((prevCounter) => prevCounter + 1);

  };

 
   async function HandleOpenSongForTime(ms:any) {

    try {
     
      const response = await axios({
        method: 'PUT',
        url: `https://api.spotify.com/v1/me/player/seek?position_ms=${ms}`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      console.log(`Şarkı ${ms} ms konumunda başlatıldı.`);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  
   
    
  
  };
 
  const multiSliderValuesChangeOther = (valuesOther:any) => {
  const totalMinutes =valuesOther[0]
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
 

  const startMs = parseInt(values.substring(0, 2)) * 60 + parseInt(values.substring(3));
  const endMs = parseInt(formattedTime.substring(0, 2)) * 60 + parseInt(formattedTime.substring(3));
  const durationMs = (endMs - startMs) * 1000;
  if (intervalRef.current)   
  clearInterval(intervalRef.current);
  intervalRef.current = null;

  if (startMs < endMs) {
    intervalRef.current = setInterval(() => {
      HandleOpenSongForTime(startMs * 1000);

    }, durationMs);


    // setTimeout(() => {
    //   HandleOpenSongForTime(startMs);
    // }, durationMs);
  }

  if (totalMinutes >= parseInt(values.substring(0, 2)) * 60 + parseInt(values.substring(3))) {
    setValuesOther(formattedTime);
  } else {
    
    setValues(formattedTime);
    setValuesOther(formattedTime)
   
  }
  
  };

  return (
    <View style={styles.container}>
      
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        thumbTintColor={'red'}
        minimumTrackTintColor={'red'}
        maximumTrackTintColor={'white'}
        value={parseInt(values.substring(0, 2)) * 60 + parseInt(values.substring(3))}
        onValueChange={(value) =>
        
          multiSliderValuesChange([value])
          
        }
        onSlidingComplete={(value) =>
          HandleOpenSongForTime(value * 
            1000)
        }
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        thumbTintColor={'blue'}
        minimumTrackTintColor={'blue'}
        maximumTrackTintColor={'white'}
        value={parseInt(valuesOther.substring(0, 2)) * 60 + parseInt(valuesOther.substring(3))}
        onValueChange={(value) =>
          multiSliderValuesChangeOther([value])
        }
        onSlidingComplete={() =>
          HandleOpenSongForTime(parseInt(values.substring(0, 2)) * 60 + parseInt(values.substring(3)) * 1000)
        }
      />
      <Text style={styles.text}>{values}</Text>
      <Text style={styles.text}>{valuesOther}</Text>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  slider: {
    width: '80%',
    height: 40,
    margin: 10,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'orange',
  },
});

export default MySlider;



