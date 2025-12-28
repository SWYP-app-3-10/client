import axios from 'axios';
import { getAuthToken } from '../services/authService';

const PROD_URL = 'https://api.your-backend.com';
const DEV_URL = 'http://175.45.193.98:8080';

const client = axios.create({
  // __DEV__는 React Native에 내장된 전역 변수입니다.
  baseURL: __DEV__ ? DEV_URL : PROD_URL,
  timeout: 10000, // 10초 타임아웃 (네트워크가 느릴 때 무한 대기 방지)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. 요청 인터셉터 (Request Interceptor)
// 요청을 보내기 직전에 실행됩니다. (주로 토큰 넣을 때 사용)
client.interceptors.request.use(
  async config => {
    // AsyncStorage에서 토큰을 가져와서 헤더에 추가
    try {
      const token = await getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('토큰 가져오기 실패:', error);
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
  error => {
    if (__DEV__) {
      console.error(`[API Error] ${error.config?.url}`, error.message);

      if (error.response) {
        // 서버가 응답했지만 에러 상태 코드
        console.error('[API Error Response]', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
      } else if (error.request) {
      } else {
        console.error('[API Error Config]', error.message);
      }
    }
    if (error.response && error.response.status === 403) {
      try {
      } catch (refreshError) {
        console.error('토큰 재발급 실패:', refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default client;
