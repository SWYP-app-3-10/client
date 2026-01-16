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
 * @param eventName 이벤트 이름 (예: 'kakao_login_Onboarding_SocialLogin', 'quiz_start')
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
