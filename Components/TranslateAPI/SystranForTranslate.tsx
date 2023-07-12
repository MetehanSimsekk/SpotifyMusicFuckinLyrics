
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';


const ApiForSystranTranslate =()=>
{ 
 
const key = '589340c5-c866-474b-8ee4-c4464e5fd303';




if(Platform.OS === 'web')
{
window.localStorage.setItem("apiKeyForSystran",key)

}
else if(Platform.OS === 'ios')
{
AsyncStorage.setItem("apiKeyForSystran",key)

}
}
export default ApiForSystranTranslate();