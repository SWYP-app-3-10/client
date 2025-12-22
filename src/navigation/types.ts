import { NavigatorScreenParams } from '@react-navigation/native';
import { RouteNames } from '../../routes';
import { NewsCategory } from '../screens/search/search_mockData';

// Root Stack Param List
export type OnboardingStackParamList = {
  [RouteNames.DIFFICULTY_SETTING]: undefined;
  [RouteNames.INTERESTS]: undefined;
  [RouteNames.REWARD]: undefined;
  [RouteNames.INTRO_CARDLIST]: undefined;
  [RouteNames.INTRO_FUNCTION]: undefined;
  [RouteNames.INTRO_SEARCH]: undefined;
  [RouteNames.SOCIAL_LOGIN]: undefined;
};

// 2. 부모: 루트 스택 (온보딩 스택을 포함)
export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Maintab: NavigatorScreenParams<MainStackParamList>;
};
// Main Stack Param List
export type MainStackParamList = {
  [RouteNames.MISSION]: undefined;
  [RouteNames.CHARACTER]: NavigatorScreenParams<CharacterStackParamList>; // 캐릭터 스택
  [RouteNames.SEARCH]: NavigatorScreenParams<SearchStackParamList>; // 검색 스택
  [RouteNames.MY_PAGE]: undefined;
};

// Mission Stack Param List
export type MissionStackParamList = {
  [RouteNames.MISSION]: undefined;
  // 서브 화면들 추가 예정
  // 예시: 'mission-detail': {missionId: string};
};

// Character Stack Param List
export type CharacterStackParamList = {
  [RouteNames.CHARACTER]: undefined;
  [RouteNames.CHARACTER_CRITERIA]: undefined; // 기준 확인하기 (탭 2개 있는 화면)
  [RouteNames.CHARACTER_POINT_HISTORY]: undefined;
  [RouteNames.CHARACTER_NOTIFICATION]: undefined;
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
  // 서브 화면들 추가 예정
  // 예시: 'settings': undefined;
};
