import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  getAuthToken,
  getRefreshToken,
  saveAuthToken,
  saveRefreshToken,
} from '../services/authService';
import { refreshToken } from './authApi';

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
      try {
        const token = await getAuthToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('토큰 가져오기 실패:', error);
        }
      }
    }

    // 개발 모드일 때 로그 출력 (디버깅용)
    if (__DEV__) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
      );
      if (config.data) {
        console.log('[API Request Data]', JSON.stringify(config.data, null, 2));
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

    if (__DEV__) {
      console.error(`[API Error] ${originalRequest?.url}`, error.message);

      if (error.response) {
        // 서버가 응답했지만 에러 상태 코드
        console.error('[API Error Response]', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
      } else if (error.request) {
        console.error('[API Error Request]', {
          message: 'No response received from server',
          url: originalRequest?.url,
        });
      } else {
        console.error('[API Error Config]', error.message);
      }
    }

    // 403 에러 발생 시 토큰 재발급 시도
    if (
      error.response?.status === 403 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // 토큰 재발급 API 자체가 403을 반환하면 무한 루프 방지
      if (originalRequest.url?.includes('/api/auth/refresh')) {
        if (__DEV__) {
          console.error(
            '[토큰 재발급] 재발급 API도 403 에러 발생 - 로그아웃 필요',
          );
        }
        return Promise.reject(error);
      }

      // 이미 재발급 중이면 에러 반환 (동시 요청은 각자 처리)
      if (isRefreshing) {
        if (__DEV__) {
          console.warn('[토큰 재발급] 이미 재발급 중입니다. 요청 실패');
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        if (__DEV__) {
          console.log('[토큰 재발급] 시작');
        }

        const refreshTokenValue = await getRefreshToken();
        if (!refreshTokenValue) {
          if (__DEV__) {
            console.error('[토큰 재발급] 리프레시 토큰이 없습니다');
          }
          isRefreshing = false;
          return Promise.reject(error);
        }

        // 토큰 재발급 API 호출
        const refreshResponse = await refreshToken(refreshTokenValue);
        const newAccessToken = refreshResponse.data?.accessToken;

        if (!newAccessToken) {
          throw new Error('토큰 재발급 응답에 accessToken이 없습니다');
        }

        // 새 토큰 저장
        await saveAuthToken(newAccessToken);
        const newRefreshToken = refreshResponse.data?.refreshToken;
        if (newRefreshToken) {
          await saveRefreshToken(newRefreshToken);
        }

        if (__DEV__) {
          console.log('[토큰 재발급] 성공 - 원래 요청 재시도');
        }

        // 원래 요청의 헤더에 새 토큰 설정
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // 원래 요청 재시도
        isRefreshing = false;
        return client(originalRequest);
      } catch (refreshError: any) {
        if (__DEV__) {
          console.error('[토큰 재발급] 실패:', refreshError);

          // 500 에러에 대한 상세 로깅
          if (refreshError.response?.status === 500) {
            console.error('[토큰 재발급] 서버 내부 오류 (500):', {
              status: refreshError.response.status,
              data: refreshError.response.data,
              message:
                '서버 측 문제로 토큰 재발급에 실패했습니다. 서버 관리자에게 문의하세요.',
            });
          } else if (
            refreshError.response?.status === 401 ||
            refreshError.response?.status === 403
          ) {
            console.error('[토큰 재발급] 인증 실패:', {
              status: refreshError.response.status,
              data: refreshError.response.data,
              message:
                '리프레시 토큰이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.',
            });
          }
        }
        isRefreshing = false;

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
