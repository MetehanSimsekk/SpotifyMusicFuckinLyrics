import React from "react";
import { useEffect, useState } from 'react';
import { StyleSheet, Text,Button, View,FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import axios from 'axios';
// type SearchBarComponentProps = {};

var access_token  = window.localStorage.getItem("access_token")


const SearchBar = () => {

  const [searchQuery, setSearchQuery] = React.useState("");
  

  const onChangeSearch =   async (query:any) => {
 
    const result = await axios.get(
      'https://api.spotify.com/v1/search?'+"q=remaster%2520track%3A"+query+"%2520artist%3A"+query+"%2520"+query+"&type=track", 
      {
        
        headers: {
          Authorization: `Bearer ${access_token}`, 
          Accept: "application/json",
         "Content-Type":"application/json"
        
        },
        
      }
    );


    setSearchQuery(result.data.items);
  };
  
  
  return (
    <View>  
    <Searchbar
      placeholder="Search"
      onChangeText={onChangeSearch}
      value={searchQuery}
    />    
   </View>
  );


  
};  

export default SearchBar;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  