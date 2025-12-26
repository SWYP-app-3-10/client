// MyPageScreen.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  COLORS,
  scaleWidth,
  BORDER_RADIUS,
  Heading_18EB_Round,
  Body_16M,
  Caption_14R,
  Caption_12M,
  Body_16SB,
  Heading_18SB,
} from '../../styles/global';

import { useOnboardingStore, Difficulty } from '../../store/onboardingStore';
import { getRecentLogin } from '../../services/authStorageService';
import { readArticlesMock } from '../../data/mock/readArticlesData';

import Spacer from '../../components/Spacer';
import { Button } from '../../components';

import {
  useNavigation,
  CompositeNavigationProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  MyPageStackParamList,
  RootStackParamList,
} from '../../navigation/types';

import { RouteNames } from '../../../routes';

import { CheckIcon, RightArrowIcon, TriangleIcon } from '../../icons';
import { useShowBottomSheetModal, useHideModal } from '../../store/modalStore';
import LevelSelectionContent from '../../components/LevelSelectionContent';
import IconButton from '../../components/IconButton';

// ✅ MyPageStack + RootStack 합친 네비게이션 타입
type MyPageNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MyPageStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

// 난이도 -> 레벨 표시 텍스트
const getLevelText = (difficulty: string | null): string => {
  switch (difficulty) {
    case 'beginner':
      return '초급';
    case 'intermediate':
      return '중급';
    case 'advanced':
      return '고급';
    default:
      return '초급';
  }
};

// 카테고리 ID -> 이름 매핑
const categoryNameMap: Record<string, string> = {
  politics: '정치',
  economy: '경제',
  society: '사회',
  lifestyle: '생활/문화',
  it: 'IT/과학',
  world: '세계',
};

// 타임라인 그룹 컴포넌트
interface TimelineGroupProps {
  dateGroup: {
    date: string;
    dayOfWeek: string;
    count: number;
    articles: Array<{
      id: number;
      title: string;
      category: string;
      quizResult: 'correct' | 'incorrect';
      readDate: string;
    }>;
  };
  formatDate: (dateStr: string, dayOfWeek: string) => string;
  isLast: boolean;
  onArticlePress: (articleId: number) => void;
}

const TimelineGroup: React.FC<TimelineGroupProps> = ({
  dateGroup,
  formatDate,
  isLast,
  onArticlePress,
}) => {
  const [contentHeight, setContentHeight] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const dashCount = Math.ceil(
    (contentHeight - scaleWidth(10) - scaleWidth(6)) /
      (scaleWidth(2.5) + scaleWidth(2.5)),
  );

  const displayedArticles = showAll
    ? dateGroup.articles
    : dateGroup.articles.slice(0, 5);

  return (
    <View style={styles.timelineGroup}>
      {/* 타임라인 컨테이너 */}
      <View style={styles.timelineContainer}>
        {/* 왼쪽 타임라인 라인 */}
        <View style={styles.timelineLineContainer}>
          {/* 상단 원형 마커 */}
          <View style={styles.timelineDot} />
          {/* 점선 - 게시글 길이에 맞춰 동적으로 생성 */}
          <View style={styles.timelineDashedLineContainer}>
            {Array.from({ length: Math.max(dashCount, 50) }).map((_, index) => (
              <View key={index} style={styles.timelineDash} />
            ))}
          </View>
        </View>

        {/* 오른쪽 컨텐츠 */}
        <View
          style={styles.timelineContent}
          onLayout={event => {
            const { height } = event.nativeEvent.layout;
            if (dateGroup.articles.length > 5) {
              setContentHeight(height - scaleWidth(56));
            } else {
              setContentHeight(height);
            }
          }}
        >
          {/* 날짜 헤더 */}
          <View style={styles.timelineHeader}>
            <Text style={styles.timelineDate}>
              {formatDate(dateGroup.date, dateGroup.dayOfWeek)}
            </Text>
            <Text style={styles.timelineCount}>{dateGroup.count}개</Text>
          </View>

          {/* 글 카드들 */}
          {displayedArticles.map((article, articleIndex) => (
            <React.Fragment key={article.id}>
              <TouchableOpacity
                style={[
                  styles.articleCard,
                  articleIndex === displayedArticles.length - 1 &&
                    styles.articleCardLast,
                ]}
                onPress={() => onArticlePress(article.id)}
              >
                <View style={styles.articleContent}>
                  <Text style={styles.articleTitle} numberOfLines={2}>
                    {article.title}
                  </Text>

                  <View style={styles.articleFooter}>
                    <View style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>
                        {article.category}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.quizBadge,
                        article.quizResult === 'correct'
                          ? styles.quizBadgeCorrect
                          : styles.quizBadgeIncorrect,
                      ]}
                    >
                      <Text
                        style={[
                          styles.quizBadgeText,
                          article.quizResult === 'correct'
                            ? styles.quizBadgeTextCorrect
                            : styles.quizBadgeTextIncorrect,
                        ]}
                      >
                        Q - {article.quizResult === 'correct' ? '정답' : '오답'}
                      </Text>
                    </View>
                  </View>
                </View>

                <RightArrowIcon color={COLORS.gray700} />
              </TouchableOpacity>
              {articleIndex !== displayedArticles.length - 1 && (
                <Spacer num={16} />
              )}
            </React.Fragment>
          ))}

          {/* 전체 보기 버튼 */}
          {dateGroup.articles.length > 5 &&
            (!showAll ? (
              <>
                <Spacer num={16} />
                <Button
                  variant="ghost"
                  textStyle={styles.viewAllText}
                  onPress={() => setShowAll(true)}
                  title="전체 보기"
                  style={{ height: scaleWidth(40) }}
                />
              </>
            ) : (
              <>
                <Spacer num={16} />
                <Button
                  variant="ghost"
                  textStyle={styles.viewAllText}
                  style={{ height: scaleWidth(40) }}
                  onPress={() => setShowAll(false)}
                  title="요약 보기"
                />
              </>
            ))}
        </View>
      </View>

      {!isLast && <Spacer num={24} />}
    </View>
  );
};

const MyPageScreen = () => {
  const interests = useOnboardingStore(state => state.interests);
  const difficulty = useOnboardingStore(state => state.difficulty);
  const setDifficulty = useOnboardingStore(state => state.setDifficulty);

  const [recentLogin, setRecentLogin] = useState<any>(null);
  const [selectedWeek, setSelectedWeek] = useState(0); // 현재 선택된 주 (0 = 현재 주)

  const showBottomSheetModal = useShowBottomSheetModal();
  const hideModal = useHideModal();

  // ✅ 여기만 이렇게 바꾸면 SETTINGS/ONBOARDING 둘 다 타입 에러 안 남
  const navigation = useNavigation<MyPageNavigationProp>();

  // 사용자 정보 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      const loginInfo = await getRecentLogin();
      setRecentLogin(loginInfo);
    };
    loadUserInfo();
  }, []);

  // 읽은 글 데이터 (현재는 mock 데이터 사용)
  const readArticles = readArticlesMock;

  // 관심분야 태그 목록
  const interestTags = useMemo(() => {
    if (!interests) {
      return [];
    }
    return Object.entries(interests)
      .sort(([, a], [, b]) => (a as number) - (b as number))
      .map(([id]) => categoryNameMap[id] || id);
  }, [interests]);

  // 날짜 범위 계산 (현재 주의 시작일과 종료일)
  const currentWeekRange = useMemo(() => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + selectedWeek * 7);

    const dayOfWeek = targetDate.getDay();
    const startDate = new Date(targetDate);
    startDate.setDate(targetDate.getDate() - dayOfWeek);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const formatDate = (date: Date) => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month.toString().padStart(2, '0')}.${day
        .toString()
        .padStart(2, '0')}`;
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }, [selectedWeek]);

  // 다음 주에 데이터가 있는지 확인
  const hasNextWeekData = useMemo(() => {
    const today = new Date();
    const nextWeekDate = new Date(today);
    nextWeekDate.setDate(today.getDate() + (selectedWeek + 1) * 7);

    const dayOfWeek = nextWeekDate.getDay();
    const startDate = new Date(nextWeekDate);
    startDate.setDate(nextWeekDate.getDate() - dayOfWeek);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return readArticles.some(dateGroup => {
      const articleDate = new Date(dateGroup.date);
      return articleDate >= startDate && articleDate <= endDate;
    });
  }, [selectedWeek, readArticles]);

  // 날짜 포맷팅 (YYYY-MM-DD -> MM.DD 요일)
  const formatDate = (dateStr: string, dayOfWeek: string) => {
    const [_year, month, day] = dateStr.split('-');
    return `${month}.${day} ${dayOfWeek}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        bounces={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 설정 버튼 */}
        <Button
          title="설정"
          variant="primary"
          style={[styles.backButton, { marginHorizontal: scaleWidth(20) }]}
          onPress={() => {
            navigation.navigate(RouteNames.SETTINGS);
          }}
        />

        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImagePlaceholder} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userId}>
              {recentLogin?.name || '뇌세포123456'}
            </Text>
            <Text style={styles.userEmail}>
              {recentLogin?.userId || 'abcdef@naver.com'}
            </Text>
          </View>
        </View>

        <Spacer num={32} />

        {/* 나의 관심분야 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>나의 관심분야</Text>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate(RouteNames.ONBOARDING, {
                  screen: RouteNames.INTERESTS,
                  params: { editMode: true },
                });
              }}
            >
              <Text style={styles.editButton}>편집</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.interestTags}>
            {interestTags.length > 0 ? (
              interestTags.map((tag, index) => (
                <View key={`${tag}-${index}`} style={styles.interestTag}>
                  <Text style={styles.interestTagText}>{tag}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>관심분야를 선택해주세요</Text>
            )}
          </View>
        </View>

        <Spacer num={32} />

        {/* 나의 레벨 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>나의 레벨</Text>
          <Spacer num={12} />

          <TouchableOpacity
            style={styles.levelButton}
            onPress={() => {
              showBottomSheetModal({
                children: React.createElement(LevelSelectionContent, {
                  selectedLevel: difficulty,
                  onSelect: (level: Difficulty) => {
                    setDifficulty(level);
                    hideModal();
                  },
                }),
              });
            }}
          >
            <Text style={styles.levelText}>{getLevelText(difficulty)}</Text>
            <CheckIcon color={COLORS.gray600} />
          </TouchableOpacity>
        </View>

        <Spacer num={32} />

        {/* 읽은 글 섹션 */}
        <View style={styles.readArticleSection}>
          <Spacer num={32} />
          <Text style={styles.sectionTitle}>읽은 글</Text>
          <Spacer num={6} />

          {/* 날짜 선택기 */}
          <View style={styles.dateSelector}>
            <IconButton onPress={() => setSelectedWeek(prev => prev - 1)}>
              <TriangleIcon color={COLORS.gray600} />
            </IconButton>

            <Text style={styles.dateRange}>{currentWeekRange}</Text>

            <IconButton
              onPress={() => setSelectedWeek(prev => prev + 1)}
              disabled={!hasNextWeekData}
            >
              <TriangleIcon
                color={hasNextWeekData ? COLORS.gray600 : COLORS.gray200}
                style={{ transform: [{ rotate: '180deg' }] }}
              />
            </IconButton>
          </View>

          <Spacer num={24} />

          {/* 타임라인 */}
          {readArticles.map((dateGroup, groupIndex) => (
            <TimelineGroup
              key={`${dateGroup.date}-${groupIndex}`}
              dateGroup={dateGroup}
              formatDate={formatDate}
              isLast={groupIndex === readArticles.length - 1}
              onArticlePress={articleId => {
                navigation.getParent()?.navigate(RouteNames.FULL_SCREEN_STACK, {
                  screen: RouteNames.READ_ARTICLE_DETAIL,
                  params: {
                    articleId,
                  },
                });
              }}
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

  // 상단 설정 버튼
  backButton: {
    width: scaleWidth(50),
    height: scaleWidth(50),
    alignSelf: 'flex-end',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {},

  // 프로필 섹션
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(20),
  },
  profileImageContainer: {
    marginRight: scaleWidth(20),
  },
  profileImagePlaceholder: {
    width: scaleWidth(90),
    height: scaleWidth(90),
    borderRadius: BORDER_RADIUS[99],
    backgroundColor: COLORS.placeholder,
  },
  profileInfo: {
    flex: 1,
  },
  userId: {
    ...Heading_18EB_Round,
    color: COLORS.black,
    marginBottom: scaleWidth(4),
  },
  userEmail: {
    ...Body_16M,
    color: COLORS.gray700,
  },

  // 섹션 공통
  section: {
    paddingHorizontal: scaleWidth(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleWidth(12),
  },
  sectionTitle: {
    ...Heading_18EB_Round,
    color: COLORS.black,
  },

  // 관심분야
  editButton: {
    ...Body_16SB,
    color: COLORS.puple.main,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaleWidth(8),
  },
  interestTag: {
    paddingHorizontal: scaleWidth(16),
    paddingVertical: scaleWidth(8),
    borderRadius: BORDER_RADIUS[16],
    backgroundColor: COLORS.gray100,
  },
  interestTagText: {
    ...Body_16M,
    color: COLORS.black,
  },
  emptyText: {
    ...Caption_14R,
    color: COLORS.gray500,
  },

  // 나의 레벨
  levelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS[16],
    backgroundColor: COLORS.gray100,
    width: scaleWidth(71),
    height: scaleWidth(40),
    gap: scaleWidth(10),
  },
  levelText: {
    ...Body_16M,
    color: COLORS.gray700,
  },

  // 읽은 글 섹션
  readArticleSection: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: scaleWidth(20),
    paddingBottom: scaleWidth(40),
  },

  // 날짜 선택기
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateRange: {
    ...Heading_18SB,
    color: COLORS.black,
  },

  // 타임라인
  timelineGroup: {},
  timelineContainer: {},
  timelineLineContainer: {
    alignItems: 'center',
    position: 'absolute',
    top: scaleWidth(5),
    left: scaleWidth(5),
  },
  timelineDot: {
    width: scaleWidth(10),
    height: scaleWidth(10),
    borderRadius: BORDER_RADIUS[99],
    backgroundColor: COLORS.gray800,
    position: 'relative',
  },
  timelineDashedLineContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: scaleWidth(6),
  },
  timelineDash: {
    width: scaleWidth(1),
    height: scaleWidth(2.5),
    backgroundColor: COLORS.gray800,
    marginBottom: scaleWidth(2.5),
  },
  timelineContent: {
    flex: 1,
    position: 'relative',
    marginLeft: scaleWidth(25),
  },
  timelineHeader: {
    marginBottom: scaleWidth(12),
    gap: scaleWidth(10),
  },
  timelineDate: {
    ...Caption_14R,
    color: COLORS.gray700,
  },
  timelineCount: {
    ...Body_16SB,
    color: COLORS.black,
  },

  // 기사 카드
  articleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scaleWidth(16),
    paddingHorizontal: scaleWidth(20),
    borderRadius: BORDER_RADIUS[16],
    backgroundColor: COLORS.white,
    borderWidth: scaleWidth(1),
    borderColor: COLORS.gray300,
    gap: scaleWidth(19),
  },
  articleCardLast: {
    marginBottom: 0,
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    ...Body_16M,
    color: COLORS.black,
    marginBottom: scaleWidth(16),
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(6),
  },
  categoryTag: {
    paddingHorizontal: scaleWidth(10),
    paddingVertical: scaleWidth(6),
    borderRadius: BORDER_RADIUS[30],
    backgroundColor: COLORS.gray100,
  },
  categoryTagText: {
    ...Caption_14R,
    color: COLORS.gray700,
  },

  // 퀴즈 배지
  quizBadge: {
    paddingHorizontal: scaleWidth(10),
    paddingVertical: scaleWidth(6),
    borderRadius: BORDER_RADIUS[30],
  },
  quizBadgeCorrect: {
    backgroundColor: COLORS.blue[3],
  },
  quizBadgeIncorrect: {
    backgroundColor: COLORS.red[3],
  },
  quizBadgeText: {
    ...Caption_12M,
  },
  quizBadgeTextCorrect: {
    color: COLORS.blue.correct,
  },
  quizBadgeTextIncorrect: {
    color: COLORS.red.main,
  },

  viewAllText: {
    ...Body_16M,
    color: COLORS.gray800,
  },
});

export default MyPageScreen;
