import axios from "axios";
import { CommonActions, NavigationContainerRef,ParamListBase  } from '@react-navigation/native';
import { useRef }  from 'react';
import axiosInstance from "./TokenTimeGoToRefreshToken/RefreshToken";
import { Alert, Platform } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { platform } from "os";
import APIRun from "./API";
import * as Updates from "expo-updates"

let accessToken:any
let accessTokenOnMobile:any;
 let device_id:any;


 if (Platform.OS === 'web')
 {
  console.log("şuan webdesin")
  accessToken = window.localStorage.getItem("access_token")
}
else if(Platform.OS === 'ios')
{
  console.log("selam girdin")
  AsyncStorage.getItem('access_token')
  .then(token => {
    accessTokenOnMobile = token;

console.log("Mobile Token : " + accessTokenOnMobile)

    axios.get(
      'https://api.spotify.com/v1/me/player/devices',
      {
        headers: {
          Authorization: `Bearer BQBWQf8NQXZ3voVZ4nLOX5YiDyrfDdBnINm6WBge81-t489KD44IU8a2yyhJvEogdUFQ-dHyAKyZIpSuG7yV2Zukx8RC78fa878tGxT1A5FWxUuruinOZ2uTmeaRYjmMud1wI91B7D3BuWvd8FNoXP0u_HKav5MRon7YSvRuxW_YQ8F0i1UbVQ5uW3K63eIYKqPB5EHhojKJT0_Set5c4V18FzEQQ4W8ci2FvKK3OWQuEfLRS1ujMcHLQENKCSugg6G1O_eJf2WvoItYDthdcco6PklyTGas5Jd9J9sXWKgfzZ-H0tjD_323pTo`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(res => {
console.log("dEviceID"+res.data.devices[1].id)
AsyncStorage.setItem("device_id", res.data.devices[0].id);
      })
      .catch(error => {
   
        if (error === "TypeError: Cannot read properties of undefined (reading 'id') ") {
          

        //  alert("Please First Open Spotify API")
        } else {
          // alert("Please First Open Spotify API")
          console.log(error+"Bu hata lyricsComponent içerisinde alınmıştır")
          //  APIRun()
          // alert("Hata Apptsx : " + error);
          // axiosInstance.get("");
          // İstek başarılı olduğunda response kullanılabilir
        }
      });
    // Diğer işlemler



    if(accessTokenOnMobile==null)
    {
     
    GetDeviceID()
    }// Diğer işlemler
  })
  .catch(error => {
    // Hata yönetimi
  });
}
else if(Platform.OS === 'android')
{
  AsyncStorage.getItem('access_token')
  .then(token => {
    accessTokenOnMobile = token;

console.log("Mobile Token : " + accessTokenOnMobile)

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
console.log("hey Device ID")
        AsyncStorage.setItem("device_id", res.data.devices[0].id);
        
      })
      .catch(error => {
   
        if (error === "TypeError: Cannot read properties of undefined (reading 'id') ") {
          

         alert("Please First Open Spotify API")
        } else {
          alert("Please First Open Spotify API")
         
          console.log(error+"Bu hata lyricsComponent içerisinde alınmıştır")
          //  APIRun()
          // alert("Hata Apptsx : " + error);
          // axiosInstance.get("");
          // İstek başarılı olduğunda response kullanılabilir
        }
      });
    // Diğer işlemler



    if(accessTokenOnMobile==null)
    {
     
    GetDeviceID()
    }// Diğer işlemler
  })
  .catch(error => {
    // Hata yönetimi
  });
}



 function GetDeviceID() {
  
  if (accessTokenOnMobile !== null) {
   
    if (Platform.OS === 'web') {
      console.log("şuan webdesin")
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
            Alert.alert(
              "Uyarı",
              "Lütfen Spotify Mobil Uygulamanızdan herhangi bir şarkıyı açın ve tekrar deneyinss.",
              [
                  {
                      text: "Tamam",
                      onPress: () => Updates.reloadAsync()
                  },
                 
              ]
          );
          } else {
            // alert("Hata Apptsx : " + error);
            // axiosInstance.get("");
            // İstek başarılı olduğunda response kullanılabilir
          }
        });
    } 
    else if(Platform.OS === 'ios')
{
  
  AsyncStorage.getItem('access_token')
  .then(token => {
    accessTokenOnMobile = token;

console.log("Mobile Token : " + accessTokenOnMobile)

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
        console.log("Mobile Device ID : " + res.data.devices[0].id)
        AsyncStorage.setItem("device_id", res.data.devices[0].id);     
      
      })
      .catch(error => {
   
        if (error === "TypeError: Cannot read properties of undefined (reading 'id') ") {
          

        //  alert("Please First Open Spotify API")
        } else {
          // alert("Please First Open Spotify API")
          console.log(error+"Bu hata lyricsComponent içerisinde alınmıştır")
          //  APIRun()
          // alert("Hata Apptsx : " + error);
          // axiosInstance.get("");
          // İstek başarılı olduğunda response kullanılabilir
        }
      });
    // Diğer işlemler

  })
  .catch(error => {
    // Hata yönetimi
  });
}
  }
}
export default GetDeviceID();


