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
  AppleAuthProvider,
  signInWithCredential,
  signOut,
} from '@react-native-firebase/auth';
import { loginWithProvider } from '../api/authApi';
import { saveAuthToken, saveRefreshToken, saveUserInfo } from './authService';
// 소셜 로그인 타입
export type SocialLoginProvider = 'GOOGLE' | 'KAKAO' | 'NAVER' | 'APPLE';

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
    await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();
    const idToken = tokens.idToken;

    if (!idToken) {
      console.error('Google ID Token이 없습니다. tokens:', tokens);
      throw new Error('Google ID Token이 없습니다.');
    }

    const authInstance = getAuth();
    const googleCredential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(
      authInstance,
      googleCredential,
    );
    const firebaseUser = userCredential.user;

    // 서버 API 호출 (필수)

    try {
      const loginResponse = await loginWithProvider('GOOGLE', {
        accessToken: tokens.accessToken,
        email: firebaseUser.email || undefined,
      });
      if (loginResponse.data) {
        if (loginResponse.data.accessToken) {
          await saveAuthToken(loginResponse.data.accessToken);
        }

        if (loginResponse.data.refreshToken) {
          await saveRefreshToken(loginResponse.data.refreshToken);
        }

        // userInfo 저장 (provider, loginTime 포함)
        if (loginResponse.data.userInfo) {
          await saveUserInfo({
            ...loginResponse.data.userInfo,
            provider: 'GOOGLE',
            loginTime: Date.now(),
          });
        }
      } else if (loginResponse.token) {
        await saveAuthToken(loginResponse.token);
        if (loginResponse.refreshToken) {
          await saveRefreshToken(loginResponse.refreshToken);
        }
        if (loginResponse.user) {
          await saveUserInfo({
            userId: parseInt(loginResponse.user.id, 10) || 0,
            name: loginResponse.user.name,
            email: loginResponse.user.email,
            profileImage: loginResponse.user.profileImage,
          });
        }
      } else {
        console.warn('서버에서 토큰을 받지 못했습니다.');
        console.warn('서버 응답:', JSON.stringify(loginResponse, null, 2));
        console.warn('서버 응답 필드:', Object.keys(loginResponse).join(', '));
      }
    } catch (apiError) {
      console.error('서버 로그인 API 호출 실패:', apiError);
      // 서버 API 실패 시 에러 반환 (토큰 없이는 이후 API 호출 불가)
      return {
        success: false,
        provider: 'GOOGLE',
        error: '서버 로그인에 실패했습니다. 다시 시도해주세요.',
      };
    }

    return {
      success: true,
      provider: 'GOOGLE',
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
      provider: 'GOOGLE',
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

    const userInfo = {
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
    };

    // 서버 API 호출
    try {
      const loginResponse = await loginWithProvider('KAKAO', {
        accessToken: token.accessToken,
        email: userInfo.email,
      });
      if (loginResponse.data) {
        if (loginResponse.data.accessToken) {
          await saveAuthToken(loginResponse.data.accessToken);
        }

        if (loginResponse.data.refreshToken) {
          await saveRefreshToken(loginResponse.data.refreshToken);
        }

        if (loginResponse.data.userInfo) {
          await saveUserInfo({
            ...loginResponse.data.userInfo,
            provider: 'GOOGLE',
            loginTime: Date.now(),
          });
        }
      } else if (loginResponse.token) {
        await saveAuthToken(loginResponse.token);
        if (loginResponse.refreshToken) {
          await saveRefreshToken(loginResponse.refreshToken);
        }
        if (loginResponse.user) {
          await saveUserInfo({
            userId: parseInt(loginResponse.user.id, 10) || 0,
            name: loginResponse.user.name,
            email: loginResponse.user.email,
            profileImage: loginResponse.user.profileImage,
          });
        }
      } else {
        console.warn('서버에서 토큰을 받지 못했습니다.');
        console.warn('서버 응답:', JSON.stringify(loginResponse, null, 2));
        console.warn('서버 응답 필드:', Object.keys(loginResponse).join(', '));
      }
    } catch (apiError) {
      console.error('서버 로그인 API 호출 실패:', apiError);
      // 서버 API 실패 시 에러 반환
      return {
        success: false,
        provider: 'KAKAO',
        error: '서버 로그인에 실패했습니다. 다시 시도해주세요.',
      };
    }

    return {
      success: true,
      provider: 'KAKAO',
      accessToken: token.accessToken,
      userInfo,
    };
  } catch (error: any) {
    return {
      success: false,
      provider: 'KAKAO',
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
        provider: 'NAVER',
        error: result.failureResponse?.message || '네이버 로그인 실패',
      };
    }

    const profileResult: GetProfileResponse = await NaverLogin.getProfile(
      result.successResponse.accessToken,
    );

    const userInfo = {
      id: profileResult.response?.id || '',
      email: profileResult.response?.email || undefined,
      name: profileResult.response?.name || undefined,
      profileImage: profileResult.response?.profile_image || undefined,
    };

    // 서버 API 호출
    try {
      const loginResponse = await loginWithProvider('NAVER', {
        accessToken: result.successResponse.accessToken,
        email: userInfo.email,
        // name: userInfo.name,
        // profileImage: userInfo.profileImage,
      });
      // 서버에서 받은 데이터 저장
      if (loginResponse.data) {
        // accessToken 저장
        if (loginResponse.data.accessToken) {
          await saveAuthToken(loginResponse.data.accessToken);
        }

        // refreshToken 저장
        if (loginResponse.data.refreshToken) {
          await saveRefreshToken(loginResponse.data.refreshToken);
        }

        // userInfo 저장
        if (loginResponse.data.userInfo) {
          await saveUserInfo(loginResponse.data.userInfo);
          await saveUserInfo({
            ...loginResponse.data.userInfo,
            provider: 'NAVER',
            loginTime: Date.now(),
          });
        }
      } else if (loginResponse.token) {
        await saveAuthToken(loginResponse.token);
        if (loginResponse.refreshToken) {
          await saveRefreshToken(loginResponse.refreshToken);
        }
        if (loginResponse.user) {
          await saveUserInfo({
            userId: parseInt(loginResponse.user.id, 10) || 0,
            name: loginResponse.user.name,
            email: loginResponse.user.email,
            profileImage: loginResponse.user.profileImage,
          });
        }
      } else {
        console.warn('서버에서 토큰을 받지 못했습니다.');
        console.warn('서버 응답:', JSON.stringify(loginResponse, null, 2));
        console.warn('서버 응답 필드:', Object.keys(loginResponse).join(', '));
      }
    } catch (apiError) {
      console.error('서버 로그인 API 호출 실패:', apiError);
      // 서버 API 실패 시 에러 반환
      return {
        success: false,
        provider: 'NAVER',
        error: '서버 로그인에 실패했습니다. 다시 시도해주세요.',
      };
    }

    return {
      success: true,
      provider: 'NAVER',
      accessToken: result.successResponse.accessToken,
      userInfo,
    };
  } catch (error: any) {
    return {
      success: false,
      provider: 'NAVER',
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
    case 'GOOGLE':
      return signInWithGoogle();
    case 'KAKAO':
      return signInWithKakao();
    case 'NAVER':
      return signInWithNaver();
    case 'APPLE':
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
    case 'GOOGLE':
      await signOutGoogle();
      break;
    case 'KAKAO':
      await signOutKakao();
      break;
    case 'NAVER':
      await signOutNaver();
      break;
  }
};
// 애플 로그인
export const signInWithApple = async (): Promise<SocialLoginResult> => {
  let appleAuthRequestResponse: any = null;
  let identityToken: string | null = null;

  try {
    appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    identityToken = appleAuthRequestResponse.identityToken;
    const { user } = appleAuthRequestResponse;

    if (!identityToken) {
      throw new Error('Apple ID Token이 없습니다.');
    }

    if (!user) {
      throw new Error('Apple User ID가 없습니다.');
    }

    const authInstance = getAuth();
    const appleCredential = AppleAuthProvider.credential(
      identityToken,
      appleAuthRequestResponse.nonce || undefined,
    );

    const userCredential = await signInWithCredential(
      authInstance,
      appleCredential,
    );
    const firebaseUser = userCredential.user;

    const userInfo = {
      id: firebaseUser.uid,
      email: firebaseUser.email || appleAuthRequestResponse.email || undefined,
      name:
        firebaseUser.displayName ||
        appleAuthRequestResponse.fullName?.givenName ||
        undefined,
      profileImage: undefined,
    };

    // 서버 API 호출
    try {
      const loginResponse = await loginWithProvider('APPLE', {
        accessToken: identityToken,
        email: userInfo.email,
        // name: userInfo.name,
        // profileImage: userInfo.profileImage,
      });
      // 서버에서 받은 데이터 저장
      if (loginResponse.data) {
        // accessToken 저장
        if (loginResponse.data.accessToken) {
          await saveAuthToken(loginResponse.data.accessToken);
        }

        // refreshToken 저장
        if (loginResponse.data.refreshToken) {
          await saveRefreshToken(loginResponse.data.refreshToken);
        }

        // userInfo 저장
        if (loginResponse.data.userInfo) {
          await saveUserInfo(loginResponse.data.userInfo);
          await saveUserInfo({
            ...loginResponse.data.userInfo,
            provider: 'APPLE',
            loginTime: Date.now(),
          });
        }
      } else if (loginResponse.token) {
        await saveAuthToken(loginResponse.token);
        if (loginResponse.refreshToken) {
          await saveRefreshToken(loginResponse.refreshToken);
        }
        if (loginResponse.user) {
          await saveUserInfo({
            userId: parseInt(loginResponse.user.id, 10) || 0,
            name: loginResponse.user.name,
            email: loginResponse.user.email,
            profileImage: loginResponse.user.profileImage,
          });
        }
      } else {
        console.warn('서버에서 토큰을 받지 못했습니다.');
        console.warn('서버 응답:', JSON.stringify(loginResponse, null, 2));
        console.warn('서버 응답 필드:', Object.keys(loginResponse).join(', '));
      }
    } catch (apiError) {
      console.error('서버 로그인 API 호출 실패:', apiError);
      // 서버 API 실패 시 에러 반환
      return {
        success: false,
        provider: 'APPLE',
        error: '서버 로그인에 실패했습니다. 다시 시도해주세요.',
      };
    }

    return {
      success: true,
      provider: 'APPLE',
      accessToken: identityToken,
      userInfo,
    };
  } catch (err: any) {
    console.error('애플 로그인 에러:', err);
    return {
      success: false,
      provider: 'APPLE',
      error: err.message || '애플 로그인 실패',
    };
  }
};
