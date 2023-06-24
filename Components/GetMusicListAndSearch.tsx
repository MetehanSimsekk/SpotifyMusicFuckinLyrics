import React from "react";
import { useEffect, useState,useRef } from 'react';
import { StyleSheet, Text,Button, View ,SafeAreaView,TextInput,FlatList,Alert,Image,AppRegistry,TouchableOpacity,TouchableHighlight } from 'react-native';
import { ArtistNames } from "../Models/artistModel";
import axios from 'axios';
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

var access_token  = window.localStorage.getItem("access_token")
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

  const [playlist, setPlaylist] = useState<ArtistNames[]>([]);  
  const [AllMusicUris, setUris] = useState<[]>([]);  
  let [searchQuery, setSearchQuery] = React.useState();
  const [search, setSearch] = useState('');
  const CLIENT_ID="081f04c9fc134332a54d2e1c567e7096";/*****/
  const CLIENT_SECRET="9be70720ac1044dbb78f3a10476978a9";/*****/
  const SPOTFY_AUTHORIZE_ENDPOINT="https://accounts.spotify.com/authorize"
  const REDIRECT_URI="http://localhost:19006/callback"
  const SCOPES=["user-library-read","playlist-modify-private","user-read-currently-playing","user-read-playback-state","user-modify-playback-state","app-remote-control"]


  useEffect(() => {
    const GetTrackData = async () => {
      try {
        const result = await axios.get(
          'https://api.spotify.com/v1/me/tracks',
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              Accept: "application/json",
              "Content-Type":"application/json"
            },
          }
        );
        setPlaylist(result.data.items);
       const uris = result.data.items.map((item:any) => item.track.uri); //Yalnızca item verileri içierisndne item track uriyi alır
      setUris(uris);
        
      } catch (error) {
        console.log("An error occurred while fetching the playlist:", error);
        axiosInstance;
        window.localStorage.setItem("access_token",'')
      }
    };
    GetTrackData();
  
  }, []);

  
  function GoToOpenMusic(trackInfoTrackId: any,index:number) {
    
    navigation.navigate('OpenMusicSelect', { track: trackInfoTrackId,index,PathURis:AllMusicUris,DataItems:playlist });
    
  }

  const updateSearch = (search:string) => {
    
    setSearch(search);
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

  return (
    <View>
      <Text>Search:</Text>
      <Searchbar
        placeholder="Search"
        onChangeText={updateSearch}
        value={query}
      />
      <FlatList
        data={letQuery==undefined || letQuery==""?playlist:searchQuery}
        renderItem={(RenderItem)}
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
