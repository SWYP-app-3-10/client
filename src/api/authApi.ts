/**
 * 인증 관련 API
 */
import client from './client';
import { SocialLoginProvider } from '../services/socialLoginService';

export interface LoginRequest {
  accessToken: string;
  email?: string;
  name?: string;
  profileImage?: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    userInfo?: {
      userId: number;
      name?: string;
      email?: string;
      profileImage?: string;
    };
    newUser?: boolean;
  };
  token?: string; // 하위 호환성
  refreshToken?: string; // 하위 호환성
  user?: {
    id: string;
    email?: string;
    name?: string;
    profileImage?: string;
  };
  message?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  message?: string;
}

/**
 * 소셜 로그인 API 호출
 * @param provider 소셜 로그인 제공자 (google, kakao, naver, apple) - URL 경로에 포함
 * @param loginData 로그인 데이터 (accessToken, email, name, profileImage 등) - Body에 포함
 */
export const loginWithProvider = async (
  provider: SocialLoginProvider,
  loginData: LoginRequest,
): Promise<LoginResponse> => {
  try {
    // Provider 및 요청 데이터 로그
    const response = await client.post<LoginResponse>(
      `/api/auth/login/${provider}`,
      loginData,
    );

    console.log(
      '[로그인 API] 응답 성공:',
      JSON.stringify(response.data, null, 2),
    );
    console.log('[로그인 API] 응답에 token이 있는지:', !!response.data.token);

    return response.data;
  } catch (error: any) {
    console.error('로그인 API 에러:', error);
    throw error;
  }
};

/**
 * 토큰 갱신 API 호출
 * @param refreshTokenValue 갱신 토큰
 */
export const refreshToken = async (
  refreshTokenValue: string,
): Promise<RefreshTokenResponse> => {
  try {
    console.log('[토큰 갱신 API] 요청 시작');
    const response = await client.post<RefreshTokenResponse>(
      '/api/auth/refresh',
      { refreshToken: refreshTokenValue },
    );

    console.log(
      '[토큰 갱신 API] 응답 성공:',
      JSON.stringify(response.data, null, 2),
    );

    return response.data;
  } catch (error: any) {
    console.error('[토큰 갱신 API] 에러:', error);
    if (error.response) {
      console.error('[토큰 갱신 API] 서버 응답:', {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw error;
  }
};
