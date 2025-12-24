import React, { useCallback } from 'react';
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
import {
  COLORS,
  scaleWidth,
  BORDER_RADIUS,
  Heading_20EB_Round,
  Body_16M,
  Body_16R,
  Caption_14R,
  Heading_24EB_Round,
  Caption_12M,
  Heading_18EB_Round,
} from '../../styles/global';
import { Button, MissionCard } from '../../components';
import {
  CharacterStackParamList,
  MainTabNavigationProp,
} from '../../navigation/types';
import { mockMissions } from '../../data/mock/missionData';
import { levelList } from '../../screens/character/criteria/level/levelData';
import Spacer from '../../components/Spacer';
import LottieView from 'lottie-react-native';
import {
  Check_3DIcon,
  InfoIcon,
  Level_1_Tooltip,
  RightArrowIcon,
  ProgressBarIcon,
} from '../../icons';
import { useFocusEffect } from '@react-navigation/native';
import { Body_15M } from '../../styles/typography';

// 더미 데이터
const currentLevel = 1;
const currentExp = 50;
const nextLevelExp = 100;
const currentPoints = 150;
const progressPercentage = (currentExp / nextLevelExp) * 100;

// 주간 출석 기록 (월~일)
const attendanceData = [
  { day: '월', attended: true },
  { day: '화', attended: true },
  { day: '수', attended: false },
  { day: '목', attended: false },
  { day: '금', attended: false },
  { day: '토', attended: false },
  { day: '일', attended: false },
];

const CharacterScreen = () => {
  const rootNavigation =
    useNavigation<MainTabNavigationProp<CharacterStackParamList>>();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(true);
  const lottieHeight = scaleWidth(882);

  const currentLevelData = levelList.find(l => l.id === currentLevel);

  useFocusEffect(
    useCallback(() => {
      // 화면 진입 시 툴팁 표시
      setShowTooltip(true);

      // 3초 후 툴팁 숨기기
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
        setShowTooltip(false);
      };
    }, []),
  );

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolled(scrollY > lottieHeight - 100); // 로티 영역을 거의 지나면 true
  };

  return (
    <>
      <StatusBar
        backgroundColor={isScrolled ? COLORS.white : COLORS.gray200}
        barStyle="dark-content"
        translucent
      />
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isScrolled ? COLORS.white : COLORS.gray200 },
        ]}
        edges={['top']}
      >
        <ScrollView
          bounces={false}
          style={styles.scrollView}
          contentContainerStyle={{}}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* 로티 영역 */}
          <View style={styles.lottieContainer}>
            <LottieView
              source={require('../../assets/lottie/Cutebeardancing.json')}
              style={styles.lottie}
              autoPlay
              loop
              resizeMode="cover"
            />
          </View>
          {/* 알림 버튼 */}
          <View style={styles.notificationButtonContainer}>
            <Button
              title=""
              variant="primary"
              style={styles.notificationButton}
              onPress={() => {
                rootNavigation.navigate(RouteNames.FULL_SCREEN_STACK, {
                  screen: RouteNames.CHARACTER_NOTIFICATION,
                });
              }}
            />
          </View>
          {/* 레벨 버튼 */}
          <View style={styles.levelButtonContainer}>
            <TouchableOpacity style={styles.levelButton}>
              <Text style={styles.levelButtonText}>
                {currentLevelData?.title || 'Lv. 1 아메바'}
              </Text>
              <InfoIcon />
            </TouchableOpacity>
            {/* 툴팁 */}
            {showTooltip && (
              <View style={styles.tooltipContainer}>
                <Level_1_Tooltip />
              </View>
            )}
          </View>

          <Spacer num={24} />

          {/* 레벨 진행 카드 */}
          <View style={styles.levelCard}>
            <View style={styles.levelCardHeader}>
              <Text style={styles.levelCardTitle}>Lv. {currentLevel}</Text>
              <TouchableOpacity
                onPress={() =>
                  rootNavigation.navigate(RouteNames.FULL_SCREEN_STACK, {
                    screen: RouteNames.CHARACTER_CRITERIA,
                  })
                }
              >
                <View style={styles.levelCriteriaLinkWrapper}>
                  <Text style={styles.levelCriteriaLink}>
                    레벨 기준 확인하기
                  </Text>
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
                      width: `${Math.round(progressPercentage)}%`,
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
                  {Math.round(progressPercentage)}%
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* 포인트/경험치 정보 */}
            <TouchableOpacity
              style={styles.statsRowContainer}
              onPress={() =>
                rootNavigation.navigate(RouteNames.FULL_SCREEN_STACK, {
                  screen: RouteNames.CHARACTER_POINT_HISTORY,
                })
              }
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
              <RightArrowIcon />
            </TouchableOpacity>
          </View>

          <Spacer num={24} />

          {/* 주간 출석 기록 */}
          <View style={styles.attendanceSection}>
            <Text style={styles.sectionTitle}>주간 출석 기록</Text>
            <Spacer num={16} />
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
            <Spacer num={16} />
            {mockMissions.map(mission => (
              <View key={mission.id} style={styles.missionCardWrapper}>
                <MissionCard mission={mission} myPage={true} />
              </View>
            ))}
          </View>

          <Spacer num={100} />
        </ScrollView>
      </SafeAreaView>
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
  lottiePlaceholder: {
    ...Heading_20EB_Round,
    color: COLORS.gray600,
  },
  levelButtonContainer: {
    position: 'absolute',
    top: scaleWidth(60),
    left: scaleWidth(111),
    alignItems: 'center',
  },
  tooltipContainer: {
    position: 'absolute',
    top: scaleWidth(46),
    alignItems: 'center',
  },
  levelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: scaleWidth(172),
    height: scaleWidth(42),
    borderRadius: BORDER_RADIUS[99],
    gap: scaleWidth(14),
    borderWidth: scaleWidth(3),
    borderColor: COLORS.white,
  },
  levelButtonText: {
    ...Heading_20EB_Round,
    color: COLORS.black,
  },
  infoIcon: {
    position: 'absolute',
    top: scaleWidth(11),
    right: scaleWidth(22),
  },

  levelCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
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
    ...Body_16M,
    color: COLORS.black,
  },
  statsValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(8),
  },
  statsValue: {
    ...Body_16M,
    color: COLORS.black,
  },
  arrow: {
    ...Body_16M,
    color: COLORS.gray600,
    fontSize: scaleWidth(20),
  },
  attendanceSection: {
    paddingHorizontal: scaleWidth(20),
    position: 'absolute',
    width: scaleWidth(359),
    height: scaleWidth(161),
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
    gap: scaleWidth(8),
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
    position: 'absolute',
    top: scaleWidth(0),
    right: scaleWidth(0),
  },
  notificationButton: {
    width: scaleWidth(50),
    height: scaleWidth(50),
    borderRadius: BORDER_RADIUS[16],
  },
});
