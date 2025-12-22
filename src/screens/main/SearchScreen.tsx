import {Text, View} from 'react-native';
//import SearchStackNavigator from '../../navigation/SearchStackNavigator';

/**
 * [ MainTab에서 연결되는 'Search 메인' - 엔트리 ]
 * - 화면 전환(Explore <-> SearchInput)은 SearchStackNavigator가 담당
 * - ui/로직 파일들은 ./search/ 에서 관리
 */
const SearchScreen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>SearchScreen</Text>
      <Text>검색 페이지</Text>
    </View>
  );
};

export default SearchScreen;
