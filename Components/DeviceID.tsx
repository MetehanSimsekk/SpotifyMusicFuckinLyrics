import axios from "axios";
import { CommonActions, NavigationContainerRef,ParamListBase  } from '@react-navigation/native';
import { useRef }  from 'react';
import axiosInstance from "./TokenTimeGoToRefreshToken/RefreshToken";
import { Platform } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { platform } from "os";

let accessToken:any
let accessTokenOnMobile:any;
 let device_id:any;

 if (Platform.OS === 'web')
 {
  accessToken = window.localStorage.getItem("access_token")
}
else if(Platform.OS === 'ios')
{
  AsyncStorage.getItem('access_token')
  .then(token => {
    accessTokenOnMobile = token;
    GetDeviceID()
    // Diğer işlemler
  })
  .catch(error => {
    // Hata yönetimi
  });
}
 function GetDeviceID() {
  if (accessToken !== null) {
   
    if (Platform.OS === 'web') {
      // Web platformu için axios.get isteği
      axios.get(
        'https://api.spotify.com/v1/me/player/devices',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      )
        .then(res => {
          console.log("red" + res.data);
          window.localStorage.setItem("device_id", res.data.devices[0].id);
        })
        .catch(error => {
          console.log("error" + error);

          if (error === "TypeError: Cannot read properties of undefined (reading 'id') ") {
            alert("Please Open Spotify App First");
          } else {
            // alert("Hata Apptsx : " + error);
            // axiosInstance.get("");
            // İstek başarılı olduğunda response kullanılabilir
          }
        });
    } else if (Platform.OS === 'ios') {
      // iOS platformu için axios.get isteği
     

        axios.get(
          'https://api.spotify.com/v1/me/player/devices',
          {
            headers: {
              Authorization: `Bearer ${accessTokenOnMobile}`,
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          }
        )
          .then(res => {
          
          alert(res.data.devices[0].id)
            AsyncStorage.setItem("device_id", res.data.devices[0].id);
          })
          .catch(error => {
            console.log("error" + error);
            if (error === "TypeError: Cannot read properties of undefined (reading 'id') ") {
             
            } else {
            
              alert(error)
              // alert("Hata Apptsx : " + error);
              // axiosInstance.get("");
              // İstek başarılı olduğunda response kullanılabilir
            }
          });
        // Diğer işlemler
      
    
    }
  }
}
export default GetDeviceID();