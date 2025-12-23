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
import { usePointStore } from '../../store/pointStore';
import { useShowModal } from '../../store/modalStore';
import { Button, MissionCard, ArticleCard } from '../../components';
import { useNavigation } from '@react-navigation/native';
import {
  MainTabNavigationProp,
  MissionStackParamList,
} from '../../navigation/types';
import { RouteNames } from '../../../routes';
import { useRewardedAd, TestIds } from 'react-native-google-mobile-ads';
import { Article } from '../../data/mock/missionData';

// 상수
const SCROLL_INITIAL_DELAY = 100;
const SCROLL_EVENT_THROTTLE = 16;
const ARTICLE_POINT_COST = 30; // 기사 읽기 포인트
const REWARD_AD_POINTS = 30; // 광고 시청 시 받는 포인트

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy';

const MissionScreen = () => {
  const screenWidth = Dimensions.get('window').width;
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const resetOnboarding = useOnboardingStore(state => state.resetOnboarding);
  const navigation =
    useNavigation<MainTabNavigationProp<MissionStackParamList>>();
  const { points, loadPoints, subtractPoints, addPoints } = usePointStore();
  const showModal = useShowModal();

  // 리워드 광고
  const { isLoaded, isClosed, load, show, reward } = useRewardedAd(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });
  const [pendingArticleId, setPendingArticleId] = useState<number | null>(null);
  const [isAdShowing, setIsAdShowing] = useState(false);
  const [hasEarnedReward, setHasEarnedReward] = useState(false);

  // 포인트 로드
  useEffect(() => {
    loadPoints();
  }, [loadPoints]);

  // 광고 보상 감지
  useEffect(() => {
    if (reward) {
      setHasEarnedReward(true);
    }
  }, [reward]);

  // 광고 닫힘 처리
  useEffect(() => {
    if (isClosed && isAdShowing && pendingArticleId) {
      if (hasEarnedReward) {
        // 광고 시청 완료 - 포인트 추가 후 기사 상세로 이동
        addPoints(REWARD_AD_POINTS);
        navigation.navigate(RouteNames.ARTICLE_DETAIL, {
          articleId: pendingArticleId,
        });
      }
      // 상태 초기화
      setIsAdShowing(false);
      setHasEarnedReward(false);
      setPendingArticleId(null);
      load();
    }
  }, [
    isClosed,
    isAdShowing,
    hasEarnedReward,
    pendingArticleId,
    addPoints,
    navigation,
    load,
  ]);

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

  // 기사 클릭 처리
  const handleArticlePress = useCallback(
    (article: Article) => {
      // 포인트 확인
      if (points >= ARTICLE_POINT_COST) {
        // 포인트가 충분한 경우 - 포인트 사용 모달
        showModal({
          title: '새로운 글을 읽으시겠어요?',
          description: `사용 가능 포인트: ${points}p`,
          children: (
            <View style={styles.modalContent}>
              <Text style={styles.pointText}>
                {ARTICLE_POINT_COST}포인트가 사용됩니다
              </Text>
            </View>
          ),
          primaryButton: {
            title: '새 글 읽기',
            onPress: async () => {
              const success = await subtractPoints(ARTICLE_POINT_COST);
              if (success) {
                navigation.navigate(RouteNames.ARTICLE_DETAIL, {
                  articleId: article.id,
                });
              } else {
                Alert.alert('오류', '포인트 차감에 실패했습니다.');
              }
            },
          },
          secondaryButton: {
            title: '취소',
            variant: 'ghost',
            onPress: () => {},
          },
        });
      } else {
        // 포인트가 부족한 경우 - 광고 시청 모달
        showModal({
          title: '광고를 보고 포인트 받으시겠어요?',
          description: `사용 가능 포인트: ${points}p`,
          children: (
            <View style={styles.modalContent}>
              <Text style={styles.pointText}>
                {ARTICLE_POINT_COST}포인트가 사용됩니다
              </Text>
            </View>
          ),
          primaryButton: {
            title: '포인트 받기',
            onPress: () => {
              if (isLoaded) {
                setPendingArticleId(article.id);
                setIsAdShowing(true);
                setHasEarnedReward(false);
                show();
              } else {
                Alert.alert('잠시만요', '광고를 불러오는 중입니다...');
                load();
              }
            },
          },
          secondaryButton: {
            title: '취소',
            variant: 'ghost',
            onPress: () => {},
          },
        });
      }
    },
    [points, showModal, navigation, subtractPoints, isLoaded, load, show],
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
        <View style={styles.errorContainer} />
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
            <ArticleCard
              key={article.id}
              article={article}
              onPress={() => handleArticlePress(article)}
            />
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
  modalContent: {
    width: '100%',
    alignItems: 'center',
    marginBottom: scaleWidth(8),
  },
  pointText: {
    fontSize: scaleWidth(16),
    fontWeight: '600',
    color: COLORS.puple.main,
    marginTop: scaleWidth(8),
  },
});

export default MissionScreen;
