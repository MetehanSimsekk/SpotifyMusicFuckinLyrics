import { EffectCallback, useRef , useEffect,useState }  from 'react';
import * as React from 'react';
import { StyleSheet, Text,Button, View,AppRegistry} from 'react-native';
import SpotifyLikedMusicScreen from './Components/GetMusicListAndSearch';
import OpenMusicSelect from './Components/OpenMusic';
import DeviceID from './Components/DeviceID';
import axios from 'axios';
import { CommonActions,StackActions , useNavigation,NavigationContainer } from '@react-navigation/native'
 import { createNativeStackNavigator   } from '@react-navigation/native-stack';
import { NavigationContainerRef,ParamListBase  } from '@react-navigation/native';
import HomeScreen from './Components/HomeScreen';
import { Platform } from 'react-native';
import RefreshToken from './Components/TokenTimeGoToRefreshToken/RefreshToken';
import axiosInstance from './Components/TokenTimeGoToRefreshToken/RefreshToken';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import FlagButton from './Components/Flag';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { platform } from 'process';
const Stack = createNativeStackNavigator();
// const navigation =useNavigation;
// AppRegistry.registerComponent('App', () => App);
const CLIENT_ID="081f04c9fc134332a54d2e1c567e7096";/*****/
const CLIENT_SECRET="9be70720ac1044dbb78f3a10476978a9";/*****/
const SPOTFY_AUTHORIZE_ENDPOINT="https://accounts.spotify.com/authorize"
const REDIRECT_URI="http://localhost:19006/callback"
const SCOPES=["user-library-read","playlist-modify-private","user-read-currently-playing","user-read-playback-state","user-modify-playback-state","app-remote-control"]

let access_token:any;
let device_id:any;
let refresh_token:any;
// axiosInstance;
  if(Platform.OS == 'web')
  {     
    
     access_token  = window.localStorage.getItem("access_token")
     refresh_token  = window.localStorage.getItem("refresh_token")
     device_id  = window.localStorage.getItem("device_id")

  }
  else if(Platform.OS == 'ios')
    {

    // const getData = async (key:any) => {
    //   try {
    //     const value = await AsyncStorage.getItem(key);
    //     return value;
    //   } catch (error) {
    //     console.error('Failed to get data from AsyncStorage:', error);
    //     return null;
    //   }
    // };
    
     access_token =  AsyncStorage.getItem('access_token');
    
  }
  


 

  
function App() {

  const navigationRef = useRef<NavigationContainerRef<ParamListBase>>(null);
 
   //const navigationRef = React.useRef(null);
  
      useEffect(() => {
       
       
        if (Platform.OS==='ios'){
          AsyncStorage.getItem('access_token')
      .then(token => {
       
        access_token =token
      
        if (access_token!="") {
          
          navigationRef.current?.navigate('SpotifyLikedMusicScreen');
        } else {
         
          navigationRef.current?.dispatch(
            CommonActions.navigate({     
              name: 'Home'
            })
            );
          }})
        }
        else if(Platform.OS=='web')
        {
          if (access_token!=null) {
            
                    navigationRef.current?.navigate('SpotifyLikedMusicScreen');
                  } else {
                   
                    navigationRef.current?.dispatch(
                      CommonActions.navigate({     
                        name: 'Home'
                      })
                    );
                  }
        }
       
        
          
          DeviceID;
        }, []);
    // if(Platform.OS=="web")
    // {
    //       if (access_token!="") {
            
    //         navigationRef.current?.navigate('SpotifyLikedMusicScreen');
    //       } else {
           
    //         navigationRef.current?.dispatch(
    //           CommonActions.navigate({     
    //             name: 'Home'
    //           })
    //         );
    //       }
    //     }
    //     else if(Platform.OS=="ios")
    //     {
    //       AsyncStorage.getItem('access_token')
    //   .then(token => {
        
    // alert(access_token)
    //     access_token = token;
    //     if (access_token!=undefined) {
         
    //         navigationRef.current?.navigate('SpotifyLikedMusicScreen');
            
    //       } else {
    //         navigationRef.current?.dispatch(
    //           CommonActions.navigate({     
    //             name: 'Home'
    //           })
    //         );
    //       }
    //       DeviceID;
    //     // Diğer işlemler
    //   })
    //   .catch(error => {
    //     alert(error)
    //     // Hata yönetimi
    //   });
        
    //     }
    //         // navigate to DetailsScreen on component mount

  return (
    <NavigationContainer ref={navigationRef}>
  <Stack.Navigator>
  <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
  <Stack.Screen name="SpotifyLikedMusicScreen" component={SpotifyLikedMusicScreen} options={{
          gestureEnabled: false,
          headerLeft: () => null,
      
        }} />
  <Stack.Screen name="OpenMusicSelect"  
        component={OpenMusicSelect} />
        
   </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});