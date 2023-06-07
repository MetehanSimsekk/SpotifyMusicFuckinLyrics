import axios from 'axios';
import React from 'react';

var access_token  = window.localStorage.getItem("access_token")
var device_id  = window.localStorage.getItem("device_id")

const PreviousMusic=()=>{
        
    try {
      const response =  axios({
        method: 'PUT',
        url: 'https://api.spotify.com/v1/me/player/seek?position_ms=0&device_id='+device_id,
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
   
    } catch (error) {
      console.error('An error occurred while skipping to previous track:', error);
    }
  
  }
  export default PreviousMusic;