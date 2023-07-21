// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
// import Sound from 'react-native-sound';

// const musicFilePath = 'path_to_your_music_file.mp3'; // Müzik dosyasının yolu
// const lyricsData = [
//   { time: 10000, lyric: 'I feel it in my fingers' },
//   { time: 15000, lyric: 'I feel it in my toes' },
//   // Diğer sözler ve zamanlar buraya eklenebilir
// ];

// const LyricsComponent = ({ musicIsPlaying }) => {
//   const [currentTime, setCurrentTime] = useState(0);
//   const [lyricsIndex, setLyricsIndex] = useState(0);
//   const [modalVisible, setModalVisible] = useState(false);

//   useEffect(() => {
//     const sound = new Sound(musicFilePath, Sound.MAIN_BUNDLE, (error) => {
//       if (error) {
//         console.log('Error loading sound:', error);
//         return;
//       }
//       sound.play((success) => {
//         if (success) {
//           console.log('Sound played successfully');
//         } else {
//           console.log('Error playing sound');
//         }
//       });
//     });

//     const interval = setInterval(() => {
//       if (musicIsPlaying) {
//         sound.getCurrentTime((seconds) => {
//           setCurrentTime(seconds * 1000);
//         });
//       }
//     }, 100);

//     return () => {
//       clearInterval(interval);
//       sound.stop();
//       sound.release();
//     };
//   }, [musicIsPlaying]);

//   useEffect(() => {
//     const nextLyricIndex = lyricsData.findIndex((item) => item.time > currentTime);
//     setLyricsIndex(nextLyricIndex > 0 ? nextLyricIndex - 1 : 0);
//   }, [currentTime]);

//   const handleLyricPress = () => {
//     setModalVisible(true);
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <TouchableOpacity onPress={handleLyricPress}>
//         <Text style={{ fontSize: 20 }}>{lyricsData[lyricsIndex].lyric}</Text>
//       </TouchableOpacity>
//       <Modal animationType="slide" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
//         <View style={styles.modalContainer}>
//           <Text style={styles.modalLyricsText}>{lyricsData[lyricsIndex].lyric}</Text>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     paddingHorizontal: 20,
//     paddingVertical: 40,
//   },
//   modalLyricsText: {
//     fontSize: 24,
//     textAlign: 'center',
//   },
// });

// export default LyricsComponent;
