import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import queryString from 'query-string';
import { Platform } from 'react-native';
import { useEffect } from 'react';


const axiosInstance = axios.create();
let tokenData:any; 
const CLIENT_ID="081f04c9fc134332a54d2e1c567e7096";/*****/
const CLIENT_SECRET="9be70720ac1044dbb78f3a10476978a9";/*****/


if(Platform.OS === 'web')
{
const REFRESHT_OKEN = window.localStorage.getItem("refresh_token");

axiosInstance.interceptors.request.use(
  
  
  async (config) => {
    const accessToken = window.localStorage.getItem("access_token");
    
    // Token kontrolü ve yenileme işlemi
    if (accessToken) {
      // Token'in süresini kontrol et
      const tokenExpiration:any = window.localStorage.getItem("expires_in");
      const currentTime:any = Date.now() / 1000;

      if (currentTime > tokenExpiration) {
        try {
          // Token'ı yenilemek için gerekli işlemleri yap
          const refreshedToken = await refreshAccessToken();
          // Yeni token'ı kaydet
          
          // Yeni token'ın süresini kaydet
          // const newExpiration = calculateNewExpirationTime();

          

          if (config && config.headers) {
            config.headers.Authorization = `Bearer ${refreshedToken}`;
          } else {   
            config = {
              ...config,
              headers: {
                Authorization: `Bearer ${refreshedToken}`,
              },
            };
          }
          // Yenilenmiş token ile isteği tekrar gönder
          
        } catch (error) {
          // Token yenileme işleminde hata oluşursa, hata yönetimi yap
          throw new Error("Token refresh failed");
        }
      } else {
        // Token henüz süresi dolmadıysa, mevcut token ile isteği gönder
        if (config && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          } else {
            config = {
              ...config,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            };
          }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const refreshAccessToken = () => {
  const requestData = {
    grant_type: 'refresh_token',
    refresh_token: REFRESHT_OKEN,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };
  const encodedData = queryString.stringify(requestData);
  const headers = {
    "Content-Type": 'application/x-www-form-urlencoded',

  };
            
  axios.post('https://accounts.spotify.com/api/token', encodedData, { timeout: 10000 ,headers})
    .then(response => {
     
      // tokenData= parseTokenData(response.data.access_token)
     window.localStorage.setItem("access_token", response.data.access_token);
     window.localStorage.setItem("expires_in", response.data.expires_in);
      // Erişim tokenı, süresi ve yenileme tokenı gibi bilgileri kullanabilirsiniz
    })
    .catch(error => {
      // Hata yönetimi
      if (error.response) {
        // Sunucudan dönen hata durumu varsa
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // İstek gönderildi ama yanıt alınamadıysa
        console.log(error.request);
      } else {
        // Diğer hatalar
        console.log('Error', error.message);
      }
    });
};

function parseTokenData(token:any) {
  const base64Url = token.split('.')[0]; // Tokenı "." karakterine göre böler ve ikinci bölümü alır
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // URL güvenliği için bazı karakterlerin yerini değiştirir
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); // Base64'ü çözerek JSON verisini elde eder
  }).join(''));

  return JSON.parse(jsonPayload); // JSON verisini nesne olarak ayrıştırır
}
}
else if (Platform.OS === 'ios')
{
  let REFRESHT_OKEN:any;
  let accessToken:any;
  let tokenExpiration:any
    AsyncStorage.getItem("refresh_token").then(tokenRef => {
       REFRESHT_OKEN = tokenRef;
    // Diğer işlemler
  })
  .catch(error => {
    // Hata yönetimi
  });
  AsyncStorage.getItem("access_token").then(token => {
    accessToken = token;
 // Diğer işlemler
})
.catch(error => {
 // Hata yönetimi
});
AsyncStorage.getItem("expires_in").then(token => {
  tokenExpiration = token;
// Diğer işlemler
})
.catch(error => {
// Hata yönetimi
});
  axiosInstance.interceptors.request.use(
  
  
  async (config) => {
  
    // Token kontrolü ve yenileme işlemi
    if (accessToken) {
      // Token'in süresini kontrol et
      const currentTime:any = Date.now() / 1000;

      if (currentTime > tokenExpiration) {
        try {
          // Token'ı yenilemek için gerekli işlemleri yap
          // const refreshedToken = await refreshAccessToken();
         await refreshAccessToken();
          // Yeni token'ı kaydet       
          // // Yeni token'ın süresini kaydet
          // // const newExpiration = calculateNewExpirationTime();    

          // if (config && config.headers) {
          //   config.headers.Authorization = `Bearer ${refreshedToken}`;
          // } else {   
          //   config = {
          //     ...config,
          //     headers: {
          //       Authorization: `Bearer ${refreshedToken}`,
          //     },
          //   };
          // }
          // Yenilenmiş token ile isteği tekrar gönder
          
        } catch (error) {
          // Token yenileme işleminde hata oluşursa, hata yönetimi yap
          throw new Error("Token refresh failed");
        }
      } else {
        // Token henüz süresi dolmadıysa, mevcut token ile isteği gönder
        if (config && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          } else {
            config = {
              ...config,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            };
          }
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error);
  }
);
const refreshAccessToken = () => {
  const requestData = {
    grant_type: 'refresh_token',
    refresh_token: REFRESHT_OKEN,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };
  const encodedData = queryString.stringify(requestData);
  const headers = {
    "Content-Type": 'application/x-www-form-urlencoded',

  };
            
  axios.post('https://accounts.spotify.com/api/token', encodedData, { timeout: 10000 ,headers})
    .then(response => {

     const response_expires_in:any = response.data.expires_in

      // tokenData= parseTokenData(response.data.access_token)
     AsyncStorage.setItem("access_token", response.data.access_token);

     AsyncStorage.setItem("expires_in", response_expires_in.toString());
      // Erişim tokenı, süresi ve yenileme tokenı gibi bilgileri kullanabilirsiniz
    })
    .catch(error => {
      // Hata yönetimi
      if (error.response) {
        // Sunucudan dönen hata durumu varsa
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // İstek gönderildi ama yanıt alınamadıysa
        console.log(error.request);
      } else {
        // Diğer hatalar
        console.log('Error', error.message);
      }
    });
};

}
// Axios instance'ı export et
export default axiosInstance;


