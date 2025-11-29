import {Text, TouchableOpacity, View} from 'react-native';

const HomeScreen1 = ({navigation}: {navigation: any}) => {
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('test222')}>
        <Text>버튼으로 이동</Text>
      </TouchableOpacity>
    </View>
  );
};
export default HomeScreen1;
