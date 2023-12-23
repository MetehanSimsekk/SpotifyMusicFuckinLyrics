import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Modal, StyleSheet, ScrollView, TouchableOpacity, Animated,Image,TouchableWithoutFeedback ,StatusBar,Platform} from 'react-native';
import Slider from "@react-native-community/slider";
import { Card, Text } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list'
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomSelectList from './CustomSelectlist';
import OpenMusicSelect from './OpenMusic';
let apiKeyForSystran:any="";
let access_token:any="";
let intervalLyrics:any; 

const LyricsComponent = ({ currentTime, lyrics ,Duration,isPlaying,skipToNextTrack,PositionChange ,SlidingComplete}: { currentTime: any; lyrics:any,Duration:any,isPlaying:any ,skipToNextTrack:()=>void,PositionChange:(value:any)=>void,SlidingComplete:(value:any)=>void}) => {
  const [lyricsIndex, setLyricsIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [LanguageSelect, setLanguageSelect] = useState("");
  const [DefaultLyrics, setDefaultLyrics] = useState(false);
  const [TranslateOflyrics, setTranslateOfLyrics] = useState('');
  const [isDropdownShown, setIsDropdownShown] = useState(true);
  const [intervalId, setIntervalId] = useState<any>(null);
  let [position, setPosition] = useState(0);
  const [lyricsHeight, setLyricsHeight] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [FilteredLyrics, setFilteredLyrics] = useState<any>("");
  const [lyricsWithSpaceArea, setlyricsWithSpaceArea] = useState<any>("");
  const [SecondTime, setSecondTime] = useState(0);

  const scrollY = new Animated.Value(0);
  const bounceValue = new Animated.Value(1);
  const [Inıt, setInıt] = useState(false);
  const [lyricColors, setLyricColors] = useState<string[]>([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

  

 
 



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
  
    AsyncStorage.getItem('apiKeyForSystran')
      .then(apiKey => {
        apiKeyForSystran = apiKey;
        // Diğer işlemler
      })
      .catch(error => {
       console.error(error);
      });
  }

const splitLyricsByLines = (lyrics:any) => {
    return lyrics.split('\n');
  };

  // useEffect(() => {
  
  //   // setPosition(currentTime)
  // }, [currentTime]);

  
  
  // Diğer useEffect, LanguageSelect değiştiğinde çalışacak
  useEffect(() => {
  
      getTranslateOfLyrics();
    
  }, [LanguageSelect]);


 
  useEffect(() => {
  

  const lyricsLines = splitLyricsByLines(lyrics);
  const filteredLyrics = lyricsLines.filter((line:any) => line !== "");
  const totalSeconds = Math.floor(Duration / 1000);
  const resultFilteredLyrics = filteredLyrics.join('\n');
 
  //  const totalIndexes = lyricsLines.length

  //  setSecondTime(totalSeconds/totalIndexes)

  
  //  const Toplam = totalSeconds/totalIndexes
  //  alert(Toplam)
  setFilteredLyrics(resultFilteredLyrics)
 

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



  // useEffect(() => {
  //   const nextLyricIndex = lyrics.findIndex((item:any) => item.time > currentTime);
  //   setLyricsIndex(nextLyricIndex > 0 ? nextLyricIndex - 1 : 0);
  // }, [currentTime]);

//   useEffect(() => { 
//     intervalLyrics = setInterval(() => {
//     setCurrentLyricIndex((prevIndex) => (prevIndex+ 1) %  FilteredLyrics.split('\n').length);
//    }, SecondTime*1000);
  
//    // Temizleme işlemi: Komponent çıkış yaptığında zamanlayıcıyı durdur.
  
//  }, [FilteredLyrics]); //lyrics olabilir
 
 
//  useEffect(() => {
//    const updatedLyricColors = FilteredLyrics.split('\n').map((_:any, index:any) =>
//      currentLyricIndex >= index ? colors[index % colors.length] : 'black'
//    );
//    setLyricColors(updatedLyricColors);
//  }, [currentLyricIndex]);
 
 

 


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




  const getTranslateOfLyrics = async () => {

    setDefaultLyrics(false) // Görünüp kaybolma ilk şarkıda , Hatanın oluşma nednelerindne biri olabilir
    let originalLines =[];
    let translatedLines ="";
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
          const translatedText = response.data.outputs[0].output;
          
       
          const originalLines = lyrics
            .split("\n")
            .map((line:any) => line.trim())
            .filter((line:any) => line.length > 0);
          
          const translatedLines = translatedText
            .split("\n")
            .map((line:any) => line.trim())
            .filter((line:any) => line.length > 0);
            console.log(translatedLines)
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
  
  
  const handleLyric = (index: number) => {
 
    const SumTime:number = SecondTime*1000
    const lyricTime = index*SumTime// Burada lyrics listesinden ilgili şarkı sözünün zaman bilgisini alın
    // setPosition(lyricTime);
    PositionChange(lyricTime)
    setCurrentLyricIndex(index)
   
    handleOpenSongForTimeWithSwitch(lyricTime);
   
  };
 

  const handleIconPress = () => {
    // Burada ilgili işlemleri yapabilirsiniz
    setModalVisible(false);
  };
  const data = [
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
    {key:'cz', value:'Czech'},      
    {key:'ar', value:'Arabic'},
    {key:'pl', value:'Poland'},

]


const handlePositionChange = (value:number) => {
    

  setPosition(value);
  PositionChange(value)
   setSliderValue(value);
};

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


const ses = ()=>
{
 //Bu method Modalin onShow özelliği ile tetiklenebilir sözler için
}
 
  useEffect(() => {
    
   

    const timeout =setTimeout(() => {
      
      Animated.sequence([
        Animated.timing(bounceValue, { toValue: 1.03, duration: 350, useNativeDriver: false }),
        Animated.timing(bounceValue, { toValue: 1, duration: 350, useNativeDriver: false }),
        Animated.timing(bounceValue, { toValue: 1.03, duration: 350, useNativeDriver: false }),
        Animated.timing(bounceValue, { toValue: 1, duration: 350, useNativeDriver: false }),
        
      ]).start()
    }, 300); // 3 saniye gecikme

    return () => {
      clearTimeout(timeout);
      
  // Animasyonu iptal et (eğer bileşen hızlıca unmount edilirse)
    };
  },[bounceValue]);
 
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
 <SelectList  fontFamily={'GillSans'}    dropdownStyles={{backgroundColor:'black'}} inputStyles={{color:'black'}} dropdownTextStyles={{color:'white',fontSize:17} } 
    boxStyles={{ width: 120, borderColor:'black' , borderRightWidth:7,borderBottomEndRadius:2,borderBottomStartRadius:2,borderBottomWidth:0}}  
    // boxStyles={{ width: 120, borderColor:'black' , borderRightWidth:0,borderLeftWidth:0,borderTopWidth:0,borderBottomEndRadius:0,borderBottomStartRadius:0,borderBottomWidth:0}}
    setSelected={(val: any) => {
      setLanguageSelect(val);
    }}
    data={data}
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
{DefaultLyrics == false &&
            TranslateOflyrics.split('\n').map((line: string, index: number) => (
              <TouchableOpacity >
              {/* <Text key={index} style={[styles.modalTranslateLyricsText, { overflow: 'hidden',  color: currentLyricIndex === index ? 'white' : 'black' ,lineHeight: 50,top:115,zIndex:-2}]}> */}
              <Text key={index} style={[styles.modalTranslateLyricsText, { overflow: 'hidden',   color: index % 2 === 0 ? 'black' : 'white',fontSize: index % 2 === 0 ? 25 : 18,fontFamily: index % 2 === 0 ? 'Georgia-Bold' : 'Futura',lineHeight: 40,top:0,zIndex:-2}]}>

                {line}             
              </Text>
            </TouchableOpacity>
              
            ))}
       
{DefaultLyrics &&
      FilteredLyrics.split('\n').map((line: string, index: number) => (
          <TouchableOpacity key={index} onPress={() => handleLyric(index)}>
          <Text
            key={index}
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
   
       
 
       {/* <View style={[styles.sliderContainer, { marginBottom: 30 }]}>
            <View style={{ position: 'absolute', top: -10, left: 0, right: 0, bottom:-120,  backgroundColor:'orange'
 }} />
 <Text style={styles.msToTime}>{msToTime(position)}</Text>
    <Slider
      style={{ width: '95%',transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }],bottom:20}}
      minimumValue={0}
      maximumValue={Duration}
      value={position} // Set the initial value of the slider as desired
      minimumTrackTintColor="black"
      maximumTrackTintColor="grey"
      thumbTintColor="black"
      
      onValueChange={handlePositionChange}

      onSlidingComplete={(value) => {
        if(isPlaying)
        {WhileCurrentlyPlay()}

      

      SlidingComplete(value)
    

       }}
       
       onSlidingStart={() => {
        stopSlider();
       }}

    />
      <Text style={styles.msToTimeLast}>{msToTimeLast(Duration)}</Text>
      </View> */}
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
