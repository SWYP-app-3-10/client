import analytics from '@react-native-firebase/analytics';
import { RouteNames } from '../../routes';

/**
 * Firebase Analytics 서비스
 * 앱 내 이벤트 추적 및 사용자 행동 분석
 */

/**
 * 화면 이름 매핑 테이블
 */
const screenNameMap: Record<string, string> = {
  // 온보딩
  [RouteNames.INTRO_CARDLIST]: 'Onboarding_Function01_CardList',
  [RouteNames.INTRO_FUNCTION]: 'Onboarding_Function02_Character',
  [RouteNames.INTRO_SEARCH]: 'Onboarding_Function03_Explore',
  [RouteNames.SOCIAL_LOGIN]: 'Onboarding_SocialLogin',
  [RouteNames.TERMS_AGREEMENT]: 'AgreeToTerms',

  // 메인 탭
  [RouteNames.MY_PAGE_TAB]: '마이페이지',

  // 미션
  [RouteNames.MISSION]: 'Home',
  [RouteNames.ARTICLE_DETAIL]: 'Reading',
  [RouteNames.READ_ARTICLE_DETAIL]: 'ReadingDetails',
  [RouteNames.QUIZ]: 'Quiz',

  // 광고
  [RouteNames.AD_LOADING]: 'Advertisement',

  // 검색
  [RouteNames.SEARCH]: 'Explore',
  [RouteNames.SEARCH_INPUT]: 'Search',

  // 캐릭터
  [RouteNames.CHARACTER]: 'Character',
  [RouteNames.CHARACTER_POINT_HISTORY]: 'ConfirmEarnedHistory',
  [RouteNames.CHARACTER_NOTIFICATION]: 'Alarm',

  // 마이페이지
  [RouteNames.MY_PAGE]: 'My',
};

/**
 * 화면 이름을 사용자 친화적인 이름으로 매핑
 * @param routeName 라우트 이름
 * @returns 매핑된 화면 이름 또는 null (매핑되지 않은 경우)
 */
const getScreenName = (routeName: string): string | null => {
  return screenNameMap[routeName] || null;
};

/**
 * 화면이 매핑되어 있는지 확인
 * @param routeName 라우트 이름
 * @returns 매핑 여부
 */
export const isScreenMapped = (routeName: string): boolean => {
  return routeName in screenNameMap;
};

/**
 * 화면 조회 이벤트 로깅
 * @param screenName 화면 이름 (RouteNames 또는 사용자 지정 이름)
 * @param screenClass 화면 클래스 (선택사항)
 * @param forceLog 매핑되지 않은 경우에도 강제로 로그 기록 (기본값: false)
 */
export const logScreenView = async (
  screenName: string,
  screenClass?: string,
  forceLog: boolean = false,
): Promise<void> => {
  try {
    // RouteNames인 경우 매핑 확인
    const mappedName = getScreenName(screenName);

    // 매핑되지 않았고 forceLog가 false인 경우 로그를 찍지 않음
    if (!mappedName && !forceLog) {
      return;
    }

    // 매핑된 이름이 있으면 사용, 없으면 원래 이름 사용 (forceLog인 경우)
    const finalScreenName = mappedName || screenName;
    await analytics().logScreenView({
      screen_name: finalScreenName,
      screen_class: screenClass || finalScreenName,
    });
  } catch (error) {
    console.error('Analytics logScreenView 오류:', error);
  }
};

/**
 * 커스텀 이벤트 로깅
 * @param eventName 이벤트 이름
 * @param params 이벤트 파라미터 (선택사항)
 */
export const logEvent = async (
  eventName: string,
  params?: Record<string, any>,
): Promise<void> => {
  try {
    await analytics().logEvent(eventName, params);
  } catch (error) {
    console.error('Analytics logEvent 오류:', error);
  }
};

/**
 * 사용자 속성 설정
 * @param name 속성 이름
 * @param value 속성 값
 */
export const setUserProperty = async (
  name: string,
  value: string,
): Promise<void> => {
  try {
    await analytics().setUserProperty(name, value);
  } catch (error) {
    console.error('Analytics setUserProperty 오류:', error);
  }
};

/**
 * 사용자 ID 설정
 * @param userId 사용자 ID
 */
export const setUserId = async (userId: string | null): Promise<void> => {
  try {
    await analytics().setUserId(userId);
  } catch (error) {
    console.error('Analytics setUserId 오류:', error);
  }
};

/**
 * Analytics 수집 활성화/비활성화
 * @param enabled 활성화 여부
 */
export const setAnalyticsCollectionEnabled = async (
  enabled: boolean,
): Promise<void> => {
  try {
    await analytics().setAnalyticsCollectionEnabled(enabled);
  } catch (error) {
    console.error('Analytics setAnalyticsCollectionEnabled 오류:', error);
  }
};

/**
 * 앱 시작 이벤트
 */
export const logAppOpen = async (): Promise<void> => {
  try {
    await logEvent('app_open');
  } catch (error) {
    console.error('Analytics logAppOpen 오류:', error);
  }
};

/**
 * 로그인 이벤트
 * @param method 로그인 방법 (google, kakao, naver, apple)
 */
export const logLogin = async (method: string): Promise<void> => {
  try {
    await logEvent('login', { method });
  } catch (error) {
    console.error('Analytics logLogin 오류:', error);
  }
};

/**
 * 회원가입 이벤트
 * @param method 회원가입 방법
 */
export const logSignUp = async (method: string): Promise<void> => {
  try {
    await logEvent('sign_up', { method });
  } catch (error) {
    console.error('Analytics logSignUp 오류:', error);
  }
};

/**
 * 퀴즈 시작 이벤트
 * @param quizId 퀴즈 ID
 * @param difficulty 난이도
 */
export const logQuizStart = async (
  quizId: string,
  difficulty?: string,
): Promise<void> => {
  try {
    await logEvent('quiz_start', {
      quiz_id: quizId,
      difficulty,
    });
  } catch (error) {
    console.error('Analytics logQuizStart 오류:', error);
  }
};

/**
 * 퀴즈 완료 이벤트
 * @param quizId 퀴즈 ID
 * @param score 점수
 * @param totalQuestions 전체 문제 수
 */
export const logQuizComplete = async (
  quizId: string,
  score: number,
  totalQuestions: number,
): Promise<void> => {
  try {
    await logEvent('quiz_complete', {
      quiz_id: quizId,
      score,
      total_questions: totalQuestions,
    });
  } catch (error) {
    console.error('Analytics logQuizComplete 오류:', error);
  }
};

/**
 * 아티클 조회 이벤트
 * @param articleId 아티클 ID
 * @param articleTitle 아티클 제목
 */
export const logArticleView = async (
  articleId: string,
  articleTitle?: string,
): Promise<void> => {
  try {
    await logEvent('article_view', {
      article_id: articleId,
      article_title: articleTitle,
    });
  } catch (error) {
    console.error('Analytics logArticleView 오류:', error);
  }
};

/**
 * 검색 이벤트
 * @param searchTerm 검색어
 */
export const logSearch = async (searchTerm: string): Promise<void> => {
  try {
    await logEvent('search', {
      search_term: searchTerm,
    });
  } catch (error) {
    console.error('Analytics logSearch 오류:', error);
  }
};
