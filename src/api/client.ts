import axios from 'axios';
import {Platform} from 'react-native';

// 1. 환경 변수 및 URL 설정
// 실제 배포 시에는 PROD_URL만 사용되지만, 로컬 개발을 위해 분기합니다.
const PROD_URL = 'https://api.your-backend.com'; // 배포된 백엔드 주소

// 안드로이드 에뮬레이터는 10.0.2.2, iOS 시뮬레이터는 localhost를 사용해야 내 컴퓨터에 접속됩니다.
const DEV_URL = Platform.select({
  android: 'http://10.0.2.2:8080', // 백엔드 포트 번호에 맞게 수정 (예: 3000, 8080)
  ios: 'http://localhost:8080', // 백엔드 포트 번호에 맞게 수정
});

// 2. Axios Instance 생성
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
    // 예: AsyncStorage에서 토큰을 가져오는 로직이 있다면 여기에 추가
    // const token = await AsyncStorage.getItem('userToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // 개발 모드일 때 로그 출력 (디버깅용)
    if (__DEV__) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
      );
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 4. 응답 인터셉터 (Response Interceptor)
// 응답을 받은 직후에 실행됩니다. (에러 처리나 데이터 가공)
client.interceptors.response.use(
  response => {
    // 백엔드에서 주는 데이터 구조에 따라 response.data만 바로 리턴하기도 함
    return response;
  },
  error => {
    if (__DEV__) {
      console.error(`[API Error] ${error.config?.url}`, error.message);
    }

    // 예: 401 Unauthorized 에러 발생 시 로그아웃 처리 등을 여기서 공통으로 함
    if (error.response && error.response.status === 401) {
      // 로그아웃 로직...
    }

    return Promise.reject(error);
  },
);

export default client;
