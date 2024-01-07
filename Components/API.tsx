
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking  } from 'react-native';
import queryString from 'query-string';
import axios from 'axios';
import { setTimeout } from 'timers/promises';
// import DeviceID from "./DeviceID";

const CLIENT_ID="081f04c9fc134332a54d2e1c567e7096";/*****/
const CLIENT_SECRET="9be70720ac1044dbb78f3a10476978a9";/*****/
const SPOTFY_AUTHORIZE_ENDPOINT="https://accounts.spotify.com/authorize"
 const REDIRECT_URI="http://localhost:19006/callback"
 const REDIRECT_URI_Mobile="exp://192.168.1.113:19000";
const SCOPES=["user-read-private","user-read-email","user-library-read","playlist-modify-private","user-read-currently-playing","user-read-playback-state","user-modify-playback-state","app-remote-control","playlist-read-private"]
// const SCOPES=["user-read-private","user-read-email","user-read-playback-state","user-modify-playback-state","user-read-currently-playing","playlist-modify-private","playlist-modify-public","playlist-read-private"]

let accessToken: any;
let code: any;
let token_type:any;
let expires_in:number;
     
const APIRun =()=>{
  
 
  if(Platform.OS === 'web')
  {
 const urls = SPOTFY_AUTHORIZE_ENDPOINT + '?client_id=' + CLIENT_ID + '&redirect_uri=' + REDIRECT_URI + '&scope=' + SCOPES + '&response_type=code&show_dialog=true';
    
    try {
      
      function getCodeFromURL(url: string): string | null {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        return urlParams.get('code');
      }
      
        window.location.href = urls;
        const url:any = window.location.search;
      
        const code = getCodeFromURL(url);
        
            const requestData = {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            };
            const encodedData = queryString.stringify(requestData);
            const headers = {
             'Content-Type': 'application/x-www-form-urlencoded',           
            };
            axios.post('https://accounts.spotify.com/api/token', encodedData, { headers })
        .then(response => {
      
        window.localStorage.setItem("access_token",response.data.access_token)
        window.localStorage.setItem("expires_in",response.data.expires_in)
        window.localStorage.setItem("refresh_token",response.data.refresh_token)
        window.localStorage.setItem("token_type",response.data.token_type)
      
          // Erişim tokenı, süresi ve yenileme tokenı gibi bilgileri kullanabilirsiniz
        })
        .catch(error => {
          // Hata yönetimi
        });
        
     

let token = window.localStorage.getItem("access_token")


    } catch (error) {
      alert(error)

      
      
    }
 
    
}
else if(Platform.OS === 'ios')
{

 
  Linking.openURL(
    `${SPOTFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_Mobile}&scope=${SCOPES}&response_type=code&show_dialog=true`
  );
  
  const handleCallback = (event:any) => {
    const { url } = event;
   
    const code = url.substring(1)
          .split('?')
          .find((elem:any) => elem.startsWith('code'))
          .split('=')[1];
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
            axios.post('https://accounts.spotify.com/api/token', encodedData,{headers})
        .then(response => {

        const expiresInMillis: number = response.data.expires_in;
       AsyncStorage.setItem("expires_in",expiresInMillis.toString())
        AsyncStorage.setItem("refresh_token",response.data.refresh_token)
        AsyncStorage.setItem("access_token",response.data.access_token)
        AsyncStorage.setItem("token_type",response.data.token_type)
        
          // Erişim tokenı, süresi ve yenileme tokenı gibi bilgileri kullanabilirsiniz
        })
        .catch(error => {
          console.log(error)
          // Hata yönetimi Hata yönetimleri sayfa da alert olarak değil altt aline olarak kırmızı hata vericek. Tüm hatalar için geçerli
    });
 
// Oturum açma işlemi tamamlandıktan sonra çağrılacak işlev



// Geri dönüşü dinlemek için olay dinleyicisini ekle



 


};

Linking.addEventListener('url', handleCallback);

}
else if(Platform.OS === 'android')
{

 
  Linking.openURL(
    `${SPOTFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_Mobile}&scope=${SCOPES}&response_type=code&show_dialog=true`
  );
  
  const handleCallback = (event:any) => {
    const { url } = event;
   
    const code = url.substring(1)
          .split('?')
          .find((elem:any) => elem.startsWith('code'))
          .split('=')[1];
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
            axios.post('https://accounts.spotify.com/api/token', encodedData,{headers})
        .then(response => {

        const expiresInMillis: number = response.data.expires_in;
       AsyncStorage.setItem("expires_in",expiresInMillis.toString())
        AsyncStorage.setItem("refresh_token",response.data.refresh_token)
        AsyncStorage.setItem("access_token",response.data.access_token)
        AsyncStorage.setItem("token_type",response.data.token_type)
        
          // Erişim tokenı, süresi ve yenileme tokenı gibi bilgileri kullanabilirsiniz
        })
        .catch(error => {
          console.log(error)
          // Hata yönetimi Hata yönetimleri sayfa da alert olarak değil altt aline olarak kırmızı hata vericek. Tüm hatalar için geçerli
    });
 
// Oturum açma işlemi tamamlandıktan sonra çağrılacak işlev



// Geri dönüşü dinlemek için olay dinleyicisini ekle



 


};

Linking.addEventListener('url', handleCallback);

}
}

   
                 
    
export default APIRun;
