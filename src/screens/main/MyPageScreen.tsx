import React from 'react';
import { Text, View, Alert } from 'react-native';
import { Button } from '../../components';
import { RouteNames } from '../../../routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MyPageStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { clearAllAuthData } from '../../services/authService';
import { useOnboardingStore } from '../../store/onboardingStore';

const MyPageScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MyPageStackParamList>>();
  const resetOnboarding = useOnboardingStore(state => state.resetOnboarding);

  // 개발용: 로그인 정보 초기화
  const handleClearLogin = async () => {
    Alert.alert(
      '로그인 초기화',
      '모든 로그인 및 온보딩 정보를 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            await clearAllAuthData();
            await resetOnboarding();
            Alert.alert(
              '완료',
              '로그인 정보가 초기화되었습니다.\n앱을 재시작하세요.',
            );
          },
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>MyPageScreen</Text>
      <Text>마이페이지</Text>
      <Button
        title="공통 컴포넌트 쇼케이스"
        onPress={() => navigation.navigate(RouteNames.COMPONENT_SHOWCASE)}
      />
      {/* 개발용: 로그인 초기화 버튼 */}
      {__DEV__ && (
        <Button
          title="로그인 정보 초기화"
          onPress={handleClearLogin}
          variant="outline"
          style={{ marginTop: 20 }}
        />
      )}
    </View>
  );
};

export default MyPageScreen;
