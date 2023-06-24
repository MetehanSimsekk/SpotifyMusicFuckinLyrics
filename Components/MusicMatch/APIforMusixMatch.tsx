import { Platform } from 'react-native';


const ApiForMusixMatch =()=>
{ 
 
const apikey = '9f5f1511ac23bed2174f7df609afa67c';
const baseURL = 'https://api.musixmatch.com/ws/1.1';



if(Platform.OS === 'web')
{
window.localStorage.setItem("apiKey",apikey)
window.localStorage.setItem("baseURL",baseURL)
}
}
export default ApiForMusixMatch();