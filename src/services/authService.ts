/**
 * 인증 관련 서비스
 * 서버 API 연동 시 이 파일을 수정하여 실제 인증 로직 구현
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRecentLogin, RecentLoginInfo } from './authStorageService';
import { signOutSocial, SocialLoginProvider } from './socialLoginService';

export interface AuthStatus {
  isAuthenticated: boolean;
  userInfo?: RecentLoginInfo;
}

/**
 * 현재 인증 상태 확인
 * @returns Promise<AuthStatus>
 */
export const checkAuthStatus = async (): Promise<AuthStatus> => {
  try {
    // 1. 로컬 스토리지에서 최근 로그인 정보 확인
    const recentLogin = await getRecentLogin();

    if (!recentLogin) {
      return { isAuthenticated: false };
    }

    // TODO: 서버 API로 토큰 검증 (필요 시 구현)
    // 현재는 API 호출 시 서버가 401/403을 반환하면 client.ts의 인터셉터에서 처리

    // 현재는 로컬 정보만 확인
    return {
      isAuthenticated: true,
      userInfo: recentLogin,
    };
  } catch (error) {
    console.error('인증 상태 확인 중 오류:', error);
    return { isAuthenticated: false };
  }
};

const REFRESH_TOKEN_KEY = '@refresh_token';
const USER_INFO_KEY = '@user_info';

/**
 * 인증 토큰 저장
 * @param token 인증 토큰
 */
export const saveAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('@auth_token', token);
  } catch (error) {
    console.error('토큰 저장 실패:', error);
  }
};

/**
 * 리프레시 토큰 저장
 * @param refreshToken 리프레시 토큰
 */
export const saveRefreshToken = async (refreshToken: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('리프레시 토큰 저장 실패:', error);
  }
};

/**
 * 리프레시 토큰 조회
 * @returns Promise<string | null>
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('리프레시 토큰 조회 실패:', error);
    return null;
  }
};

/**
 * 사용자 정보 저장 (provider, loginTime 포함)
 * @param userInfo 사용자 정보
 */
export const saveUserInfo = async (userInfo: {
  userId: number;
  name?: string;
  email?: string;
  profileImage?: string;
  provider?: string;
  loginTime?: number;
}): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  } catch (error) {
    console.error('사용자 정보 저장 실패:', error);
  }
};

/**
 * 사용자 정보 조회
 * @returns Promise<UserInfo | null>
 */
export const getUserInfo = async (): Promise<{
  userId: number;
  name?: string;
  email?: string;
  profileImage?: string;
  provider?: string;
  loginTime?: number;
} | null> => {
  try {
    // 테스트용: userId를 7로 하드코딩
    const data = await AsyncStorage.getItem(USER_INFO_KEY);
    if (data) {
      const userInfo = JSON.parse(data);
      return {
        ...userInfo,
        userId: 7, // 하드코딩된 userId (토큰의 sub와 일치)
      };
    }
    // 저장된 정보가 없어도 테스트용 userId 반환
    return {
      userId: 7,
      name: '테스트 사용자',
      email: 'test@example.com',
      provider: 'test',
      loginTime: Date.now(),
    };
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    // 에러 발생 시에도 테스트용 userId 반환
    return {
      userId: 7,
      name: '테스트 사용자',
      email: 'test@example.com',
      provider: 'test',
      loginTime: Date.now(),
    };
  }
};

/**
 * 인증 토큰 조회
 * @returns Promise<string | null>
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('@auth_token');
  } catch (error) {
    console.error('토큰 조회 실패:', error);
    return null;
  }
};

/**
 * 사용자 정보 삭제 (로그아웃 시)
 */
export const clearUserInfo = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_INFO_KEY);
  } catch (error) {
    console.error('사용자 정보 삭제 실패:', error);
  }
};

/**
 * 로그아웃 - 모든 로그인 정보 및 온보딩 상태 초기화
 * @param provider 소셜 로그인 제공자 (선택사항)
 */
export const logout = async (provider?: SocialLoginProvider): Promise<void> => {
  try {
    // 1. 소셜 로그인 로그아웃
    if (provider) {
      await signOutSocial(provider);
    }

    // 2. 로컬 사용자 정보 삭제
    await clearUserInfo();

    console.log('로그아웃 완료');
  } catch (error) {
    console.error('로그아웃 중 오류:', error);
  }
};

/**
 * 모든 인증 및 온보딩 정보 초기화 (개발/테스트용)
 */
export const clearAllAuthData = async (): Promise<void> => {
  try {
    // 사용자 정보 삭제
    await clearUserInfo();

    // 온보딩 상태 초기화는 onboardingStore.resetOnboarding()에서 처리
    // 이 함수는 authService에서만 처리하므로 여기서는 로그인 정보만 삭제

    console.log('모든 인증 정보 초기화 완료');
  } catch (error) {
    console.error('인증 정보 초기화 중 오류:', error);
  }
};
