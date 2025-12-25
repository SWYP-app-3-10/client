import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RouteNames } from '../../../routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components';
// ✅ 공통 디자인 시스템
import {
  COLORS,
  BORDER_RADIUS,
  scaleWidth,
  Caption_12M,
} from '../../styles/global';
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
            width: scaleWidth(50), // 버튼 너비(스케일 적용)
            height: scaleWidth(50), // 버튼 높이(스케일 적용)
            alignSelf: 'flex-end', // 오른쪽 끝 정렬
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
    flex: 1, // 화면 전체 높이 차지
    justifyContent: 'center', // 세로 방향 가운데 정렬
    alignItems: 'center', // 가로 방향 가운데 정렬
    backgroundColor: COLORS.white, // 배경색(디자인 시스템)
  },

  buttonArea: {
    marginTop: scaleWidth(20), // 상단 여백
    width: '80%', // 버튼 영역 폭(임시)
  },

  button: {
    height: scaleWidth(44), // 버튼 높이
    borderRadius: BORDER_RADIUS[10] ?? scaleWidth(10), // 모서리 라운드(토큰 없으면 스케일로)
    backgroundColor: COLORS.black, // 배경색(디자인 시스템)
    justifyContent: 'center', // 텍스트 세로 중앙
    alignItems: 'center', // 텍스트 가로 중앙
    marginBottom: scaleWidth(10), // 버튼 간 간격
  },

  buttonText: {
    ...Caption_12M, // 텍스트 타이포(디자인 시스템)
    color: COLORS.white, // 텍스트 색상
  },
});
