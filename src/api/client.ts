import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  getAuthToken,
  getRefreshToken,
  saveAuthToken,
  saveRefreshToken,
} from '../services/authService';
import { refreshToken } from './authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOnboardingStore } from '../store/onboardingStore';

const PROD_URL = 'http://175.45.193.98:8080';
// const PROD_URL = 'https://api.your-backend.com';
const DEV_URL = 'http://175.45.193.98:8080';

const client = axios.create({
  // 배포 빌드에서도 개발 서버를 사용할 수 있도록 설정
  baseURL: __DEV__ ? DEV_URL : PROD_URL,
  timeout: 10000, // 10초 타임아웃 (네트워크가 느릴 때 무한 대기 방지)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 재발급 중인지 확인하는 플래그 (무한 루프 방지)
let isRefreshing = false;

// 3. 요청 인터셉터 (Request Interceptor)
// 요청을 보내기 직전에 실행됩니다. (주로 토큰 넣을 때 사용)
client.interceptors.request.use(
  async config => {
    // refresh API 호출 시에는 Authorization 헤더를 제거
    if (config.url?.includes('/api/auth/refresh')) {
      if (config.headers) {
        delete config.headers.Authorization;
      }
    } else {
      // AsyncStorage에서 토큰을 가져와서 헤더에 추가
      const token = await getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 4. 응답 인터셉터 (Response Interceptor)
client.interceptors.response.use(
  response => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    // 401 에러 발생 시 바로 로그인 화면으로 이동
    if (error.response?.status === 401 && originalRequest) {
      // 토큰 재발급 API 자체가 401을 반환하면 무한 루프 방지

      // 401 에러 발생 시 토큰 삭제 및 온보딩 상태 초기화
      await AsyncStorage.multiRemove([
        '@auth_token',
        '@refresh_token',
        '@user_info',
      ]);
      // 온보딩 상태 초기화 (로그인 화면으로 이동하기 위해)
      await AsyncStorage.setItem('@onboarding_completed', 'false');
      await AsyncStorage.setItem('@onboarding_step', 'login');
      // Zustand store도 업데이트하여 RootNavigator가 감지하도록 함
      useOnboardingStore.getState().resetOnboarding();

      return Promise.reject(error);
    }

    // 403 에러 발생 시 토큰 재발급 시도
    if (
      error.response?.status === 403 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // 토큰 재발급 API 자체가 403을 반환하면 무한 루프 방지
      if (originalRequest.url?.includes('/api/auth/refresh')) {
        // 403 에러 발생 시 토큰 삭제 및 온보딩 상태 초기화
        await AsyncStorage.multiRemove([
          '@auth_token',
          '@refresh_token',
          '@user_info',
        ]);
        // 온보딩 상태 초기화 (로그인 화면으로 이동하기 위해)
        await AsyncStorage.setItem('@onboarding_completed', 'false');
        await AsyncStorage.setItem('@onboarding_step', 'login');
        // Zustand store도 업데이트하여 RootNavigator가 감지하도록 함
        useOnboardingStore.getState().resetOnboarding();

        return Promise.reject(error);
      }

      // 이미 재발급 중이면 에러 반환 (동시 요청은 각자 처리)
      if (isRefreshing) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshTokenValue = await getRefreshToken();
        if (!refreshTokenValue) {
          isRefreshing = false;
          return Promise.reject(error);
        }

        // 토큰 재발급 API 호출
        const refreshResponse = await refreshToken(refreshTokenValue);
        // data 래퍼가 있으면 data에서, 없으면 직접 접근 (하위 호환성)
        const newAccessToken =
          refreshResponse.data?.accessToken || refreshResponse.accessToken;

        if (!newAccessToken) {
          throw new Error('토큰 재발급 응답에 accessToken이 없습니다');
        }

        // 새 토큰 저장
        await saveAuthToken(newAccessToken);
        const newRefreshToken =
          refreshResponse.data?.refreshToken || refreshResponse.refreshToken;
        if (newRefreshToken) {
          await saveRefreshToken(newRefreshToken);
        }
      } catch (refreshError: any) {
        isRefreshing = false;

        // 401/403 에러 발생 시 토큰 삭제 및 온보딩 상태 초기화
        if (
          refreshError.response?.status === 401 ||
          refreshError.response?.status === 403
        ) {
          await AsyncStorage.multiRemove([
            '@auth_token',
            '@refresh_token',
            '@user_info',
          ]);
          // 온보딩 상태 초기화 (로그인 화면으로 이동하기 위해)
          await AsyncStorage.setItem('@onboarding_completed', 'false');
          await AsyncStorage.setItem('@onboarding_step', 'login');
          // Zustand store도 업데이트하여 RootNavigator가 감지하도록 함
          useOnboardingStore.getState().resetOnboarding();
        }

        if (refreshError.response?.status === 500) {
          return Promise.reject(refreshError);
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default client;
