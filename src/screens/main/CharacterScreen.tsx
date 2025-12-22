import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RouteNames } from '../../../routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components';
import { scaleWidth } from '../../styles/global';
import {
  MainTabNavigationProp,
  CharacterStackParamList,
} from '../../navigation/types';

/**
 * CharacterScreen
 *
 * - 캐릭터 탭의 메인 진입 화면
 * - 하위 화면(레벨 기준 / 포인트·경험치 내역 / 알림)으로 이동하는 버튼 제공
 */
const CharacterScreen = () => {
  /** CharacterStack 내에서 화면 이동을 위한 네비게이션 */
  const navigation =
    useNavigation<MainTabNavigationProp<CharacterStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      {/* 임시 텍스트(추후 캐릭터/레벨 UI로 교체 가능) */}
      <Text>CharacterScreen</Text>
      <Text>캐릭터 페이지</Text>

      {/* 하위 화면 이동 버튼 영역 */}
      <View style={styles.buttonArea}>
        {/* 레벨 기준 확인 화면 이동 */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate(RouteNames.CHARACTER_CRITERIA)}
        >
          <Text style={styles.buttonText}>레벨 기준 확인</Text>
        </TouchableOpacity>

        {/* 포인트/경험치 내역 화면 이동 */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate(RouteNames.CHARACTER_POINT_HISTORY)
          }
        >
          <Text style={styles.buttonText}>포인트/경험치 내역</Text>
        </TouchableOpacity>
        <Button
          title="알림 페이지로"
          variant="primary"
          style={{
            width: scaleWidth(50),
            height: scaleWidth(50),
            alignSelf: 'flex-end',
          }}
          onPress={() => {
            navigation.navigate(RouteNames.CHARACTER_NOTIFICATION);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default CharacterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonArea: {
    marginTop: 20,
    width: '80%',
  },
  button: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
