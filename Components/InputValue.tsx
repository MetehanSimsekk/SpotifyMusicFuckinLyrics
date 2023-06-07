import React , { useState,useRef,useEffect  } from 'react';
import { View, Text, Button,TextInput, NativeSyntheticEvent, TextInputFocusEventData,TextInputChangeEventData } from 'react-native';
import RangeSlider from '../Components/RangeSlider';
import PreviousMusic from '../Components/PreviousMusic';



var access_token  = window.localStorage.getItem("access_token")
var device_id  = window.localStorage.getItem("device_id")
const params = {
  "device_id": device_id
};
const API_URL = "https://api.spotify.com/v1/me/player/previous?device_id="+device_id;

const Input = () => {
  const [intervalTime, setIntervalTime] = useState(0);
  const [text, setText] = useState("");  
  const intervalRef = useRef<NodeJS.Timer  | null>(null);


  useEffect(() => {
    // intervalTime değeri değiştiğinde, mevcut interval'i temizle
    if (intervalRef.current) 
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  
    // yeni interval'i başlat
   
    if (intervalTime > 0) {
      intervalRef.current = setInterval(() => {
        PreviousMusic();
      }, intervalTime);
    }
  }, [intervalTime]);


  const handleChangeText = (texts: NativeSyntheticEvent<TextInputChangeEventData>) => {
    // Girilen değerin sadece sayısal olup olmadığını kontrol ediyoruz.

    const isNumericInput =text.replace(/[^0-9]/g, "");
  
    if (isNumericInput) {

      setText(isNumericInput);
     
       if (text.length > 0) {
        PreviousMusic();
       
       console.log("Süre:",text)
       setIntervalTime(parseInt(isNumericInput) * 1000);
    
      
      }
    }
    else
    {
      
      stopTimer();
      setText(isNumericInput)
    }
    
  };

  const stopTimer = () => {
    if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
};

const [minValue, setMinValue] = useState(0);
const [maxValue, setMaxValue] = useState(100);

const handleValueChange = ({min, max}: { min: any, max: any }) => {
  setMinValue(min);
  setMaxValue(max);
};

  return (
    
 <View>
   {/* <RangeSlider sliderWidth={300} min={10} max={400} step={1} onValueChange={handleValueChange}></RangeSlider> */}
      <TextInput style={{borderWidth: 3,
        borderColor: 'orange',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 5}}
      value={text} 
       onBlur={handleChangeText}      
     onChangeText={setText}
      placeholder="Type here..."
      keyboardType="numeric"

    >
      
    </TextInput>
 </View>
  );
};
 
export default Input;


// //---Eklenecekler Listesi
//search sorunu


//genius sözler
//tek slider
// play pause restart tuşu 

//Renkler Turuncu beyaz

