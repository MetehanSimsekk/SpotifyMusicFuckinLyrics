import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Image, StyleSheet } from 'react-native';

const countries = [
  { code: 'TR', flag: require('../assets/flags/tr.png') },
  // Diğer ülkeleri buraya ekleyin
];

const CountryButton = ({ onPress }:{ onPress:any }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>Ülkelerin Kodları</Text>
    </TouchableOpacity>
  );
};

const CountryListModal = ({ visible, onClose }:{ visible:any, onClose:any }) => {
  const renderCountry = ({ item }:{ item:any }) => {
    return (
      <View style={styles.countryContainer}>
        <Image source={item.flag} style={styles.flagImage} />
        <Text style={styles.countryCode}>{item.code}</Text>
      </View>
    );
  };

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <FlatList data={countries} keyExtractor={(item) => item.code} renderItem={renderCountry} />
      </View>
    </Modal>
  );
};

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <CountryButton onPress={openModal} />

      <CountryListModal visible={modalVisible} onClose={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'blue',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  flagImage: {
    width: 24,
    height: 16,
    marginRight: 10,
  },
  countryCode: {
    fontSize: 16,
  },
});

export default App;
