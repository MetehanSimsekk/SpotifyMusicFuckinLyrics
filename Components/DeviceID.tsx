import axios from "axios";
import { CommonActions, NavigationContainerRef,ParamListBase  } from '@react-navigation/native';
import { useRef }  from 'react';

let accessToken = window.localStorage.getItem("access_token");

function GetDeviceID() {
  if(accessToken != "")
  {
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
      window.localStorage.setItem("device_id", res.data.devices[0].id);
    })
    .catch(error => {
      console.log(error);

      if (error === "TypeError: Cannot read properties of undefined (reading 'id') ") {
        alert("Please Open Spotify App First");
      } else {
        alert("Hata Apptsx : " + error);
        
      }
    });
}}

export default GetDeviceID();
