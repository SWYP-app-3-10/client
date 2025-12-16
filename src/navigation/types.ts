import {NavigatorScreenParams} from '@react-navigation/native';
import {RouteNames} from '../../routes';

// Root Stack Param List
export type OnboardingStackParamList = {
  [RouteNames.DIFFICULTY_SETTING]: undefined;
  [RouteNames.FEATURE_INTRO_01]: undefined;
  [RouteNames.INTERESTS]: undefined;
  [RouteNames.REWARD]: undefined;
};

// 2. 부모: 루트 스택 (온보딩 스택을 포함)
export type RootStackParamList = {
  [RouteNames.LOGIN]: undefined;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Maintab: NavigatorScreenParams<MainStackParamList>;
};
// Main Stack Param List
export type MainStackParamList = {
  [RouteNames.MISSION]: undefined;
  [RouteNames.CHARACTER]: undefined;
  [RouteNames.SEARCH]: undefined;
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
  // 서브 화면들 추가 예정
  // 예시: 'character-detail': {characterId: string};
};

// Search Stack Param List
export type SearchStackParamList = {
  [RouteNames.SEARCH]: undefined;
  // 서브 화면들 추가 예정
  // 예시: 'post-detail': {postId: string};
};

// MyPage Stack Param List
export type MyPageStackParamList = {
  [RouteNames.MY_PAGE]: undefined;
  [RouteNames.COMPONENT_SHOWCASE]: undefined;
  // 서브 화면들 추가 예정
  // 예시: 'settings': undefined;
};
