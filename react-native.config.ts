import path from 'path'

module.exports = {

  assets: ['./node_modules/react-native-vector-icons/fonts'],
  dependencies: {
    'spotify-ios-sdk': {
      root: path.resolve(__dirname, 'ios/spotify-ios-sdk')
    }
  }
};

