import React from "react";
import { StyleSheet, Text, Button, View, Image,TouchableOpacity,Animated ,Dimensions, Platform  } from "react-native";
import APIRun from "../Components/API";
import APIforMusixMatch from "./MusicMatch/APIforMusixMatch";
import SystranForTranslate from "./TranslateAPI/SystranForTranslate";
import GoogleTranslate from "./TranslateAPI/GoogleTranslate";
import { useEffect, useState ,useRef} from 'react';
import axios from "axios";
import queryString from 'query-string';
import { Linking  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLIENT_ID="081f04c9fc134332a54d2e1c567e7096";/*****/
const CLIENT_SECRET="9be70720ac1044dbb78f3a10476978a9";/*****/
const SPOTFY_AUTHORIZE_ENDPOINT="https://accounts.spotify.com/authorize"
 const REDIRECT_URI="http://localhost:19006/callback"

 const REDIRECT_URI_Mobile="exp://10.22.225.17:8081";


const SCOPES=["user-read-private","user-read-email","user-library-read","playlist-modify-private","user-read-currently-playing","user-read-playback-state","user-modify-playback-state","app-remote-control","playlist-read-private","playlist-read-collaborative","playlist-modify-public","playlist-modify-private"]


let fontSizeRatio:number=0


  
function HomeScreen() {
 
  useEffect(() => {
    // Deep linking event listener ekleme
    const handleDeepLinkEvent = (event:any) => {
      handleRedirect(event.url);
    };
    
    
    
    Linking.addEventListener('url', handleDeepLinkEvent);
  }, []);

  const [isPressed, setIsPressed] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };
  const colorAnimation = useRef(new Animated.Value(0)).current;
  const learnAnimation = useRef(new Animated.Value(0)).current;

  const handleLogin = () => {
    const authURL = `${SPOTFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_Mobile}&scope=${SCOPES.join(' ')}&response_type=code&show_dialog=true`;
    Linking.openURL(authURL);
  };
  
  // useEffect(() => {
    //     RefreshToken();
    //   if (renderCount > 1) {
     
  //   } else {
  //     setRenderCount(renderCount + 1);
  //   }
  // }, [renderCount]);
  
  // useEffect(() => {
  //   if (renderCount <1) {
  //     RefreshToken();
  //   } else {
  //     setRenderCount(renderCount + 1);
  //   }


  //   RefreshToken();

  // }, [renderCount]);

  
  // biggerFontSizeRatio = fontSizeRatio * 10.5; 



  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
        
       
      ])
      
    ).start();
  }, []);
  const backgroundColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["black", "orange"],
  });
  const backgroundColorText = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["white", "white"],
  });
  const backgroundColorTextInclude = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["black", "orange"],
  });

  const learnOpacity = learnAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  APIforMusixMatch;
  GoogleTranslate;
  SystranForTranslate;

  const handleRedirect = (url:any) => {

    const queryParamsString = url.split('?')[1];
    const queryParams = queryParamsString.split('&').reduce((acc:any, current:any) => {
      const [key, value] = current.split('=');
      acc[key] = value;
      return acc;
    }, {});
  
    const code = queryParams['code'];
  
    if (code) {
      // Erişim tokeni almak için istek yap
      const requestData = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI_Mobile,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      };
      const encodedData = queryString.stringify(requestData);
      const headers = { 
        'Content-Type': 'application/x-www-form-urlencoded',
      };
  
      axios.post('https://accounts.spotify.com/api/token', encodedData, { headers })
        .then(response => {
          const expiresInMillis = response.data.expires_in;
          AsyncStorage.setItem("expires_in", expiresInMillis.toString());
          AsyncStorage.setItem("refresh_token", response.data.refresh_token);
          AsyncStorage.setItem("access_token", response.data.access_token);
          AsyncStorage.setItem("token_type", response.data.token_type);
  
          console.log("Erişim Tokeni:", response.data.access_token);
          console.log("Erişim Tokeni:", response.data.refresh_token);
        })
        .catch(error => {
          console.error("Erişim tokeni alınırken hata oluştu:", error);
        });
    }
  };
  // const handleRedirect = async (url:any) => {
  //   // URL'den yetkilendirme kodunu al
  //   console.log("girdi")
  //   const queryParamsString = url.split('?')[1];
  //   const queryParams = queryParamsString.split('&').reduce((acc: { [x: string]: any; }, current: { split: (arg0: string) => [any, any]; }) => {
  //     const [key, value] = current.split('=');
  //     acc[key] = value;
  //     return acc;
  //   }, {});
  
  //   const code = queryParams['code'];
     
  //   if (code) {
  //     try {
      
  //       // Erişim tokeni almak için istek yap
  //       const requestData = {
  //         grant_type: 'authorization_code',
  //         code: code,
  //         redirect_uri: REDIRECT_URI_Mobile,
  //         client_id: CLIENT_ID,
  //         client_secret: CLIENT_SECRET,
  //       };
  //       const encodedData = queryString.stringify(requestData);
  //       const headers = {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       };
  //       const response = await axios.post('https://accounts.spotify.com/api/token', encodedData, { headers });
       
  
  //               const expiresInMillis: number = response.data.expires_in ;
  //              AsyncStorage.setItem("expires_in",expiresInMillis.toString())
  //               AsyncStorage.setItem("refresh_token",response.data.refresh_token)
  //               AsyncStorage.setItem("access_token",response.data.access_token)
  //               AsyncStorage.setItem("token_type",response.data.token_type)
       
  //       console.log("Erişim Tokeni:", response.data.access_token);
      
  //       // Burada elde ettiğiniz token ve diğer bilgileri saklayabilirsiniz.
  //     } catch (error) {
  //       console.error("Erişim tokeni alınırken hata oluştu:", error);
  //     }
  //   }
  // };

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <View style={styles.titleContainer}>
    
        <Text style={styles.titleText}>ORANGER</Text>
       
      </View>
       <Image
          source={require("../assets/spotify_logo.png")} // Spotify logosunun dosya yolu
          style={styles.logo}
        />
      
      <TouchableOpacity
        // onPress={APIRun}
        onPress={handleLogin}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        >
      <Animated.View style={[styles.connectText,{ backgroundColor:backgroundColorText}]}>
        <Animated.Text style={[
          styles.button,
          { color:backgroundColorTextInclude},
        ]}>Connect with Spotify</Animated.Text>
      </Animated.View>
      </TouchableOpacity>
      {/* <Animated.Text style={[styles.learnText, { opacity: learnOpacity }]}>Enjoy the music, Listen to different languages, Translate the lyrics</Animated.Text> */}
    </Animated.View>
  );
}

export default HomeScreen;


//Styles
const { width, height } = Dimensions.get('window') ;
  
fontSizeRatio = Math.min(width, height) / 7.2 ;
const connectTextHeight = height * 0.054; 
const connectTextWidth = width * 0.6; 

const styles = StyleSheet.create({
   container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  learnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginTop: 140,
    fontFamily: "Papyrus",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white", // White text color
    marginBottom: 20,
  },
  connectButton: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
 
  width:150,
  height:45,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white", // White text color
  },
  button: {
     // Orange color
    margin:0,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    // Spotify green color
    marginTop:6,
    marginLeft:15,
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "AvenirNext-DemiBold",
  
    
   
  },headerImage: {
    width: 55, // Resim genişliği
    height: 90, // Resim yüksekliği

top:-15
    // Resim ile metin arasındaki boşluğu ayarla
  },
  titleContainer: {
    flexDirection: "row",    
    marginTop: 0,   
    zIndex: -1, // Mutlaka ekleyin
     

  },

  titleText: {
    fontSize: fontSizeRatio * 0.9, // Yazı boyutunu istediğiniz gibi ayarlayın
    color: "white",
    textAlign: "center",
    fontFamily: "GillSans-UltraBold", // Kullanmak istediğiniz yazı tipini belirleyin
    

  },
  connectText: {
    // Spotify green color
   height:connectTextHeight,
   width:connectTextWidth,
   borderColor:"white",
    borderWidth:0.2,
    borderRadius:15,
    marginTop:60
  },
});
