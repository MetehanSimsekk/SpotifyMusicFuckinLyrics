import { FlatList, Image ,TouchableOpacity,View,Text} from 'react-native';

const CustomSelectList = ({ data, setSelected }:{ data:any, setSelected :any}) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => setSelected(item.key)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
            <Image source={item.flag} style={{ width: 30, height: 20, marginRight: 8 }} />
            <Text>{item.value}</Text>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.key}
    />
  );
};
export default CustomSelectList;