import analytics from '@react-native-firebase/analytics';

/**
 * Firebase Analytics 서비스
 * 앱 내 이벤트 추적 및 사용자 행동 분석
 */

/**
 * 화면 조회 이벤트 로깅
 * @param screenName 화면 이름
 * @param screenClass 화면 클래스 (선택사항)
 */
export const logScreenView = async (
  screenName: string,
  screenClass?: string,
): Promise<void> => {
  try {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass || screenName,
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
