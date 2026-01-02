import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RouteNames } from '../../../routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'; // 추가

import {
  COLORS,
  scaleWidth,
  BORDER_RADIUS,
  Heading_20EB_Round,
  Body_16R,
  Caption_14R,
  Heading_24EB_Round,
  Caption_12M,
  Heading_18EB_Round,
} from '../../styles/global';
import { Button, MissionCard } from '../../components';
import IconButton from '../../components/IconButton';
import {
  CharacterStackParamList,
  MainTabNavigationProp,
} from '../../navigation/types';
import { levelList } from '../../screens/character/criteria/level/levelData';
import Spacer from '../../components/Spacer';
import LottieView from 'lottie-react-native';
import {
  Check_3DIcon,
  InfoIcon,
  Level_1_Tooltip,
  Level_2_Tooltip,
  Level_3_Tooltip,
  Level_4_Tooltip,
  Level_5_Tooltip,
  RightArrowIcon,
  ProgressBarIcon,
  AlarmIcon,
} from '../../icons';
import { Body_15M, Heading_16B } from '../../styles/typography';
import { useCharacterData, useAttendanceData } from '../../hooks/useCharacter';
import { useMissions } from '../../hooks/useMissions';
import { usePointStore } from '../../store/pointStore';
import { ActivityIndicator } from 'react-native';
import { useExperienceStore } from '../../store/experienceStore';

const CharacterScreen = () => {
  const rootNavigation =
    useNavigation<MainTabNavigationProp<CharacterStackParamList>>();
  const tabBarHeight = useBottomTabBarHeight(); // 탭바 높이

  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // React Query hooks
  const {
    data: characterData,
    isLoading: characterLoading,
    error: characterError,
  } = useCharacterData();

  const {
    data: attendanceData = [],
    isLoading: attendanceLoading,
    error: attendanceError,
  } = useAttendanceData();

  const {
    data: missions = [],
    isLoading: missionsLoading,
    error: missionsError,
  } = useMissions();

  // 포인트는 전역 스토어에서 가져오기
  const { points: currentPoints } = usePointStore();
  const { experience } = useExperienceStore();
  // 기본값 설정
  const currentLevel = characterData?.currentLevel ?? 1;
  const currentExp = experience ?? 0;
  const nextLevelExp = characterData?.nextLevelExp ?? 100;

  // 메모이제이션: 레벨 데이터
  const currentLevelData = useMemo(
    () => levelList.find(l => l.id === currentLevel),
    [currentLevel],
  );

  // 메모이제이션: 레벨에 맞는 툴팁 컴포넌트
  const LevelTooltip = useMemo(() => {
    switch (currentLevel) {
      case 1:
        return Level_1_Tooltip;
      case 2:
        return Level_2_Tooltip;
      case 3:
        return Level_3_Tooltip;
      case 4:
        return Level_4_Tooltip;
      case 5:
        return Level_5_Tooltip;
      default:
        return Level_1_Tooltip;
    }
  }, [currentLevel]);

  // 메모이제이션: 진행률 계산
  const progressPercentageValue = useMemo(
    () => Math.round((currentExp / nextLevelExp) * 100),
    [currentExp, nextLevelExp],
  );

  // 로딩 상태
  const isLoading = characterLoading || attendanceLoading || missionsLoading;
  const hasError = characterError || attendanceError || missionsError;

  // 캐릭터 정보 클릭 핸들러
  const handleCharacterInfoPress = useCallback(() => {
    // 기존 타이머가 있으면 제거
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
    }

    // 툴팁 표시
    setShowTooltip(true);

    // 1500ms 후 툴팁 숨기기
    tooltipTimerRef.current = setTimeout(() => {
      setShowTooltip(false);
      tooltipTimerRef.current = null;
    }, 1500);
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
    };
  }, []);

  // 네비게이션 핸들러들 메모이제이션
  const handleNavigateToNotification = useCallback(() => {
    rootNavigation.navigate(RouteNames.FULL_SCREEN_STACK, {
      screen: RouteNames.CHARACTER_NOTIFICATION,
    });
  }, [rootNavigation]);

  const handleNavigateToCriteria = useCallback(() => {
    rootNavigation.navigate(RouteNames.FULL_SCREEN_STACK, {
      screen: RouteNames.CHARACTER_CRITERIA,
    });
  }, [rootNavigation]);

  const handleNavigateToPointHistory = useCallback(() => {
    rootNavigation.navigate(RouteNames.FULL_SCREEN_STACK, {
      screen: RouteNames.CHARACTER_POINT_HISTORY,
    });
  }, [rootNavigation]);

  // 로딩 상태
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.puple.main} />
        </View>
      </SafeAreaView>
    );
  }

  // 에러 상태
  if (hasError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>데이터를 불러오는 중 오류가 발생했습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />

      <ScrollView
        bounces={false}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
      >
        {/* 로티 영역 */}
        <View style={styles.lottieContainer}>
          <LottieView
            source={require('../../assets/lottie/Lv2..json')}
            style={styles.lottie}
            autoPlay
            loop
            resizeMode="cover"
          />
        </View>
        <View style={styles.notificationButtonContainer}>
          <IconButton onPress={handleNavigateToNotification}>
            <AlarmIcon />
          </IconButton>
        </View>

        {/* 레벨 버튼 */}
        <View style={styles.levelButtonContainer}>
          <Button
            style={styles.levelButton}
            onPress={handleCharacterInfoPress}
            variant="ghost"
          >
            <Text style={styles.levelButtonText}>
              {currentLevelData?.title || 'Lv. 1 아메바'}
            </Text>
            <InfoIcon />
          </Button>
          {/* 툴팁 */}
          {showTooltip && (
            <View style={styles.tooltipContainer}>
              <LevelTooltip />
            </View>
          )}
        </View>

        <Spacer num={24} />

        {/* 레벨 진행 카드 */}
        <View style={styles.levelCard}>
          <View style={styles.levelCardHeader}>
            <Text style={styles.levelCardTitle}>Lv. {currentLevel}</Text>
            <TouchableOpacity onPress={handleNavigateToCriteria}>
              <View style={styles.levelCriteriaLinkWrapper}>
                <Text style={styles.levelCriteriaLink}>레벨 기준 확인하기</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* 경험치 진행 바 */}
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBarIconWrapper,
                  {
                    width: `${progressPercentageValue}%`,
                  },
                ]}
              >
                <View style={styles.progressBarIconContainer}>
                  <ProgressBarIcon />
                </View>
              </View>
            </View>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>
                경험치 {currentExp}/{nextLevelExp}
              </Text>
              <Text style={styles.progressPercentage}>
                {progressPercentageValue}%
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 포인트/경험치 정보 */}
          <TouchableOpacity
            style={styles.statsRowContainer}
            onPress={handleNavigateToPointHistory}
          >
            <View style={styles.statsRowContainerWrapper}>
              <View style={styles.statsRow}>
                <Text style={styles.statsLabel}>포인트</Text>
                <View style={styles.statsValueContainer}>
                  <Text style={styles.statsValue}>{currentPoints} P</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <Text style={styles.statsLabel}>경험치</Text>
                <Text style={styles.statsValue}>{currentExp} XP</Text>
              </View>
            </View>
            <RightArrowIcon color={COLORS.gray700} />
          </TouchableOpacity>
        </View>

        <Spacer num={24} />

        {/* 주간 출석 기록 */}
        <View style={styles.attendanceSection}>
          <Text style={styles.sectionTitle}>주간 출석 기록</Text>
          <Spacer num={12} />
          <View style={styles.attendanceDays}>
            {attendanceData.map((item, index) => (
              <View key={index} style={styles.attendanceDay}>
                <Text style={styles.attendanceDayText}>{item.day}</Text>
                <View style={[styles.attendanceCircle]}>
                  {item.attended && <Check_3DIcon />}
                </View>
              </View>
            ))}
          </View>
        </View>

        <Spacer num={24} />

        {/* 오늘의 미션 */}
        <View style={styles.missionSection}>
          <Text style={styles.sectionTitle}>오늘의 미션</Text>
          <Text style={styles.sectionDescription}>
            진행 중인 미션을 완료하면 새로운 미션이 열려요!
          </Text>
          <Spacer num={32} />
          {missions.map(mission => (
            <View key={mission.id} style={styles.missionCardWrapper}>
              <MissionCard mission={mission} myPage={true} />
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default CharacterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  // scrollContent: {
  //   paddingBottom: 0,
  // },
  lottieContainer: {
    width: '100%',
    height: scaleWidth(882),
    backgroundColor: COLORS.gray200,
    overflow: 'hidden',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  levelButtonContainer: {
    marginTop: scaleWidth(30),
    position: 'absolute',
    top: scaleWidth(60),
    left: scaleWidth(111),
    alignItems: 'center',
  },
  tooltipContainer: {
    marginTop: scaleWidth(30),

    position: 'absolute',
    top: scaleWidth(46),
    alignItems: 'center',
  },
  levelButton: {
    marginTop: scaleWidth(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.overlayWhite,
    paddingHorizontal: scaleWidth(16),
    height: scaleWidth(42),
    borderRadius: BORDER_RADIUS[99],
    gap: scaleWidth(2),
    borderWidth: scaleWidth(3),
    borderColor: COLORS.white,
  },
  levelButtonText: {
    ...Heading_20EB_Round,
    color: COLORS.black,
  },

  levelCard: {
    backgroundColor: COLORS.overlayWhite,
    width: scaleWidth(353),
    height: scaleWidth(268),
    borderRadius: BORDER_RADIUS[20],
    borderWidth: scaleWidth(3),
    borderColor: COLORS.white,
    position: 'absolute',
    top: scaleWidth(439),
    left: scaleWidth(20),
    padding: scaleWidth(24),
    overflow: 'hidden',
  },
  divider: {
    width: scaleWidth(353),
    marginLeft: scaleWidth(-24),
    marginRight: scaleWidth(-24),
    borderTopWidth: 1,
    borderTopColor: COLORS.gray300,
    marginVertical: scaleWidth(20),
  },
  levelCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleWidth(12),
  },
  levelCardTitle: {
    ...Heading_24EB_Round,
    color: COLORS.black,
  },
  levelCriteriaLinkWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray200,
    borderRadius: BORDER_RADIUS[30],
    width: scaleWidth(113),
    height: scaleWidth(30),
  },
  levelCriteriaLink: {
    ...Caption_12M,
    color: COLORS.gray800,
  },
  progressBarWrapper: {
    gap: scaleWidth(12),
  },
  progressBarContainer: {
    backgroundColor: COLORS.gray200,
    height: scaleWidth(18),
    borderRadius: scaleWidth(9.5),
    overflow: 'hidden',
  },
  progressBarIconWrapper: {
    height: '100%',
    borderRadius: scaleWidth(9.5),
    overflow: 'hidden',
  },
  progressBarIconContainer: {
    width: '100%',
    height: '100%',
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    ...Caption_14R,
    color: COLORS.gray800,
  },
  progressPercentage: {
    ...Heading_20EB_Round,
    color: COLORS.puple.main,
  },
  statsRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: scaleWidth(30),
  },
  statsRowContainerWrapper: {
    flex: 1,
    gap: scaleWidth(20),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsLabel: {
    ...Heading_16B,
    color: COLORS.black,
  },
  statsValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(8),
  },
  statsValue: {
    ...Heading_16B,
    color: COLORS.black,
  },
  attendanceSection: {
    position: 'absolute',
    width: scaleWidth(359),
    height: scaleWidth(118),
    top: scaleWidth(757),
    left: scaleWidth(20),
  },
  sectionTitle: {
    ...Heading_18EB_Round,
    color: COLORS.black,
    marginBottom: scaleWidth(4),
  },
  sectionDescription: {
    ...Body_16R,
    color: COLORS.gray700,
  },
  attendanceDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scaleWidth(15.83),
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS[16],
    paddingVertical: scaleWidth(30),
    paddingHorizontal: scaleWidth(24),
  },
  attendanceDay: {
    alignItems: 'center',
    gap: scaleWidth(4),
    flex: 1,
  },
  attendanceCircle: {
    width: scaleWidth(30),
    height: scaleWidth(30),
    borderRadius: BORDER_RADIUS[99],
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendanceDayText: {
    ...Body_15M,
    color: COLORS.black,
  },
  missionSection: {
    paddingHorizontal: scaleWidth(20),
  },
  missionCardWrapper: {
    marginBottom: scaleWidth(16),
  },
  notificationButtonContainer: {
    marginTop: scaleWidth(30),
    position: 'absolute',
    top: scaleWidth(40),
    right: scaleWidth(20),
  },
  notificationButton: {
    marginTop: scaleWidth(30),
    width: scaleWidth(50),
    height: scaleWidth(50),
    borderRadius: BORDER_RADIUS[16],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(20),
  },
});
