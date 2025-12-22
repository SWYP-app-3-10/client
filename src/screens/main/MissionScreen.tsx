import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  BORDER_RADIUS,
  Heading_20EB_Round,
  Heading_18SB,
  Body_16M,
  Body_16R,
  Caption_14R,
  Caption_12M,
} from '../../styles/global';
import Spacer from '../../components/Spacer';
import { useMissions } from '../../hooks/useMissions';
import { useArticles } from '../../hooks/useArticles';
import { Article } from '../../data/mockData';
import { clearAllAuthData } from '../../services/authService';
import { useOnboardingStore } from '../../store/onboardingStore';
import { Button } from '../../components';
import { useNavigation } from '@react-navigation/native';
import {
  MainTabNavigationProp,
  MissionStackParamList,
} from '../../navigation/types';
import { RouteNames } from '../../../routes';

const MissionScreen = () => {
  const screenWidth = Dimensions.get('window').width;
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const resetOnboarding = useOnboardingStore(state => state.resetOnboarding);
  // 통합 네비게이션 타입 사용
  const navigation =
    useNavigation<MainTabNavigationProp<MissionStackParamList>>();
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
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: screenWidth,
        animated: false,
      });
    }, 100);
  }, [screenWidth]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);

    // 복제본을 제외한 실제 인덱스 계산
    if (index === 0) {
      // 첫 번째 복제본 (마지막 실제 아이템)
      setCurrentIndex(missions.length - 1);
    } else if (index === circularMissions.length - 1) {
      // 마지막 복제본 (첫 번째 실제 아이템)
      setCurrentIndex(0);
    } else {
      // 실제 아이템 (인덱스 - 1)
      setCurrentIndex(index - 1);
    }
  };

  const handleMomentumScrollEnd = (event: any) => {
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
  };

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
          <Text style={styles.errorText}>
            데이터를 불러오는 중 오류가 발생했습니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // 데이터가 없을 때
  if (missions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>미션이 없습니다.</Text>
        </View>
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
          style={{
            width: scaleWidth(50),
            height: scaleWidth(50),
            alignSelf: 'flex-end',
          }}
          onPress={() => {
            navigation.navigate(RouteNames.CHARACTER_NOTIFICATION);
          }}
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
        <View style={styles.missionCarouselWrapper}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            scrollEventThrottle={16}
            decelerationRate="fast"
          >
            {circularMissions.map((mission, index) => (
              <View
                key={`${mission.id}-${index}`}
                style={[styles.missionCardContainer, { width: screenWidth }]}
              >
                <View style={styles.missionCard}>
                  <View style={styles.missionCardGradient}>
                    <Text style={styles.missionCardTitle}>{mission.title}</Text>
                    <Spacer num={16} />
                    {/* 진행 바 */}
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${
                              (mission.current / mission.total) * 100
                            }%`,
                          },
                        ]}
                      />
                    </View>
                    <Spacer num={8} />
                    <View style={styles.progressInfo}>
                      <Text style={styles.progressStatus}>
                        {mission.status}
                      </Text>
                      <Text style={styles.progressText}>
                        {mission.current}/{mission.total}
                      </Text>
                    </View>
                  </View>
                </View>
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
          {articles.map((article: Article) => (
            <View key={article.id} style={styles.articleCard}>
              {/* 이미지 플레이스홀더 */}
              <View style={styles.articleImageContainer}>
                <View style={styles.articleImagePlaceholder} />
                <View style={styles.articleTag}>
                  <Text style={styles.articleTagText}>
                    {article.category} | {article.readTime}
                  </Text>
                </View>
              </View>
              {/* 아티클 정보 */}
              <View style={styles.articleInfo}>
                <Text style={styles.articleTitle} numberOfLines={2}>
                  {article.title}
                </Text>
                <Spacer num={8} />
                <Text style={styles.articleDate}>{article.date}</Text>
              </View>
            </View>
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
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(20),
    paddingBottom: scaleWidth(100), // 하단 네비게이션 바 공간
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    paddingRight: scaleWidth(12),
  },
  clearLoginButton: {
    paddingHorizontal: scaleWidth(8),
    paddingVertical: scaleWidth(4),
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
  missionCarouselWrapper: {
    marginHorizontal: -scaleWidth(20), // 부모 padding 상쇄
  },
  missionCardContainer: {
    paddingHorizontal: scaleWidth(20),
  },
  missionCard: {
    borderRadius: BORDER_RADIUS[20],
    overflow: 'hidden',
  },
  missionCardGradient: {
    padding: scaleWidth(24),
    borderRadius: BORDER_RADIUS[20],
    backgroundColor: COLORS.puple.main,
  },
  missionCardTitle: {
    ...Heading_18SB,
    color: COLORS.white,
  },
  progressBarContainer: {
    height: scaleWidth(8),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: scaleWidth(4),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFD43B',
    borderRadius: scaleWidth(4),
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStatus: {
    ...Body_16M,
    color: COLORS.white,
  },
  progressText: {
    ...Body_16M,
    color: COLORS.white,
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
    borderRadius: scaleWidth(4),
    backgroundColor: COLORS.gray300,
  },
  indicatorDotActive: {
    backgroundColor: COLORS.puple.main,
  },
  articleList: {
    gap: scaleWidth(16),
  },
  articleCard: {
    borderRadius: BORDER_RADIUS[16],
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  articleImageContainer: {
    position: 'relative',
    width: '100%',
    height: scaleWidth(200),
  },
  articleImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.gray200,
  },
  articleTag: {
    position: 'absolute',
    top: scaleWidth(12),
    right: scaleWidth(12),
    paddingHorizontal: scaleWidth(8),
    paddingVertical: scaleWidth(4),
    backgroundColor: COLORS.white,
    borderRadius: scaleWidth(12),
    opacity: 0.9,
  },
  articleTagText: {
    ...Caption_12M,
    color: COLORS.gray700,
  },
  articleInfo: {
    padding: scaleWidth(16),
  },
  articleTitle: {
    ...Heading_18SB,
    color: COLORS.black,
    lineHeight: scaleWidth(24),
  },
  articleDate: {
    ...Caption_14R,
    color: COLORS.gray600,
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
  errorText: {
    ...Body_16M,
    color: COLORS.red,
    textAlign: 'center',
  },
});

export default MissionScreen;
