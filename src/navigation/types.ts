import {NavigatorScreenParams} from '@react-navigation/native';
import {RouteNames} from '../../routes';

import type {NewsCategory} from '../screens/main/search/search_mockData'; // 뉴스 카테고리

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
  /*
   * SearchScreen이 탐색/검색결과를 모두 담당
   * SearchInputScreen은 검색어 입력만 담당
   */

  /**
   * RouteNames.SEARCH('search') = SearchScreen
   * - keyword가 있으면 검색 결과 필터링 상태
   * - 없으면 전체 탐색 상태
   */
  [RouteNames.SEARCH]:
    | {
        keyword?: string;
        initialCategory?: NewsCategory;
      }
    | undefined;

  // 검색 입력 화면(SearchInputScreen)
  [RouteNames.SEARCH_INPUT]: undefined;
};

// MyPage Stack Param List
export type MyPageStackParamList = {
  [RouteNames.MY_PAGE]: undefined;
  // 서브 화면들 추가 예정
  // 예시: 'settings': undefined;
};
