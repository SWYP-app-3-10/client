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
} from '../../styles/global';
import { useOnboardingStore } from '../../store/onboardingStore';
import { getRecentLogin } from '../../services/authStorageService';
import { readArticlesMock } from '../../data/mock/readArticlesData';
import Spacer from '../../components/Spacer';
import { Button } from '../../components';
import { useNavigation } from '@react-navigation/native';
import {
  MainTabNavigationProp,
  MyPageStackParamList,
} from '../../navigation/types';
import { RouteNames } from '../../../routes';
import { CheckIcon } from '../../icons';

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

const MyPageScreen = () => {
  const interests = useOnboardingStore(state => state.interests);
  const difficulty = useOnboardingStore(state => state.difficulty);
  const [recentLogin, setRecentLogin] = useState<any>(null);
  const [selectedWeek, setSelectedWeek] = useState(0); // 현재 선택된 주 (0 = 현재 주)
  const navigation =
    useNavigation<MainTabNavigationProp<MyPageStackParamList>>();
  // 사용자 정보 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      const loginInfo = await getRecentLogin();
      setRecentLogin(loginInfo);
    };
    loadUserInfo();
  }, []);

  // 관심분야 태그 목록
  const interestTags = useMemo(() => {
    if (!interests) {
      return [];
    }
    // interests는 { [categoryId]: order } 형태
    const sorted = Object.entries(interests)
      .sort(([, a], [, b]) => (a as number) - (b as number))
      .map(([id]) => categoryNameMap[id] || id);
    return sorted;
  }, [interests]);

  // 날짜 범위 계산 (현재 주의 시작일과 종료일)
  const currentWeekRange = useMemo(() => {
    const today = new Date();
    // selectedWeek에 따라 주를 이동
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

  // 읽은 글 데이터 (현재는 mock 데이터 사용)
  const readArticles = readArticlesMock;

  // 날짜 포맷팅 (YYYY-MM-DD -> MM.DD 요일)
  const formatDate = (dateStr: string, dayOfWeek: string) => {
    const [_year, month, day] = dateStr.split('-');
    return `${month}.${day} ${dayOfWeek}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Button
          title="설정 페이지로"
          variant="primary"
          style={styles.backButton}
          // 여기에 설정 페이지로 이동 로직 추가
          onPress={() => {
            console.log('설정 페이지로 이동');
            // navigation.navigate(RouteNames.FULL_SCREEN_STACK, {
            //   screen: RouteNames.SETTINGS,  // 실제 설정한 이름
            // });
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
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestTagText}>{tag}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>관심분야를 선택해주세요</Text>
            )}
          </View>
        </View>

        <Spacer num={24} />

        {/* 나의 레벨 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>나의 레벨</Text>
          <Spacer num={12} />
          <TouchableOpacity
            style={styles.levelButton}
            onPress={() => {
              // TODO: 레벨 선택 모달 표시
              console.log('레벨 선택');
            }}
          >
            <Text style={styles.levelText}>{getLevelText(difficulty)}</Text>
            <CheckIcon color={COLORS.gray600} />
          </TouchableOpacity>
        </View>

        <Spacer num={32} />

        {/* 읽은 글 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>읽은 글</Text>
          <Spacer num={16} />

          {/* 날짜 선택기 */}
          <View style={styles.dateSelector}>
            <TouchableOpacity onPress={() => setSelectedWeek(prev => prev - 1)}>
              <Text style={styles.dateArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.dateRange}>{currentWeekRange}</Text>
            <TouchableOpacity onPress={() => setSelectedWeek(prev => prev + 1)}>
              <Text style={styles.dateArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <Spacer num={20} />

          {/* 타임라인 */}
          {readArticles.map((dateGroup, groupIndex) => (
            <View key={groupIndex} style={styles.timelineGroup}>
              {/* 날짜 헤더 */}
              <View style={styles.timelineHeader}>
                <View style={styles.timelineDot} />
                <Text style={styles.timelineDate}>
                  {formatDate(dateGroup.date, dateGroup.dayOfWeek)}
                </Text>
                <Text style={styles.timelineCount}>{dateGroup.count}개</Text>
              </View>

              {/* 글 카드들 */}
              {dateGroup.articles.slice(0, 5).map(article => (
                <View key={article.id} style={styles.articleCard}>
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
              ))}

              {/* 전체 보기 버튼 */}
              {dateGroup.articles.length > 5 && (
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>전체 보기</Text>
                </TouchableOpacity>
              )}

              {groupIndex < readArticles.length - 1 && <Spacer num={24} />}
            </View>
          ))}
        </View>

        <Spacer num={40} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: scaleWidth(20),
  },
  backButton: {
    width: scaleWidth(50),
    height: scaleWidth(50),
    alignSelf: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
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
  section: {
    marginBottom: scaleWidth(24),
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
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scaleWidth(16),
  },
  dateArrow: {
    ...Heading_18EB_Round,
    color: COLORS.black,
    fontSize: scaleWidth(24),
  },
  dateRange: {
    ...Body_16M,
    color: COLORS.black,
  },
  timelineGroup: {
    marginBottom: scaleWidth(24),
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaleWidth(16),
  },
  timelineDot: {
    width: scaleWidth(8),
    height: scaleWidth(8),
    borderRadius: scaleWidth(4),
    backgroundColor: COLORS.gray400,
    marginRight: scaleWidth(8),
  },
  timelineDate: {
    ...Body_16M,
    color: COLORS.black,
    marginRight: scaleWidth(8),
  },
  timelineCount: {
    ...Caption_14R,
    color: COLORS.gray700,
  },
  articleCard: {
    padding: scaleWidth(16),
    borderRadius: BORDER_RADIUS[16],
    backgroundColor: COLORS.white,
    borderWidth: scaleWidth(1),
    borderColor: COLORS.gray300,
    marginBottom: scaleWidth(12),
  },
  articleTitle: {
    ...Body_16M,
    color: COLORS.black,
    marginBottom: scaleWidth(12),
    lineHeight: scaleWidth(24),
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    paddingHorizontal: scaleWidth(8),
    paddingVertical: scaleWidth(4),
    borderRadius: BORDER_RADIUS[8],
    backgroundColor: COLORS.gray100,
  },
  categoryTagText: {
    ...Caption_12M,
    color: COLORS.gray700,
  },
  quizBadge: {
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleWidth(6),
    borderRadius: BORDER_RADIUS[8],
  },
  quizBadgeCorrect: {
    backgroundColor: COLORS.blue[5],
  },
  quizBadgeIncorrect: {
    backgroundColor: COLORS.red.main,
  },
  quizBadgeText: {
    ...Caption_12M,
  },
  quizBadgeTextCorrect: {
    color: COLORS.blue[6],
  },
  quizBadgeTextIncorrect: {
    color: COLORS.red.main,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: scaleWidth(12),
  },
  viewAllText: {
    ...Body_16M,
    color: COLORS.gray700,
  },
});

export default MyPageScreen;
