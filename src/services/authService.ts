/**
 * 인증 관련 서비스
 * 서버 API 연동 시 이 파일을 수정하여 실제 인증 로직 구현
 */

import {getRecentLogin, RecentLoginInfo} from './authStorageService';

export interface AuthStatus {
  isAuthenticated: boolean;
  userInfo?: RecentLoginInfo;
}

/**
 * 현재 인증 상태 확인
 * 로컬 스토리지의 최근 로그인 정보를 확인하고,
 * 나중에 서버 API로 토큰 검증 등을 추가할 수 있음
 *
 * @returns Promise<AuthStatus>
 */
export const checkAuthStatus = async (): Promise<AuthStatus> => {
  try {
    // 1. 로컬 스토리지에서 최근 로그인 정보 확인
    const recentLogin = await getRecentLogin();

    if (!recentLogin) {
      return {isAuthenticated: false};
    }

    // TODO: 서버 API로 토큰 검증
    // 예시:
    // const token = await getAuthToken(); // AsyncStorage에서 토큰 가져오기
    // if (token) {
    //   const isValid = await validateToken(token); // 서버에 토큰 검증 요청
    //   if (!isValid) {
    //     await clearRecentLogin(); // 토큰이 유효하지 않으면 로컬 정보 삭제
    //     return {isAuthenticated: false};
    //   }
    // }

    // 현재는 로컬 정보만 확인
    return {
      isAuthenticated: true,
      userInfo: recentLogin,
    };
  } catch (error) {
    console.error('인증 상태 확인 중 오류:', error);
    return {isAuthenticated: false};
  }
};

/**
 * 서버에 토큰 검증 요청 (나중에 구현)
 * @param token 인증 토큰
 * @returns Promise<boolean> 토큰 유효성
 */
export const validateToken = async (token: string): Promise<boolean> => {
  // TODO: 실제 서버 API 호출
  // 예시:
  // try {
  //   const response = await fetch('https://api.example.com/auth/validate', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`,
  //     },
  //   });
  //   return response.ok;
  // } catch (error) {
  //   console.error('토큰 검증 실패:', error);
  //   return false;
  // }

  // 현재는 더미 구현
  return true;
};

/**
 * 인증 토큰 저장 (나중에 구현)
 * @param token 인증 토큰
 */
export const saveAuthToken = async (token: string): Promise<void> => {
  // TODO: AsyncStorage에 토큰 저장
  // await AsyncStorage.setItem('@auth_token', token);
};

/**
 * 인증 토큰 조회 (나중에 구현)
 * @returns Promise<string | null>
 */
export const getAuthToken = async (): Promise<string | null> => {
  // TODO: AsyncStorage에서 토큰 가져오기
  // return await AsyncStorage.getItem('@auth_token');
  return null;
};
