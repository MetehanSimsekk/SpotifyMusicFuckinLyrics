
import axios from 'axios';
import React from "react";

let letQuery;
var access_token  = window.localStorage.getItem("access_token")

const GetTrackDataWithSearch =   async (query:any) => {
    let [searchQuery, setSearchQuery] = React.useState();
    letQuery = query;

    const result = await axios.get(
      'https://api.spotify.com/v1/search?'+"q=remaster%2520track="+query+"&type=track", 
      {
        
        headers: {
          Authorization: `Bearer ${access_token}`, 
          Accept: "application/json",
         "Content-Type":"application/json"
        
        },
        
      }
    );
    
    setSearchQuery(result.data.tracks.items);
    console.log(result.data.items)
   
  };
  export default GetTrackDataWithSearch;