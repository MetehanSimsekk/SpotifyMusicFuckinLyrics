import React from "react";
import { useEffect, useState,useRef } from 'react';
import { StyleSheet, Text,Button, View ,SafeAreaView,TextInput,FlatList,Alert,Image,AppRegistry,TouchableOpacity,TouchableHighlight,ScrollView,RefreshControl  } from 'react-native';
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
  const [flag,setFlag]=useState(false)
  const refreshFlatList = () => {
    setShouldRefresh(!shouldRefresh);
  };
  interface Song {
    [x: string]: any;
     track:{
      id:any
      artists:any
      name:any
     }
   
    // Diğer şarkı özellikleri
  }


   async function getLikedSongs(access_token: string): Promise<any> {
    const url = 'https://api.spotify.com/v1/me/tracks';
    const headers = {
      'Authorization': 'Bearer ' + access_token
    };
  
    let allLikedSongs: Song[]=[];
    // let allLikedSongs: any;
    const uris:any=[];
  
    try {
      let response: AxiosResponse<any> | null = null;
      let data: any = {};
  
      // İlk isteği yapma
      response = await axios.get(url, { headers });
      if (response ) {
        data = response.data;
        allLikedSongs.push(...data.items);
        
     
      }
  
      while (data.next) {
        response = await axios.get(data.next, { headers });
        if (response) {
       
          data = response.data;
          
          allLikedSongs.push(...data.items);
          
          uris.push(allLikedSongs.map((item:any) => item.track.uri)); //Yalnızca item verileri içierisndne item track uriyi alır
          
          setUris(uris);
          setPlaylist(allLikedSongs)
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

  
 
getLikedSongs(access_token);
}, [access_token]);
 // Verileri yükleme işlevi


  function  GoToOpenMusic(trackInfoTrackId: any,index:number) {
    
    navigation.navigate('OpenMusicSelect', { track: trackInfoTrackId,index,PathURis:AllMusicUris,DataItems:playlist });
    
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
    loadMoreData()
    setIsRefreshing(false);
    // Burada verilerinizi yenileyen kodları ekleyin
    // Örneğin, getLikedSongs(access_token) gibi bir işlevi çağırabilirsiniz
    // Veriler yüklendikten sonra setIsRefreshing(false) ile sayfa yenilenmiş olarak işaretleyin
  };
  
    
  const RenderItem = ({ item, index }: { item: Song, index: number }) => {
 
  
    return (
      <TouchableOpacity
        onPress={() => GoToOpenMusic(item.track.id, index)}
      >
        <Text key={item.track.id}>{item.track.name + '*'}</Text>
        <Text>{item.track.artists[0].name}</Text>
      </TouchableOpacity>
    );
  };
  const filteredPlaylist = filterData(playlist, searchQuery);

  const loadMoreData = async () => {
    // Yeni verileri yükleme işlemi burada yapılabilir.
    // Örnek: Daha fazla şarkı yüklemek için getLikedSongs işlevini çağırabilirsiniz.
    

    
    getLikedSongs(access_token)
  };
 
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={updateSearch}
        value={searchQuery}
      />

      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshData} />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isEndReached =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 50;
          if (isEndReached) {
            loadMoreData();
          }
        }}
      >
        {filteredPlaylist.map((item: Song, index: number) => (
          <TouchableOpacity
            key={item.track.id}
            onPress={() => GoToOpenMusic(item.track.id, index)}
            style={styles.listItem}
          >
            <Text style={styles.songName}>{item.track.name}</Text>
            <Text style={styles.artistName}>
              {item.track.artists[0].name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Arka plan rengini ayarlayın
  },
  scrollViewContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  listItem: {
    backgroundColor: '#f9f9f9', // Liste öğesi arka plan rengini ayarlayın
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  songName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Şarkı adı rengini ayarlayın
  },
  artistName: {
    fontSize: 14,
    color: '#666', // Sanatçı adı rengini ayarlayın
  },
});



export default SpotifyLikedMusicScreen;


