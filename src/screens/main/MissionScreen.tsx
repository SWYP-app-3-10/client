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
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
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
import {
  MainTabNavigationProp,
  MissionStackParamList,
} from '../../navigation/types';
import { RouteNames } from '../../../routes';

// 상수
const SCROLL_INITIAL_DELAY = 100;
const SCROLL_EVENT_THROTTLE = 16;

const MissionScreen = () => {
  const screenWidth = Dimensions.get('window').width;
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const resetOnboarding = useOnboardingStore(state => state.resetOnboarding);
  const navigation =
    useNavigation<MainTabNavigationProp<MissionStackParamList>>();

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
    navigation.navigate(RouteNames.CHARACTER_NOTIFICATION);
  }, [navigation]);

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

  // 순환 캐러셀을 위한 데이터: [마지막, ...원본, 첫번째]
  const circularMissions = useMemo(() => {
    if (missions.length === 0) {
      return [];
    }
    return [
      missions[missions.length - 1], // 마지막 복제
      ...missions,
      missions[0], // 첫 번째 복제
    ];
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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.puple.main} />
        </View>
      </SafeAreaView>
    );
  }

  // 에러 상태
  if (missionsError || articlesError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>데이터를 불러오는 중 오류가 발생했습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 데이터가 없을 때
  if (missions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 개발용: 로그인 초기화 버튼 */}
        {__DEV__ && (
          <Button
            title="로그인 초기화"
            onPress={handleClearLogin}
            variant="ghost"
            style={styles.clearLoginButton}
          />
        )}
        {/* 헤더 */}
        <Button
          title="알림 페이지로"
          variant="primary"
          style={styles.notificationButton}
          onPress={handleNavigateToNotification}
        />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>오늘의 미션</Text>
            <Text style={styles.headerDescription}>
              오늘의 미션을 통해 새로운 지식을 탐험하고 문해력을 키워보세요!
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
                style={[styles.missionCardContainer, { width: screenWidth }]}
              >
                <MissionCard mission={mission} />
              </View>
            ))}
          </ScrollView>
        </View>

        <Spacer num={16} />

        {/* 캐러셀 인디케이터 */}
        <View style={styles.carouselIndicators}>
          {missions.map((_mission: unknown, index: number) => (
            <View
              key={index}
              style={[
                styles.indicatorDot,
                index === currentIndex && styles.indicatorDotActive,
              ]}
            />
          ))}
        </View>

        <Spacer num={24} />

        {/* 아티클 리스트 */}
        <View style={styles.articleList}>
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: scaleWidth(8),
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
