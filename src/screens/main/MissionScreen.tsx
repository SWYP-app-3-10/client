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
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  COLORS,
  scaleWidth,
  Heading_20EB_Round,
  Body_16R,
  BORDER_RADIUS,
} from '../../styles/global';
import Spacer from '../../components/Spacer';
import { useMissions } from '../../hooks/useMissions';
import { useArticles } from '../../hooks/useArticles';
import { clearAllAuthData } from '../../services/authService';
import { useOnboardingStore } from '../../store/onboardingStore';
import { Button, MissionCard, ArticleCard } from '../../components';
import { useNavigation } from '@react-navigation/native';
import { useArticleNavigation } from '../../hooks/useArticleNavigation';
import {
  MainTabNavigationProp,
  MissionStackParamList,
} from '../../navigation/types';
import { RouteNames } from '../../../routes';
import { Article } from '../../data/mock/missionData';

// 상수
const SCROLL_INITIAL_DELAY = 100;
const SCROLL_EVENT_THROTTLE = 16;

export {
  QUIZ_CORRECT_EXPERIENCE,
  QUIZ_CORRECT_POINT,
  QUIZ_INCORRECT_EXPERIENCE,
  QUIZ_INCORRECT_POINT,
} from '../../config/rewards';

const MissionScreen = () => {
  const screenWidth = Dimensions.get('window').width;
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const resetOnboarding = useOnboardingStore(state => state.resetOnboarding);
  const navigation =
    useNavigation<MainTabNavigationProp<MissionStackParamList>>();
  const { handleArticlePress } = useArticleNavigation({ returnTo: 'mission' });

  // 개발용: 로그인 정보 초기화
  const handleClearLogin = useCallback(async () => {
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
  }, [resetOnboarding]);

  const handleNavigateToNotification = useCallback(() => {
    navigation.navigate(RouteNames.FULL_SCREEN_STACK, {
      screen: RouteNames.CHARACTER_NOTIFICATION,
    });
  }, [navigation]);

  // 기사 클릭 처리 (커스텀 훅 사용)
  const handleArticlePressWrapper = useCallback(
    (article: Article) => {
      handleArticlePress(article.id);
    },
    [handleArticlePress],
  );

  // React Query hooks
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

  const circularMissions = useMemo(() => {
    if (missions.length === 0) {
      return [];
    }
    return [missions[missions.length - 1], ...missions, missions[0]];
  }, [missions]);

  // 초기 위치를 첫 번째 실제 아이템으로 설정
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: screenWidth,
        animated: false,
      });
    }, SCROLL_INITIAL_DELAY);

    return () => clearTimeout(timer);
  }, [screenWidth]);

  const handleScroll = useCallback(
    (event: any) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollPosition / screenWidth);

      // 복제본을 제외한 실제 인덱스 계산
      if (index === 0) {
        setCurrentIndex(missions.length - 1);
      } else if (index === circularMissions.length - 1) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(index - 1);
      }
    },
    [screenWidth, missions.length, circularMissions.length],
  );

  const handleMomentumScrollEnd = useCallback(
    (event: any) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollPosition / screenWidth);

      // 첫 번째 복제본에 도달하면 마지막 실제 아이템으로 점프
      if (index === 0 && missions.length > 0) {
        scrollViewRef.current?.scrollTo({
          x: screenWidth * missions.length,
          animated: false,
        });
        setCurrentIndex(missions.length - 1);
      }
      // 마지막 복제본에 도달하면 첫 번째 실제 아이템으로 점프
      else if (index === circularMissions.length - 1 && missions.length > 0) {
        scrollViewRef.current?.scrollTo({
          x: screenWidth,
          animated: false,
        });
        setCurrentIndex(0);
      }
    },
    [screenWidth, missions.length, circularMissions.length],
  );

  // 로딩 상태
  if (missionsLoading || articlesLoading) {
    return (
      <SafeAreaView style={missionScreenStyles.container}>
        <View style={missionScreenStyles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.puple.main} />
        </View>
      </SafeAreaView>
    );
  }

  // 에러 상태
  if (missionsError || articlesError) {
    return (
      <SafeAreaView style={missionScreenStyles.container}>
        <View style={missionScreenStyles.errorContainer}>
          <Text>데이터를 불러오는 중 오류가 발생했습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 데이터가 없을 때
  if (missions.length === 0) {
    return (
      <SafeAreaView style={missionScreenStyles.container}>
        <View style={missionScreenStyles.errorContainer} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={missionScreenStyles.container}>
      <ScrollView
        style={missionScreenStyles.scrollView}
        contentContainerStyle={missionScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 개발용: 로그인 초기화 버튼 */}
        {__DEV__ && (
          <Button
            title="로그인 초기화"
            onPress={handleClearLogin}
            variant="ghost"
            style={missionScreenStyles.clearLoginButton}
          />
        )}
        {/* 헤더 */}
        <Button
          title="알림 페이지로"
          variant="primary"
          style={missionScreenStyles.notificationButton}
          onPress={handleNavigateToNotification}
        />
        <View style={missionScreenStyles.header}>
          <View style={missionScreenStyles.headerLeft}>
            <Text style={missionScreenStyles.headerTitle}>오늘의 미션</Text>
            <Text style={missionScreenStyles.headerDescription}>
              오늘의 미션을 통해 새로운 지식을 탐험하고
              {'\n'}문해력을 키워보세요!
            </Text>
          </View>
        </View>

        <Spacer num={24} />

        {/* 미션 진행 카드 캐러셀 */}
        <View>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            scrollEventThrottle={SCROLL_EVENT_THROTTLE}
            decelerationRate="fast"
          >
            {circularMissions.map((mission, index) => (
              <View
                key={`${mission.id}-${index}`}
                style={[
                  missionScreenStyles.missionCardContainer,
                  { width: screenWidth },
                ]}
              >
                <MissionCard mission={mission} />
              </View>
            ))}
          </ScrollView>
        </View>

        <Spacer num={16} />

        {/* 캐러셀 인디케이터 */}
        <View style={missionScreenStyles.carouselIndicators}>
          {missions.map((_mission: unknown, index: number) => (
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: scaleWidth(20),
    paddingBottom: scaleWidth(100), // 하단 네비게이션 바 공간
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: scaleWidth(20),
  },
  headerLeft: {
    flex: 1,
    paddingRight: scaleWidth(12),
  },
  clearLoginButton: {
    paddingHorizontal: scaleWidth(8),
    paddingVertical: scaleWidth(4),
  },
  notificationButton: {
    width: scaleWidth(50),
    height: scaleWidth(50),
    alignSelf: 'flex-end',
  },
  headerTitle: {
    ...Heading_20EB_Round,
    color: COLORS.black,
    marginBottom: scaleWidth(4),
  },
  headerDescription: {
    ...Body_16R,
    color: COLORS.gray700,
    lineHeight: scaleWidth(24),
  },
  missionCardContainer: {
    paddingHorizontal: scaleWidth(20),
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
