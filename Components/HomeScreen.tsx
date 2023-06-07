import React from "react";
import { StyleSheet, Text, Button, View, Image,TouchableOpacity,Animated  } from "react-native";
import APIRun from "../Components/API";
import APIforMusixMatch from "./MusicMatch/APIforMusixMatch";
import { white } from "react-native-paper/lib/typescript/src/styles/themes/v2/colors";
import { useEffect, useState ,useRef} from 'react';

import axios from "axios";
import queryString from 'query-string';

const CLIENT_ID="081f04c9fc134332a54d2e1c567e7096";/*****/
const CLIENT_SECRET="9be70720ac1044dbb78f3a10476978a9";/*****/
const SPOTFY_AUTHORIZE_ENDPOINT="https://accounts.spotify.com/authorize"
const REDIRECT_URI="http://localhost:19006/callback"
const SCOPES=["user-library-read","playlist-modify-private","user-read-currently-playing","user-read-playback-state","user-modify-playback-state","app-remote-control"]










function HomeScreen() {

  const [isPressed, setIsPressed] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };
  const colorAnimation = useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   if (renderCount > 1) {
  //     RefreshToken();
     
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


  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnimation, {
          toValue: 0,
          duration: 2000,
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
  APIforMusixMatch;
  
  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.title}>ORANGER</Text>
      
       <Image
          source={require("../assets/spotify_logo.png")} // Spotify logosunun dosya yolu
          style={styles.logo}
        />
      
      <TouchableOpacity
        onPress={APIRun}
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
    </Animated.View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
   container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    paddingHorizontal: 16,
    paddingVertical: 4,
  
    // Spotify green color
    fontSize: 16,
    fontWeight: "bold",
 
  
    
   
  },
  connectText: {
    // Spotify green color
   height:35,
    borderColor:"white",
    borderWidth:0.2,
    borderRadius:15,
    marginTop:12
  },
});
