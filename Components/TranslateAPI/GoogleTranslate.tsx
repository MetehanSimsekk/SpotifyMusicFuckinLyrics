import { Platform } from 'react-native';


const ApiForTranslate =()=>
{ 
 
const apikey = 'AIzaSyAzjmc6RDYw5yYLwoDC6b29i45_P1EAv2U';




if(Platform.OS === 'web')
{
window.localStorage.setItem("apiKeyForTranslate",apikey)

}
}
export default ApiForTranslate();