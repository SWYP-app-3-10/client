import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  login as kakaoLogin,
  getProfile as getKakaoProfile,
  logout as kakaoLogout,
} from '@react-native-seoul/kakao-login';
import NaverLogin, {GetProfileResponse} from '@react-native-seoul/naver-login';
import {GOOGLE_CONFIG, NAVER_CONFIG} from '../config/socialLoginConfig';

// 소셜 로그인 타입
export type SocialLoginProvider = 'google' | 'kakao' | 'naver';

export interface SocialLoginResult {
  success: boolean;
  provider: SocialLoginProvider;
  accessToken?: string;
  userInfo?: {
    id: string;
    email?: string;
    name?: string;
    profileImage?: string;
  };
  error?: string;
}

// 구글 로그인 초기화
export const initializeGoogleSignIn = () => {
  try {
    GoogleSignin.configure({
      webClientId: GOOGLE_CONFIG.webClientId,
      offlineAccess: true,
    });
  } catch (error) {
    console.warn('구글 로그인 초기화 실패:', error);
  }
};

// 구글 로그인
export const signInWithGoogle = async (): Promise<SocialLoginResult> => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    return {
      success: true,
      provider: 'google',
      accessToken: userInfo.data?.idToken || undefined,
      userInfo: {
        id: userInfo.data?.user.id || '',
        email: userInfo.data?.user.email || undefined,
        name: userInfo.data?.user.name || undefined,
        profileImage: userInfo.data?.user.photo || undefined,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      provider: 'google',
      error: error.message || '구글 로그인 실패',
    };
  }
};

// 구글 로그아웃
export const signOutGoogle = async (): Promise<void> => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error('구글 로그아웃 실패:', error);
  }
};

// 카카오 로그인 초기화
export const initializeKakaoLogin = () => {
  try {
    // 카카오 SDK는 자동으로 초기화됩니다
    // 필요시 추가 설정을 여기에 추가
  } catch (error) {
    console.warn('카카오 로그인 초기화 실패:', error);
  }
};

// 카카오 로그인
export const signInWithKakao = async (): Promise<SocialLoginResult> => {
  try {
    const token = await kakaoLogin();
    const profile = await getKakaoProfile();

    // 카카오 프로필 타입에 따라 데이터 접근 방식 조정
    const profileData = profile as any;

    return {
      success: true,
      provider: 'kakao',
      accessToken: token.accessToken,
      userInfo: {
        id: profileData.id?.toString() || '',
        email: profileData.kakaoAccount?.email || undefined,
        name:
          profileData.kakaoAccount?.profile?.nickname ||
          profileData.nickname ||
          undefined,
        profileImage:
          profileData.kakaoAccount?.profile?.profileImageUrl ||
          profileData.profileImageUrl ||
          undefined,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      provider: 'kakao',
      error: error.message || '카카오 로그인 실패',
    };
  }
};

// 카카오 로그아웃
export const signOutKakao = async (): Promise<void> => {
  try {
    await kakaoLogout();
  } catch (error) {
    console.error('카카오 로그아웃 실패:', error);
  }
};

// 네이버 로그인 초기화
// 주의: 네이버 SDK는 네이티브 앱에서 consumerSecret이 필요하지만,
// 실제 사용자 정보 검증은 백엔드에서 해야 합니다.
export const initializeNaverLogin = () => {
  try {
    if (NaverLogin && typeof NaverLogin.initialize === 'function') {
      NaverLogin.initialize({
        appName: NAVER_CONFIG.appName,
        consumerKey: NAVER_CONFIG.consumerKey,
        consumerSecret: NAVER_CONFIG.consumerSecret,
        serviceUrlSchemeIOS: NAVER_CONFIG.serviceUrlScheme,
      });
    }
  } catch (error) {
    console.warn('네이버 로그인 초기화 실패:', error);
  }
};

// 네이버 로그인
export const signInWithNaver = async (): Promise<SocialLoginResult> => {
  try {
    const result = await NaverLogin.login();

    if (!result.isSuccess || !result.successResponse) {
      return {
        success: false,
        provider: 'naver',
        error: result.failureResponse?.message || '네이버 로그인 실패',
      };
    }

    const profileResult: GetProfileResponse = await NaverLogin.getProfile(
      result.successResponse.accessToken,
    );

    return {
      success: true,
      provider: 'naver',
      accessToken: result.successResponse.accessToken,
      userInfo: {
        id: profileResult.response?.id || '',
        email: profileResult.response?.email || undefined,
        name: profileResult.response?.name || undefined,
        profileImage: profileResult.response?.profile_image || undefined,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      provider: 'naver',
      error: error.message || '네이버 로그인 실패',
    };
  }
};

// 네이버 로그아웃
export const signOutNaver = async (): Promise<void> => {
  try {
    await NaverLogin.logout();
  } catch (error) {
    console.error('네이버 로그아웃 실패:', error);
  }
};

// 통합 소셜 로그인 함수
export const signInWithSocial = async (
  provider: SocialLoginProvider,
): Promise<SocialLoginResult> => {
  switch (provider) {
    case 'google':
      return signInWithGoogle();
    case 'kakao':
      return signInWithKakao();
    case 'naver':
      return signInWithNaver();
    default:
      return {
        success: false,
        provider,
        error: '지원하지 않는 소셜 로그인입니다',
      };
  }
};

// 통합 로그아웃 함수
export const signOutSocial = async (
  provider: SocialLoginProvider,
): Promise<void> => {
  switch (provider) {
    case 'google':
      await signOutGoogle();
      break;
    case 'kakao':
      await signOutKakao();
      break;
    case 'naver':
      await signOutNaver();
      break;
  }
};
