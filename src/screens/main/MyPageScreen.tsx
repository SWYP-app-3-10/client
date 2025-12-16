import React from 'react';
import {Text, View} from 'react-native';
import {Button} from '../../components';
import {RouteNames} from '../../../routes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MyPageStackParamList} from '../../navigation/types';
import {useNavigation} from '@react-navigation/native';
const MyPageScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MyPageStackParamList>>();
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>MyPageScreen</Text>
      <Text>마이페이지</Text>
      <Button
        title="공통 컴포넌트 쇼케이스"
        onPress={() => navigation.navigate(RouteNames.COMPONENT_SHOWCASE)}
      />
    </View>
  );
};

export default MyPageScreen;
