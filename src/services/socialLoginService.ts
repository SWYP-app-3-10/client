import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  login as kakaoLogin,
  getProfile as getKakaoProfile,
  logout as kakaoLogout,
} from '@react-native-seoul/kakao-login';
import NaverLogin, {
  GetProfileResponse,
} from '@react-native-seoul/naver-login';
import { GOOGLE_CONFIG, NAVER_CONFIG } from '../config/socialLoginConfig';
import appleAuth from '@invertase/react-native-apple-authentication';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from '@react-native-firebase/auth';
// 소셜 로그인 타입
export type SocialLoginProvider = 'google' | 'kakao' | 'naver' | 'apple';

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
    const signInResult = await GoogleSignin.signIn();
    const signInData = (signInResult as any).data;
    const idToken = signInData?.idToken;

    if (!idToken) {
      throw new Error('Google ID Token이 없습니다.');
    }

    const authInstance = getAuth();
    const googleCredential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(
      authInstance,
      googleCredential,
    );
    const firebaseUser = userCredential.user;

    return {
      success: true,
      provider: 'google',
      accessToken: idToken,
      userInfo: {
        id: firebaseUser.uid,
        email: firebaseUser.email || undefined,
        name: firebaseUser.displayName || undefined,
        profileImage: firebaseUser.photoURL || undefined,
      },
    };
  } catch (error: any) {
    console.error('구글 로그인 에러:', error);
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
    const authInstance = getAuth();
    await signOut(authInstance);
  } catch (error) {
    console.error('구글 로그아웃 실패:', error);
  }
};

// 카카오 로그인
export const signInWithKakao = async (): Promise<SocialLoginResult> => {
  try {
    const token = await kakaoLogin();
    const profile = await getKakaoProfile();
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
    case 'apple':
      return signInWithApple();
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
// 애플 로그인
export const signInWithApple = async (): Promise<SocialLoginResult> => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    if (credentialState === appleAuth.State.AUTHORIZED) {
      const token = appleAuthRequestResponse.identityToken;
      return {
        success: true,
        provider: 'apple',
        accessToken: token || undefined,
        userInfo: {
          id: appleAuthRequestResponse.user || '',
          email: appleAuthRequestResponse.email || undefined,
          name: appleAuthRequestResponse.fullName?.givenName || undefined,
          profileImage: undefined, // 애플은 프로필 이미지를 제공하지 않음
        },
      };
    } else {
      return {
        success: false,
        provider: 'apple',
        error: '애플 로그인 취소',
      };
    }
  } catch (err: any) {
    console.error('애플 로그인 에러:', err);
    return {
      success: false,
      provider: 'apple',
      error: err.message || '애플 로그인 실패',
    };
  }
};
