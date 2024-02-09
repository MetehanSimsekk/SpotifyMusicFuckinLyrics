import React, { useEffect, useState,useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Modal, StyleSheet, ScrollView, TouchableOpacity, Animated,Image,TouchableWithoutFeedback ,StatusBar,Platform,Easing } from 'react-native';
import Slider from "@react-native-community/slider";
import { Card, Text } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list'
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomSelectList from './CustomSelectlist';
import OpenMusicSelect from './OpenMusic';
import { set } from 'lodash';
import * as Haptics from 'expo-haptics';
let apiKeyForSystran:any="";
let intervalLyrics:any; 
const splitLyricsByLines = (lyrics:any) => {
  return lyrics.split('\n');
};



if (Platform.OS === 'ios') {
  // AsyncStorage'den alınacak anahtarların bir listesini oluşturun
  AsyncStorage.getItem('apiKeyForSystran')
  .then(apiKey => {
    apiKeyForSystran = apiKey;
    // Diğer işlemler
  })
  .catch(error => {
   console.error(error);
  });

}
else if (Platform.OS === 'android') {
  
  AsyncStorage.getItem('access_token')
  .then(token => {
    // access_token = token;
    // Diğer işlemler
  })
  .catch(error => {
  

    console.error(error);
    // Hata yönetimi
  });

  AsyncStorage.getItem('apiKeyForSystran')
    .then(apiKey => {
      // apiKeyForSystran = apiKey;
      // Diğer işlemler
    })
    .catch(error => {
     console.error(error);
    });
}
const LyricsComponent = ({ currentTime,lyrics ,Duration,isPlaying,skipToNextTrack }: { currentTime: any;lyrics:any,Duration:any,isPlaying:any,skipToNextTrack:()=>void}) => {
  const [lyricsIndex, setLyricsIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [LanguageSelect, setLanguageSelect] = useState("");
  let [DefaultLyrics, setDefaultLyrics] = useState(true);
  const [TranslateOflyrics, setTranslateOfLyrics] = useState('');
  const [isDropdownShown, setIsDropdownShown] = useState(true);
  const [intervalId, setIntervalId] = useState<any>(null);
  let [position, setPosition] = useState(0);
  const [lyricsHeight, setLyricsHeight] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [FilteredLyrics, setFilteredLyrics] = useState<any>("");
  const [lyricsWithSpaceArea, setlyricsWithSpaceArea] = useState<any>("");
  const [SecondTime, setSecondTime] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [Inıt, setInıt] = useState(false);
  const [lyricColors, setLyricColors] = useState<string[]>([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [flagLyrics , setflagLyrics] = useState(false)
  let durationChange:any;
  const [hasEnteredEffect, setHasEnteredEffect] = useState(false);
  const bounceValue = useRef(new Animated.Value(1)).current;



  useEffect(() => {
   
      getTranslateOfLyrics();
    
  }, [LanguageSelect]);



  useEffect(() => {
  
  
  const lyricsLines = splitLyricsByLines(lyrics);
  const filteredLyrics = lyricsLines.filter((line:any) => line !== "");
  const totalSeconds = Math.floor(Duration / 1000);
  const resultFilteredLyrics = filteredLyrics.join('\n');
 
  setFilteredLyrics(resultFilteredLyrics)
  setLanguageSelect("")
 
  }, [lyrics]);


  

  const handleLyricPress = () => {
    setModalVisible(true);
    // return () => clearInterval(interval);
  };

  const stopSlider = () => {
    clearInterval(intervalId);
    isPlaying =false

    setIntervalId(null);
    clearInterval(intervalLyrics);
  };

  

  const WhileCurrentlyPlay = async () => {
    try {
     
      clearInterval(intervalId);
      const id = setInterval(() => {
    
        setPosition((prevPosition) => {
          const newPosition = prevPosition + 1000;
          if (newPosition >= Duration) {

            setDefaultLyrics(true)
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




  const getTranslateOfLyrics = async () => {
   
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
          setDefaultLyrics(false) 
       
          const translatedText = response.data.outputs[0].output;
          
          const originalLines = lyrics
            .split("\n")
            .map((line:any) => line.trim())
            .filter((line:any) => line.length > 0);
          
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
 
          setDefaultLyrics(true)
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
    
   
     // Reset the position state
    //  stopSlider();   // Stop any existing intervals
   
    if (isPlaying) {
    
      WhileCurrentlyPlay(); // Start the interval if the component is playing
    }
    else{
    
      stopSlider(); 
    }
  }, [isPlaying]);
  
  

 

  const handleIconPress = () => {
    // Burada ilgili işlemleri yapabilirsiniz
    setModalVisible(false);
  };
//   const data = [
//     {key:'tr', value:'Turkish'},
//     {key:'en', value:'English'},
//     {key:'es', value:'Spanish'},
//     {key:'fr', value:'Francais'},
//     {key:'pt', value:'Portuguese'},
//     {key:'de', value:'Deutsch'},
//     {key:'it', value:'Italiano'},
//     {key:'ru', value:'Russian'},
//     {key:'ja', value:'Japanese'},
//     {key:'zh', value:'Chinese'},
//     {key:'ko', value:'Korean'},
//     {key:'cz', value:'Czech'},      
//     {key:'ar', value:'Arabic'},
//     {key:'pl', value:'Poland'},

// ]

const datas = [
    {key:'tr', value:'Turkish'},
    {key:'en', value:'English'},
    {key:'es', value:'Spanish'},
    {key:'fr', value:'Francais'},
    {key:'pt', value:'Portuguese'},
    {key:'de', value:'Deutsch'},
    {key:'it', value:'Italiano'},
    {key:'ru', value:'Russian'},
    {key:'ja', value:'Japanese'},
    {key:'zh', value:'Chinese'},
    {key:'ko', value:'Korean'},
    {key:'el', value:'Greek'}, 
    {key:'id', value:'Indonesian'},      
    {key:'sv', value:'Swedish'},      
    {key:'pl', value:'Poland'},
    {key:'ar', value:'Arabic'},
]


 

//  useEffect(() => {
//     const timeout = setTimeout(() => {
//       Animated.sequence([
//         Animated.timing(bounceValue, {
//           toValue: 1.03,
//           duration: 350,
//           useNativeDriver: false , // Tüm animasyonlarda useNativeDriver'ı aynı değere ayarlayın
//           easing: Easing.inOut(Easing.ease) // Easing fonksiyonu ekleyin
//         }),
//         Animated.timing(bounceValue, {
//           toValue: 1,
//           duration: 350,
//           useNativeDriver: false ,
//           easing: Easing.inOut(Easing.ease)
//         }),
//         // ... diğer animasyonlar
//       ]).start();
//     }, 350);

//     return () => {
//       clearTimeout(timeout);
//       bounceValue.stopAnimation(); // Animasyonu durdur
//     };
//   }, [bounceValue]);



  useEffect(() => {
    const startBouncing = () => {
      // Yukarıya doğru zıplama
      Animated.timing(bounceValue, {
        toValue: 1.04, // Zıplama miktarını ayarlayın
        duration: 300, // Zıplama süresi
        useNativeDriver: true,
      }).start(() => {
        // Aşağıya doğru düşüş
        Animated.timing(bounceValue, {
          toValue: 1, // Başlangıç değerine dönüş
          duration: 300, // Düşüş süresi
          useNativeDriver: true,
        }).start();
      });
    };

    // Animasyonu başlat
    startBouncing();
    const interval = setInterval(startBouncing, 2000);
    // İsteğe bağlı: Belirli aralıklarla animasyonu tekrar et
    // const interval = setInterval(startBouncing, 1000);

    return () => {
      clearTimeout(interval);
       bounceValue.stopAnimation(); // Animasyonu durdur
    };
  }, [bounceValue]);
  const HandleVibrate =() => {

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }
  return (
    
    <View >
      <ScrollView scrollEnabled={false}  contentContainerStyle={styles.scrollViewContainer}>
        <TouchableOpacity  onPress={handleLyricPress}>
          <Animated.View
            style={[
             
              {
                transform: [{ scale: bounceValue }],
              },
            ]}
          >
            <Card style={styles.card}>
              <Card.Content>
              <Text style={styles.lyricsText}><Ionicons name="resize" size={32}  color="black" /></Text>
              </Card.Content>
            </Card>
          </Animated.View>
        </TouchableOpacity>
        </ScrollView>
       
        <Modal 
        animationType='fade'
        visible={modalVisible}
     
      >
         
         <Animated.View
        style={[
          styles.topBar,
          {
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 50], // İlgilenilen scroll aralığı (pixel olarak)
                  outputRange: [0, -50], // Scroll'a bağlı olarak translate etme miktarı (pixel olarak)
                  extrapolate: 'clamp', // Scroll aralığı dışındaki değerleri sınır değerlere kitleme
                }),
              },
            ],
          }
        ]}
      >
        </Animated.View>
       

 
       
      
  <View style={styles.container}>
  <TouchableOpacity style={{ marginHorizontal:150 }} onPress={handleIconPress} > 
  <Ionicons name="caret-down-circle" size={45} />
  </TouchableOpacity>
  <TouchableOpacity> 
  <Ionicons name="language-sharp" size={47} color="black"  style={{marginRight:120}}/> 
  </TouchableOpacity>
 </View> 
 <View style={styles.containerSelectList}>
 <SelectList  fontFamily={'GillSans'}    dropdownStyles={{backgroundColor:'black'}} inputStyles={{color:'black'}} dropdownTextStyles={{color:'orange',fontSize:17, textDecorationLine: 'underline'} } 
    boxStyles={{ width: 120, borderColor:'black' , borderRightWidth:7,borderBottomEndRadius:2,borderBottomStartRadius:2,borderBottomWidth:0}}  
    setSelected={(val: any) => {
      setLanguageSelect(val);
      HandleVibrate()
    }}
    data={datas}
    save="key"
    placeholder='Translate'
    searchPlaceholder=' ' 
  />
  </View>
  <View style={[styles.sliderContainerTop, { marginTop: 30 }]}>
            <View style={{ position: 'absolute', top:-90, left: 0, right: 0, bottom:-70,  backgroundColor:'orange',
 }} />

      </View>
  <View style={styles.modalContainer}>

  <ScrollView
      style={{ flex: 1}}
      contentContainerStyle={{ padding: 20 }}
      scrollEnabled={true}
      // contentOffset={{ x: 0, y: sliderValue/10}} 
      scrollEventThrottle={16} // ScrollView kaydırma hızı (16ms sıklıkla güncelle)
    >
{DefaultLyrics ==false &&
            TranslateOflyrics.split('\n').map((line: string, index: number) => (
              <TouchableOpacity key={`translated-line-${index}`}>
              {/* <Text key={index} style={[styles.modalTranslateLyricsText, { overflow: 'hidden',  color: currentLyricIndex === index ? 'white' : 'black' ,lineHeight: 50,top:115,zIndex:-2}]}> */}
              <Text  style={[styles.modalTranslateLyricsText, { overflow: 'hidden',   color: index % 2 === 0 ? 'black' : 'white',fontSize: index % 2 === 0 ? 25 : 18,fontFamily: index % 2 === 0 ? 'Georgia-Bold' : 'Futura',lineHeight: 40,top:0,zIndex:-2}]}>

                {line}             
              </Text>
            </TouchableOpacity>
              
            ))}
       
{DefaultLyrics &&
      FilteredLyrics.split('\n').map((line: string, index: number) => (
          <TouchableOpacity key={`original-line-${index}`} >
          <Text
            // key={index}
            style={[
              styles.modalLyricsText,
              {
                overflow: 'hidden',
                color: lyricColors[index],
                lineHeight: 40,
                zIndex: -2,
              },
            ]}
          >
            {line}
          </Text>
    </TouchableOpacity>

        ))}
            </ScrollView>
       </View>
   
      
      </Modal>
      
      </View>
   
  );

};

const styles = StyleSheet.create({
  container: {
 
    top:40,
    height:55,
    flexDirection:'row',
    right:15,
    position:'absolute',
    zIndex:20000,
    backgroundColor:'orange'
  },
  containerSelectList: {
 
    top:40,
    flexDirection:'row',
    right:15,
    position:'absolute',
    zIndex:20000,
  },
 
  topBar: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    height: 50,
   // Top bar'ın rengini burada değiştirebilirsiniz
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 170,
  },
  cardContainer: {
  // Kartın içindeki metni ortalamak için eklenen stil
  },
  card: {
    width: 350, // Kartın içinde metni ortalamak için eklenen stil
    height:60,
    marginBottom:0,
    
    backgroundColor: 'orange',
  },
  lyricsText: {
    fontSize: 20,
    bottom:10,
    textAlign: 'right',
   
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'orange',
   
    paddingHorizontal: 0,
    textAlign: 'left',
    paddingVertical: 40,
    flexDirection: 'row',
    zIndex:-10,
    marginTop:40
    
   
  },
  LyricsContainer: {
    backgroundColor: 'orange',
  
    textAlign: 'left',

  },
  modalTranslateLyricsText: {
   
textAlign:'left',
    flexWrap: 'nowrap',
  },
  modalLyricsText: {
    fontSize: 22,
    textAlign: 'left',
    fontFamily: "Georgia-Bold",
    flexWrap: 'nowrap',
    marginTop:9,
   
  },
  TextIncludeStyles: {
textAlign:'left',
  },
  sliderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
     marginBottom: 20, // Adjust this value to change the space between lyrics and slider
   
    
  },
  sliderContainerTop: {
    alignItems: 'center',
    justifyContent: 'center',
     marginTop: 20, // Adjust this value to change the space between lyrics and slider
   
  },
  msToTime : {
    position: 'absolute',
    top:20,
    left: 10,
    fontSize: 12,   
    
  }, msToTimeLast : {
    position: 'absolute',
    right: 10,
    fontSize: 12,
   
    top:19
    
  },
 
});

export default LyricsComponent;
