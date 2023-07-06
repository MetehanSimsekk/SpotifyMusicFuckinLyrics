import React from "react";
import { useEffect, useState,useRef } from 'react';
import { StyleSheet, Text,Button, View ,SafeAreaView,TextInput,FlatList,Alert,Image,AppRegistry,TouchableOpacity,TouchableHighlight } from 'react-native';
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

var access_token:any  = window.localStorage.getItem("access_token")
var refresh_token  = window.localStorage.getItem("refresh_token")

var device_id  = window.localStorage.getItem("device_id")
var query:any;
let letQuery:any;
var linkOfMusic;

console.log("Music"+window.location.href)

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
  // const [search, setSearch] = useState('');
  const CLIENT_ID="081f04c9fc134332a54d2e1c567e7096";/*****/
  const CLIENT_SECRET="9be70720ac1044dbb78f3a10476978a9";/*****/
  const SPOTFY_AUTHORIZE_ENDPOINT="https://accounts.spotify.com/authorize"
  const REDIRECT_URI="http://localhost:19006/callback"
  const SCOPES=["user-library-read","playlist-modify-private","user-read-currently-playing","user-read-playback-state","user-modify-playback-state","app-remote-control"]

  interface Song {
    [x: string]: any;
    name: string;
     track:[]

    // Diğer şarkı özellikleri
  }
  
  async function getLikedSongs(access_token: string): Promise<any> {
    const url = 'https://api.spotify.com/v1/me/tracks';
    const headers = {
      'Authorization': 'Bearer ' + access_token
    };
  
    let allLikedSongs: Song[]=[];
    // let allLikedSongs: any;

  
    try {
      let response: AxiosResponse<any> | null = null;
      let data: any = {};
  
      // İlk isteği yapma
      response = await axios.get(url, { headers });
      if (response) {
        data = response.data;
        allLikedSongs.push(...data.items);
       
      }
  
      // Sayfalama işlemi
      while (data.next) {
        response = await axios.get(data.next, { headers });
        if (response) {
          data = response.data;
          allLikedSongs.push(...data.items);
          setPlaylist(allLikedSongs)
          const uris:any=[];
         
            uris.push(allLikedSongs.map((item:any) => item.track.uri)); //Yalnızca item verileri içierisndne item track uriyi alır
          
          setUris(uris);
          console.log(uris)
        }
      }
    } catch (error) {
      console.error('Hata:', error);
    }
  
    // return allLikedSongs;
  }
  
  // Örnek kullanım
  // const access_token:any  = window.localStorage.getItem("access_token")
  
 
  
  useEffect(() => {
  //   const GetTrackData = async () => {
  //     try {
  //       const result = await axios.get(
  //         'https://api.spotify.com/v1/me/tracks',
  //         {
  //           headers: {
  //             Authorization: `Bearer ${access_token}`,
  //             Accept: "application/json",
  //             "Content-Type":"application/json"
  //           },
  //         }
  //       );
  //       setPlaylist(result.data.items);
  //       console.log(result.data.items)
  //      const uris = result.data.items.map((item:any) => item.track.uri); //Yalnızca item verileri içierisndne item track uriyi alır
  //     setUris(uris);
        
  //     } catch (error) {
  //       console.log("An error occurred while fetching the playlist:", error);
  //       window.localStorage.setItem("access_token",'')
  //     }
  //   };
  //  GetTrackData();
  
  
  
getLikedSongs(access_token);
}, []);
 // Verileri yükleme işlevi


  function GoToOpenMusic(trackInfoTrackId: any,index:number) {
    
    navigation.navigate('OpenMusicSelect', { track: trackInfoTrackId,index,PathURis:AllMusicUris,DataItems:playlist });
    
  }

  const updateSearch = (search:string) => {
    
    setSearch(search);
  };
   
  const filterData = (data:any, searchQuery:any) => {
    if (!searchQuery) {
      return data;
    }

    const filteredData = data.filter((item: any) => {

      // return item.track.name.toLowerCase().includes(searchQuery.toLowerCase());

        const lowerCaseQuery = searchQuery.toLowerCase();
      const lowerCaseName = item.track.name.toLowerCase();
      const lowerCaseArtist = item.track.artists[0].name.toLowerCase();
      return lowerCaseName.includes(lowerCaseQuery) || lowerCaseArtist.includes(lowerCaseQuery)
    });
    return filteredData;


    // const filteredData = data.filter((item:any) => {
    //   const lowerCaseQuery = searchQuery.toLowerCase();
    //   const lowerCaseName = item.track.name.toLowerCase();
    //   const lowerCaseArtist = item.track.artists[0].name.toLowerCase();
    //   lowerCaseName.includes(lowerCaseQuery) ||
    //   lowerCaseArtist.includes(lowerCaseQuery)
     
    // });
    // return (
    //   filteredData
    // );
  };

  const RenderItem = ({ item, index }: { item: any, index: number }) => {

    return (
      <SafeAreaView>
       
       
        <TouchableOpacity onPress={() => GoToOpenMusic(item.track.id,index)} style={{marginTop:30,borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth}}>
        <Text>{item.track.name+'*'}</Text>
        <Text>{item.track.artists[0].name}</Text>
        </TouchableOpacity>  
    
        {/* <Input /> */}
      </SafeAreaView>
    )
  }
  const filteredPlaylist = filterData(playlist, searchQuery);

  return (
    <View>
      <Text>Search:</Text>
      {/* <Searchbar
        placeholder="Search"
        onChangeText={updateSearch}
        value={query}
      />
      <FlatList
        data={letQuery==undefined || letQuery==""?playlist:search}
        renderItem={(RenderItem)}
      /> */}
        <Searchbar
        placeholder="Search"
        onChangeText={updateSearch}
        value={searchQuery}
      />
      <FlatList
        data={filteredPlaylist}
        renderItem={RenderItem}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    width: 200,
    height: 40,
  },
});



export default SpotifyLikedMusicScreen;


