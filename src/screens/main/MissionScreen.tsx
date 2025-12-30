import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  BackHandler,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  COLORS,
  scaleWidth,
  Heading_24EB_Round,
  BORDER_RADIUS,
  Body_16M,
} from '../../styles/global';
import Spacer from '../../components/Spacer';
import { useMissions } from '../../hooks/useMissions';
import { useArticles } from '../../hooks/useArticles';
import { MissionCard, ArticleCard } from '../../components';
import { useNavigation } from '@react-navigation/native';
import { useArticleNavigation } from '../../hooks/useArticleNavigation';
import {
  MainTabNavigationProp,
  MissionStackParamList,
} from '../../navigation/types';
import { RouteNames } from '../../../routes';
import { Article } from '../../data/mock/missionData';
import { useShowModal, useShowToastModal } from '../../store/modalStore';
import { usePointStore } from '../../store/pointStore';
import { ExperienceModalContent } from '../../components/ArticlePointModalContent';

import {
  DAILY_ATTENDANCE_EXPERIENCE,
  DAILY_ATTENDANCE_POINT,
} from '../../config/rewards';
import { useExperienceStore } from '../../store/experienceStore';
import IconButton from '../../components/IconButton';
import { AlarmIcon } from '../../icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const WIDTH_EDGE = scaleWidth(353); // 처음과 마지막 카드 너비
const WIDTH_MID = scaleWidth(348); // 중간 카드 너비
const GAP = scaleWidth(10); // 카드 사이 간격
const SCROLL_EVENT_THROTTLE = 16;
const DAILY_MISSION_ENTRY_KEY = '@daily_mission_entry';

// 첫 번째 카드를 중앙에 배치하기 위한 좌우 여백
const SIDE_SPACING = (SCREEN_WIDTH - WIDTH_EDGE) / 2;

export {
  QUIZ_CORRECT_EXPERIENCE,
  QUIZ_CORRECT_POINT,
  QUIZ_INCORRECT_EXPERIENCE,
  QUIZ_INCORRECT_POINT,
} from '../../config/rewards';

const MissionScreen = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation =
    useNavigation<MainTabNavigationProp<MissionStackParamList>>();
  const { handleArticlePress } = useArticleNavigation({ returnTo: 'mission' });

  const showModal = useShowModal();
  const showToastModal = useShowToastModal();
  const { addPoints } = usePointStore();
  const { addExperience } = useExperienceStore();
  const hasCheckedDailyEntryRef = useRef(false);

  // 데이터 로딩
  const {
    data: missions = [],
    isLoading: missionsLoading,
    error: missionsError,
  } = useMissions();
  const {
    data: articles = [],
    isLoading: articlesLoading,
    error: articlesError,
  } = useArticles();

  /**
   * 각 카드가 화면 중앙에 오기 위한 스크롤 위치(Offset) 수동 계산
   */
  const snapOffsets = useMemo(() => {
    const offsets: number[] = [];
    let currentPos = 0;

    missions.forEach((_, index) => {
      const isEdge = index === 0 || index === missions.length - 1;
      const cardWidth = isEdge ? WIDTH_EDGE : WIDTH_MID;

      const offset = currentPos;
      offsets.push(offset);

      currentPos += cardWidth + GAP;
    });
    return offsets;
  }, [missions]);

  // 스크롤 시 인덱스 업데이트
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;

      // 현재 스크롤 위치에서 가장 가까운 오프셋의 인덱스 찾기
      const index = snapOffsets.findIndex((offset, i) => {
        const nextOffset = snapOffsets[i + 1] || Infinity;
        return scrollPosition < (offset + nextOffset) / 2;
      });

      if (index !== -1 && index !== currentIndex) {
        setCurrentIndex(index);
      }
    },
    [snapOffsets, currentIndex],
  );

  const handleNavigateToNotification = useCallback(() => {
    navigation.navigate(RouteNames.FULL_SCREEN_STACK, {
      screen: RouteNames.CHARACTER_NOTIFICATION,
    });
  }, [navigation]);

  const handleArticlePressWrapper = useCallback(
    (article: Article) => {
      handleArticlePress(article.id);
    },
    [handleArticlePress],
  );

  // 안드로이드 뒤로가기 종료 처리
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const backAction = () => {
      showToastModal({
        message: "'뒤로' 버튼을 한번 더 누르시면 종료됩니다.",
        duration: 2000,
      });
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [showToastModal]);

  // 일일 출석 체크
  useEffect(() => {
    if (hasCheckedDailyEntryRef.current) return;
    const checkDailyEntry = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const lastEntryDate = await AsyncStorage.getItem(
          DAILY_MISSION_ENTRY_KEY,
        );
        if (lastEntryDate !== today) {
          await AsyncStorage.setItem(DAILY_MISSION_ENTRY_KEY, today);
          hasCheckedDailyEntryRef.current = true;
          await Promise.all([
            addPoints(DAILY_ATTENDANCE_POINT),
            addExperience(DAILY_ATTENDANCE_EXPERIENCE),
          ]);
          showModal({
            title: '포인트 & 경험치 획득!',
            children: React.createElement(ExperienceModalContent, {
              point: true,
              daily: true,
            }),
            primaryButton: { title: '확인', onPress: () => {} },
          });
        } else {
          hasCheckedDailyEntryRef.current = true;
        }
      } catch (error) {
        console.error('일일 진입 체크 실패:', error);
      }
    };
    checkDailyEntry();
  }, [addExperience, addPoints, showModal]);

  if (missionsLoading || articlesLoading) {
    return (
      <SafeAreaView style={missionScreenStyles.container}>
        <View style={missionScreenStyles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.puple.main} />
        </View>
      </SafeAreaView>
    );
  }

  if (missionsError || articlesError || missions.length === 0) {
    return (
      <SafeAreaView style={missionScreenStyles.container}>
        <View style={missionScreenStyles.errorContainer}>
          <Text>데이터를 불러오는 중 오류가 발생했거나 데이터가 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={missionScreenStyles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={missionScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={missionScreenStyles.notificationButtonContainer}>
          <View style={missionScreenStyles.notificationButton} />
          <IconButton onPress={handleNavigateToNotification}>
            <AlarmIcon />
          </IconButton>
        </View>
        <View style={missionScreenStyles.header}>
          <View style={missionScreenStyles.headerLeft}>
            <Text style={missionScreenStyles.headerTitle}>오늘의 미션</Text>
            <Text style={missionScreenStyles.headerDescription}>
              오늘의 미션을 통해 새로운 지식을 탐험하고{'\n'}문해력을
              키워보세요!
            </Text>
          </View>
        </View>

        <Spacer num={24} />

        {/* 미션 진행 카드 캐러셀 (무한스크롤 제거 버전) */}
        <View>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={SCROLL_EVENT_THROTTLE}
            decelerationRate="fast"
            snapToOffsets={snapOffsets}
            snapToAlignment="start"
            disableIntervalMomentum={true}
            contentContainerStyle={{
              paddingHorizontal: SIDE_SPACING,
            }}
          >
            {missions.map((mission, index) => {
              const isEdge = index === 0 || index === missions.length - 1;
              return (
                <View
                  key={mission.id}
                  style={{
                    width: isEdge ? WIDTH_EDGE : WIDTH_MID,
                    marginRight: index === missions.length - 1 ? 0 : GAP,
                  }}
                >
                  <MissionCard mission={mission} />
                </View>
              );
            })}
          </ScrollView>
        </View>

        <Spacer num={16} />

        {/* 캐러셀 인디케이터 */}
        <View style={missionScreenStyles.carouselIndicators}>
          {missions.map((_, index) => (
            <View
              key={index}
              style={[
                missionScreenStyles.indicatorDot,
                index === currentIndex &&
                  missionScreenStyles.indicatorDotActive,
              ]}
            />
          ))}
        </View>

        <Spacer num={24} />

        {/* 아티클 리스트 */}
        <View style={missionScreenStyles.articleList}>
          {articles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onPress={() => handleArticlePressWrapper(article)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const missionScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  notificationButtonContainer: {
    flexDirection: 'row',
    paddingTop: scaleWidth(8),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaleWidth(20),
  },
  scrollContent: {
    paddingTop: scaleWidth(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(32),
  },
  headerLeft: {
    flex: 1,
    paddingRight: scaleWidth(12),
  },
  notificationButton: {
    width: scaleWidth(112),
    height: scaleWidth(52),
    backgroundColor: COLORS.placeholder,
  },
  headerTitle: {
    ...Heading_24EB_Round,
    color: COLORS.black,
    marginBottom: scaleWidth(4),
  },
  headerDescription: {
    ...Body_16M,
    color: COLORS.gray600,
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scaleWidth(8),
  },
  indicatorDot: {
    width: scaleWidth(8),
    height: scaleWidth(8),
    backgroundColor: COLORS.gray300,
    borderRadius: BORDER_RADIUS[99],
  },
  indicatorDotActive: {
    backgroundColor: COLORS.puple.main,
    width: scaleWidth(12),
    height: scaleWidth(12),
  },
  articleList: {
    gap: scaleWidth(24),
    paddingHorizontal: scaleWidth(20),
    paddingBottom: scaleWidth(50),
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

export default MissionScreen;
