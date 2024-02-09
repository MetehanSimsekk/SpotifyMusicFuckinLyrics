import React, { useState,useRef } from 'react';
import { StyleSheet, View, Text ,TouchableOpacity} from 'react-native';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import SliderPosition from './SliderMusicLine';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
let access_token:any = "";
let params:any="";
let device_id:any ="";
let apiKeyForSystran:any="";
if(Platform.OS === 'web')
{
 access_token  = window.localStorage.getItem("access_token")
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
const MySlider = ({artist,track,Duration,onClosePressed}:{artist:any,track:any,Duration:any,onClosePressed:any}) => {
  const [values, setValues] = useState('00:00');
  const [valuesOther, setValuesOther] = useState('00:00');
  const intervalRef = useRef<NodeJS.Timer  | null>(null);
  const [counter, setCounter] = useState(0); // Not Premium Properties
  const [position, setPosition] = useState(1);
  
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

  function getFirstThreeDigits(num: number): number {
    const numStr: string = num.toString();
    const firstThreeDigits = parseInt(numStr.slice(0, 3));
    return firstThreeDigits;
  }


   async function HandleOpenSongForTime(ms:any) {

    try {
     
      const response = await axios({
        method: 'PUT',
        url: `https://api.spotify.com/v1/me/player/seek?position_ms=${ms}`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      
      return response;
    } catch (error) {
      
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

  const stopInterval = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
  };

   const HandlePressForZeroTime = (onClosePressed: any) => { {
    onClosePressed(false); 
    
    stopInterval();
      try {
        const response =  axios({
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
    }}
  return (
    <View style={styles.container}>
    <Text style={styles.trackTextStyle}>{track}</Text>
    <Text style={styles.artistTextStyle}>{artist}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={getFirstThreeDigits(Duration)}
        step={1}
        thumbTintColor={'orange'}
        minimumTrackTintColor={'white'}
        maximumTrackTintColor={'orange'}
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
        maximumValue={getFirstThreeDigits(Duration)}
        step={1}
        thumbTintColor={'orange'}
        minimumTrackTintColor={'white'}
        maximumTrackTintColor={'orange'}
        value={parseInt(valuesOther.substring(0, 2)) * 60 + parseInt(valuesOther.substring(3))}
        onValueChange={(value) =>
          multiSliderValuesChangeOther([value])
        }
        onSlidingComplete={() =>
          HandleOpenSongForTime(parseInt(values.substring(0, 2)) * 60 + parseInt(values.substring(3)) * 1000)
        }
      />
      <Text style={styles.textValues}>{values}</Text>
      <Text style={styles.textValuesOther}>{valuesOther}</Text>
    <View>
    {/* onPress={() => HandleOpenSongForZeroTime(false)} */}
    <TouchableOpacity style={styles.circleButton}  onPress={() => HandlePressForZeroTime(onClosePressed)}>
                <AntDesign name="close" style={{ alignItems: 'center' }} size={30} color="black" />
    </TouchableOpacity>
    </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop: 200, // marginVertical yerine marginBottom kullanıldı
  },
  slider: {
    width: '80%',
    top: 30,
    height: 30,
    margin: 10,
    
  },
  textValues: {
    fontSize: 20,
    top: 10,
    marginHorizontal: 0,
    position: 'absolute',
    color:'orange'
  },
  circleButton: {
    width: 70,
    height: 70,
    borderRadius: 25,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: -60, // marginVertical yerine marginBottom kullanıldı
  },
  textValuesOther: {
    fontSize: 20,
    top: 20,
    marginVertical: 50,
    position: 'absolute',
    color:'orange',
  },
  button: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'orange',
  },
  trackTextStyle: {
    position: 'absolute',
    justifyContent: 'center',
    zIndex: 99999999,
    fontSize: 18,
    fontFamily: 'Avenir-Heavy',
    textAlign: 'center',
    bottom: 45,
    color:'orange',

  },
  artistTextStyle: {
    position: 'absolute',
    justifyContent: 'center',
    zIndex: 99999999,
    fontSize: 17,
    fontFamily: 'Avenir-Light',
    textAlign: 'center',
    bottom: 21.8,
    color:'orange',

  },
});


export default MySlider;



