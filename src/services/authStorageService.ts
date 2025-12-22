import AsyncStorage from '@react-native-async-storage/async-storage';
import {SocialLoginProvider} from './socialLoginService';

export interface RecentLoginInfo {
  provider: SocialLoginProvider;
  userId: string;
  name?: string;
  profileImage?: string;
  loginTime: number; // timestamp
}

const RECENT_LOGIN_KEY = '@recent_login';

/**
 * 최근 로그인 정보를 로컬에 저장
 */
export const saveRecentLogin = async (
  loginInfo: RecentLoginInfo,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(RECENT_LOGIN_KEY, JSON.stringify(loginInfo));
  } catch (error) {
    console.error('최근 로그인 정보 저장 실패:', error);
  }
};

/**
 * 최근 로그인 정보를 로컬에서 불러오기
 */
export const getRecentLogin = async (): Promise<RecentLoginInfo | null> => {
  try {
    const data = await AsyncStorage.getItem(RECENT_LOGIN_KEY);
    if (data) {
      return JSON.parse(data) as RecentLoginInfo;
    }
    return null;
  } catch (error) {
    console.error('최근 로그인 정보 불러오기 실패:', error);
    return null;
  }
};

/**
 * 최근 로그인 정보 삭제 (로그아웃 시)
 */
export const clearRecentLogin = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(RECENT_LOGIN_KEY);
  } catch (error) {
    console.error('최근 로그인 정보 삭제 실패:', error);
  }
};
