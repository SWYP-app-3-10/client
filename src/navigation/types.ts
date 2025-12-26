import {
  NavigatorScreenParams,
  CompositeNavigationProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteNames } from '../../routes';
import { NewsCategory } from '../data/mock/searchData';

// Onboarding Stack Param List
export type OnboardingStackParamList = {
  [RouteNames.DIFFICULTY_SETTING]: undefined;
  [RouteNames.INTERESTS]: { editMode?: boolean };
  [RouteNames.INTRO_CARDLIST]: undefined;
  [RouteNames.INTRO_FUNCTION]: undefined;
  [RouteNames.INTRO_SEARCH]: undefined;
  [RouteNames.SOCIAL_LOGIN]: undefined;
};

// Main Tab Param List (Bottom Tab Navigator)
export type MainTabParamList = {
  [RouteNames.MISSION_TAB]: NavigatorScreenParams<MissionStackParamList>;
  [RouteNames.CHARACTER_TAB]: NavigatorScreenParams<CharacterStackParamList>;
  [RouteNames.SEARCH_TAB]: NavigatorScreenParams<SearchStackParamList>;
  [RouteNames.MY_PAGE_TAB]: NavigatorScreenParams<MyPageStackParamList>;
};

// FullScreen Stack Param List (탭바 없는 전체 화면들)
export type FullScreenStackParamList = {
  [RouteNames.CHARACTER_NOTIFICATION]: undefined;
  [RouteNames.ARTICLE_DETAIL]: {
    articleId: number;
    returnTo?: 'mission' | 'search';
  };
  [RouteNames.READ_ARTICLE_DETAIL]: {
    articleId: number;
  };
  [RouteNames.QUIZ]: { articleId: number; returnTo?: 'mission' | 'search' };
  [RouteNames.AD_LOADING]: {
    articleId: number;
    returnTo?: 'mission' | 'search';
  };
  [RouteNames.CHARACTER_CRITERIA]: undefined;
  [RouteNames.CHARACTER_POINT_HISTORY]: undefined;
  // 추후 탭바 없는 다른 화면들 추가 가능
};

// Root Stack Param List (최상위 네비게이터)
export type RootStackParamList = {
  [RouteNames.ONBOARDING]: NavigatorScreenParams<OnboardingStackParamList>;
  [RouteNames.MAIN_TAB]: NavigatorScreenParams<MainTabParamList>;
  [RouteNames.FULL_SCREEN_STACK]: NavigatorScreenParams<FullScreenStackParamList>;
};

// Mission Stack Param List
export type MissionStackParamList = {
  [RouteNames.MISSION]: undefined;
};

// Character Stack Param List
export type CharacterStackParamList = {
  [RouteNames.CHARACTER]: undefined;
  [RouteNames.CHARACTER_CRITERIA]: undefined; // 기준 확인하기 (탭 2개 있는 화면)
  [RouteNames.CHARACTER_POINT_HISTORY]: undefined;
};

// Search Stack Param List
export type SearchStackParamList = {
  [RouteNames.SEARCH]:
    | {
        keyword?: string;
        initialCategory?: NewsCategory;
      }
    | undefined;
  [RouteNames.SEARCH_INPUT]: undefined; // 검색어 입력 화면
};

// MyPage Stack Param List
export type MyPageStackParamList = {
  [RouteNames.MY_PAGE]: undefined;
  [RouteNames.COMPONENT_SHOWCASE]: undefined;
  [RouteNames.SETTINGS]: undefined;
  [RouteNames.LOGIN_INFO]: undefined;
  [RouteNames.INQUIRY]: undefined;
  [RouteNames.TERMS_OF_SERVICE]: undefined;
};

/**
 * 메인 탭 내부 스택 네비게이션 타입 헬퍼
 *
 * 각 탭 스택(Mission, Character, Search, MyPage)에서 사용하는 통합 네비게이션 타입
 * - 자신의 스택 네비게이션
 * - 탭 네비게이션
 * - 루트 네비게이션
 *
 * @example
 * // MissionScreen에서 사용
 * type NavigationProp = MainTabNavigationProp<MissionStackParamList>;
 * const navigation = useNavigation<NavigationProp>();
 *
 * // CharacterScreen에서 사용
 * type NavigationProp = MainTabNavigationProp<CharacterStackParamList>;
 * const navigation = useNavigation<NavigationProp>();
 */
export type MainTabNavigationProp<StackParamList extends Record<string, any>> =
  CompositeNavigationProp<
    NativeStackNavigationProp<StackParamList>,
    CompositeNavigationProp<
      BottomTabNavigationProp<MainTabParamList>,
      NativeStackNavigationProp<RootStackParamList>
    >
  >;
