import React, { useMemo } from "react";
import { useEffect, useState,useRef } from 'react';
import { StyleSheet, Text,Button, View ,SafeAreaView,TextInput,FlatList,Alert,Image,AppRegistry,TouchableOpacity,TouchableHighlight,ScrollView,RefreshControl, ActivityIndicator, Vibration ,Modal } from 'react-native';
import { ArtistNames } from "../Models/artistModel";
import axios, { AxiosResponse } from 'axios';
import SearchBar from "../Components/Search";
import { Searchbar } from "react-native-paper";
import Input from '../Components/InputValue';
import OpenMusicSelect from "../Components/OpenMusic";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HandleOpenSong from "../Components/OpenMusic";
import GetTrackDataWithSearch from "../Components/SearchMusic";
// import InputRange from "../Components/InputValue";
 import DualSlider from "../Components/SliderEffectsReal";
 import { NavigationContainerRef,ParamListBase,NavigationContainer  } from '@react-navigation/native';
 import * as Progress from 'react-native-progress';
import Slider from "@react-native-community/slider";
import axiosInstance from "./TokenTimeGoToRefreshToken/RefreshToken";
const APP_NAME = 'SpotifyLikedMusicScreen';
import { Platform } from 'react-native';
import APIRun from "./API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FixedSizeList } from 'react-window';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

let device_id:any ="";
let access_token:any ="";
let refresh_token:any ="";
let expires_in:number;

if(Platform.OS === 'web')
{
   access_token  = window.localStorage.getItem("access_token")
   refresh_token  = window.localStorage.getItem("refresh_token")  
   
   device_id  = window.localStorage.getItem("device_id")
}
else if (Platform.OS === 'ios')
{
  AsyncStorage.getItem('access_token')
  .then(token => {
    access_token = token;
    // Diğer işlemler
  
  })
  .catch(error => {
    // Hata yönetimi
  });

AsyncStorage.getItem('refresh_token')
  .then(tokenz => {
    refresh_token = tokenz;
    // Diğer işlemler
  })
  .catch(error => {
    // Hata yönetimi

  });

AsyncStorage.getItem('device_id')
  .then(id => {
    device_id = id;
    // Diğer işlemler
  })
  .catch(error => {
    // Hata yönetimi

  });
  AsyncStorage.getItem('expires_in')
  .then(id => {
    
      expires_in= Number(id);

    // Diğer işlemler
  })
  .catch(error => {
    // Hata yönetimi

  });
}
else if (Platform.OS === 'android')
{
  AsyncStorage.getItem('access_token')
  .then(token => {
    access_token = token;
    // Diğer işlemler
  
  })
  .catch(error => {
    // Hata yönetimi
  });

AsyncStorage.getItem('refresh_token')
  .then(tokenz => {
    refresh_token = tokenz;
    // Diğer işlemler
  })
  .catch(error => {
    // Hata yönetimi

  });

AsyncStorage.getItem('device_id')
  .then(id => {
    device_id = id;
    // Diğer işlemler
  })
  .catch(error => {
    // Hata yönetimi

  });
  AsyncStorage.getItem('expires_in')
  .then(id => {
    
      expires_in= Number(id);

    // Diğer işlemler
  })
  .catch(error => {
    // Hata yönetimi

  });
}
var query:any;
let letQuery:any;
var linkOfMusic;



const Stack = createNativeStackNavigator();

const params = {
  "device_id": device_id
};

const SpotifyLikedMusicScreen = ({navigation}:{navigation:any}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(true);
  const [loadMoreData, setLoadMoreData] = useState(true);
  const [IsEndReachedFlag, setIsEndReached] = useState(false);
  const [playlist, setPlaylist] = useState<Song[]>([]);  
  const [AllMusicUris, setUris] = useState<[]>([]);  
  // let [searchQuery, setSearchQuery] = React.useState();
  const [searchQuery, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const [search, setSearch] = useState('');
  const CLIENT_ID="081f04c9fc134332a54d2e1c567e7096";/*****/
  const CLIENT_SECRET="9be70720ac1044dbb78f3a10476978a9";/*****/
  const SPOTFY_AUTHORIZE_ENDPOINT="https://accounts.spotify.com/authorize"
  const REDIRECT_URI="http://localhost:19006/callback"
  const SCOPES=["user-library-read","playlist-modify-private","user-read-currently-playing","user-read-playback-state","user-modify-playback-state","app-remote-control"]
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [flag,setFlag]=useState(true)
  const refreshFlatList = () => {
    setShouldRefresh(!shouldRefresh);
  };
  interface Song {
    [x: string]: any;
     track:{
      id:any
      artists:any
      name:any
      album:any
     }
   
    // Diğer şarkı özellikleri
  }

let i=0;

   async function getLikedSongs(access_token: string): Promise<any> {
    const url = 'https://api.spotify.com/v1/me/tracks';
    const headers = {
      'Authorization': 'Bearer ' + access_token
      
    };
    let allLikedSongs: Song[]=[];
    // let allLikedSongs: any;
    const uris:any=[];
  
    try {
      //alert("girdi1")
      let response: AxiosResponse<any> | null = null;
      let data: any = {};
     
      // İlk isteği yapma
      await new Promise(resolve => setTimeout(resolve, 1000));
      response = await axios.get(url, { headers });
      if (response && initialLoadComplete) {
        //alert("girdi2")
        data = response.data;
       allLikedSongs.push(...data.items);
        // setPlaylist(allLikedSongs)
        
        setInitialLoadComplete(false);
       
        
      }
     
      while (data.next) {
       
      if(loadMoreData)
      {
        response = await axios.get(data.next, { headers });
        
        if (response) {
          
          data = response.data;
          
          allLikedSongs.push(...data.items);
          
          setPlaylist(allLikedSongs)
          uris.push(allLikedSongs.map((item:any) => item.track.uri)); //Yalnızca item verileri içierisndne item track uriyi alır
          
          setUris(uris);
          setIsLoading(false)
          
        }
        
      }
    }
    
  } 
    catch (error:any) {
      if(error=="Error: Request failed with status code 404")
          {
            APIRun()
          }
          else{
           axiosInstance.get("");
            
          }
    }
    
  }
 
  
  useEffect(() => {

setLoadMoreData(true)
getLikedSongs(access_token);

}, [access_token]);
 // Verileri yükleme işlevi


  function GoToOpenMusic(trackInfoTrackId: any,index:number) {
    console.log("Uris göndermelisin pathuris yerine track uris")
    navigation.navigate('OpenMusicSelect', { track: trackInfoTrackId,index,DataItems:playlist });
    
  }

  const updateSearch = (search:string) => {
    
    setSearch(search);
  };
   
 




  const filterData = (data:any, searchQuery:any) => {
    if (!searchQuery) {
     
      return data;
    }

     const  filteredData = data.filter((item: any) => {
     
      // return item.track.name.toLowerCase().includes(searchQuery.toLowerCase());
     
      const lowerCaseQuery = searchQuery.toLowerCase();
      const lowerCaseName = item.track.name.toLowerCase();
      const lowerCaseArtist = item.track.artists[0].name.toLowerCase();
      return lowerCaseName.includes(lowerCaseQuery) || lowerCaseArtist.includes(lowerCaseQuery)
    });
   
    return filteredData;

  };
  const refreshData = () => {
    setIsRefreshing(true); // Sayfa yenileniyor olarak işaretleyin
    loadMoreDataTrigger()
    setIsRefreshing(false);
    // Burada verilerinizi yenileyen kodları ekleyin
    // Örneğin, getLikedSongs(access_token) gibi bir işlevi çağırabilirsiniz
    // Veriler yüklendikten sonra setIsRefreshing(false) ile sayfa yenilenmiş olarak işaretleyin
  };
  
    
  // const RenderItem = ({ item, index }: { item: Song, index: number }) => {
 
  
  //   return (
  //     <TouchableOpacity
  //       onPress={() => GoToOpenMusic(item.track.id, index)}
  //     >
  //       <Text key={item.track.id}>{item.track.name + '*'}</Text>
  //       <Text>{item.track.artists[0].name}</Text>
  //     </TouchableOpacity>
  //   );
  // };
  const filteredPlaylist = filterData(playlist, searchQuery);

  // const loadMoreData = async () => {
  //   // Yeni verileri yükleme işlemi burada yapılabilir.
  //   // Örnek: Daha fazla şarkı yüklemek için getLikedSongs işlevini çağırabilirsiniz.
     const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  //   getLikedSongs(access_token)
  // };
  const handleLongPress = () => {
    // Haptic feedback ekleyerek cihazın titremesini sağla
  toggleModal();

   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const loadMoreDataTrigger = () => {
   //alert("loadMoreDataTrigger")
    setLoadMoreData(true); // İkinci yükleme işlemi başladı
  };

  const memoizedData = useMemo(() => filteredPlaylist, [filteredPlaylist]);


  return (
    <LinearGradient
    colors={['black']}
          style={[{ backgroundColor: "black", zIndex: -999999999999999999, height: 920 },styles.container]}
          // start={{ x: 0.5, y: 0 }}
          // end={{ x: 0.5, y: 1 }}
  >
   
    
   {isLoading ? (
    // Bekleme görseli
    <View style={styles.loadingContainer}>
      
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
  ) : (
    
    
    <ScrollView
      contentContainerStyle={styles.scrollViewContainer}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refreshData} />
      }
      
      onScroll={({ nativeEvent }) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        const isEndReached =
          layoutMeasurement.height + contentOffset.y >=
          contentSize.height - 1350;
        if (isEndReached && !IsEndReachedFlag) {
          setIsEndReached(true);
          alert(isEndReached)
          loadMoreDataTrigger();
        }
      }}
      scrollEventThrottle={20}
    > 
      <Searchbar
  placeholder="Search"
  onChangeText={updateSearch}
  value={searchQuery}
  style={styles.searchbar}
/>
      {memoizedData.map((item: Song, index: number) => (
        
  <TouchableOpacity
    key={item.track.id}
    onPress={() => GoToOpenMusic(item.track.id, index)}
    style={styles.listItem}
 delayLongPress={100}
  onLongPress={handleLongPress}
  >
    {/* <Image
      source={{ uri: item.track.album.images[0]?.url || '' }} 
      style={styles.albumCover}
     
    /> */}
    <Image
  source={{ uri: item.track.album.images[0]?.url || '' }}
  style={styles.albumCover}
  resizeMode="cover"
  // placeholderSource={require('../path/to/placeholder.png')}
/>
    <View style={styles.textContainer}>
      <Text style={styles.songName}>{item.track.name}</Text>
      <Text style={styles.artistName}>
        {item.track.artists[0]?.name || ''} 
      </Text>
    </View>
      
  </TouchableOpacity>
  
))}

 <Modal transparent={true} visible={isModalVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>This is a modal</Text>
            <Button title="Close Modal" onPress={toggleModal} />
          </View>
        </View>
      </Modal>

    </ScrollView>
    )}
  </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  scrollViewContainer: {

    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  listItem: {
    backgroundColor: 'orange',
    borderRadius: 16,
    paddingVertical: 10, // Önceki değeri azaltabilirsiniz
    paddingHorizontal: 10, // Önceki değeri azaltabilirsiniz
    marginBottom: 15, // İstediğiniz boşluğa göre ayarlayabilirsiniz
    flexDirection: 'row',
    alignItems: 'center',
  },
  albumCover: {
    width: 60, // Önceki değeri azaltabilirsiniz
    height: 60, // Önceki değeri azaltabilirsiniz
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  }, 
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)', // Bu renk transparan siyah bir arka plan sağlar
  },
  modalContent: {
    width: 200, // İstediğiniz genişliği ayarlayın
    height: 200, // İstediğiniz yüksekliği ayarlayın
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songName: {
    fontSize: 16, // Önceki değeri azaltabilirsiniz
    fontWeight: 'bold',
    color: '#fff',
  },
  artistName: {
    fontSize: 14, // Önceki değeri azaltabilirsiniz
    color: '#ccc',
  },
  actionButton: {
    width: 80,
    height: 32,
    backgroundColor: '#ff4a57',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  }, loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchbar: {
    margin: 16, // Arama çubuğunun dört tarafına boşluk ekler
  },
});



export default SpotifyLikedMusicScreen;


