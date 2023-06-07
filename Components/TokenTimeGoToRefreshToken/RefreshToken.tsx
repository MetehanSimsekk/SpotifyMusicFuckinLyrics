import axios from "axios";

const axiosInstance = axios.create();
let tokenData:any; 
const CLIENT_ID="081f04c9fc134332a54d2e1c567e7096";/*****/
const CLIENT_SECRET="9be70720ac1044dbb78f3a10476978a9";/*****/
const REFRESHT_OKEN = window.localStorage.getItem("refresh_token");

axiosInstance.interceptors.request.use(
  
  
  async (config) => {
    alert("inter")
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
  
  axios.post('https://accounts.spotify.com/api/token', requestData)
    .then(response => {
     
      tokenData= parseTokenData(response)
     window.localStorage.setItem("access_token", response.data.access_token);
     window.localStorage.setItem("expires_in", response.data.expires_in);
      // Erişim tokenı, süresi ve yenileme tokenı gibi bilgileri kullanabilirsiniz
    })
    .catch(error => {
      // Hata yönetimi
    });
};
// function calculateNewExpirationTime() {
//  const accessToken = window.localStorage.getItem("access_token");
//    tokenData // Token'dan gerekli bilgileri ayrıştırma işlemi

//   const currentTime = Math.floor(Date.now() / 1000); // Şu anki zamanı saniye cinsinden al
//   const newExpiration = currentTime + tokenData.expires_in; // Yeni süreyi hesapla

//   return newExpiration;
// }

function parseTokenData(token:any) {
  const base64Url = token.split('.')[1]; // Tokenı "." karakterine göre böler ve ikinci bölümü alır
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // URL güvenliği için bazı karakterlerin yerini değiştirir
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); // Base64'ü çözerek JSON verisini elde eder
  }).join(''));

  return JSON.parse(jsonPayload); // JSON verisini nesne olarak ayrıştırır
}
// Axios instance'ı export et
export default axiosInstance;


