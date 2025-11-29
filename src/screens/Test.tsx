import {TouchableOpacity} from 'react-native';

const Test = ({navigation}: {navigation: any}) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Test1')}>
      버튼으로 이동
    </TouchableOpacity>
  );
};

export default Test;
