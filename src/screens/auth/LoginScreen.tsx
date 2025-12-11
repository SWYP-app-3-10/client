import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteNames} from '../../../routes';
import {scaleWidth} from '../../styles/global';
import {
  signInWithSocial,
  initializeGoogleSignIn,
  initializeKakaoLogin,
  initializeNaverLogin,
  SocialLoginProvider,
} from '../../services/socialLoginService';
import {OnboardingStackParamList} from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState<SocialLoginProvider | null>(null);

  useEffect(() => {
    // 소셜 로그인 초기화 (네이티브 모듈이 준비된 후)
    // 네이티브 모듈이 없을 경우를 대비해 안전하게 초기화
    const initSocialLogin = async () => {
      try {
        initializeGoogleSignIn();
        initializeKakaoLogin();
        initializeNaverLogin();
      } catch (error) {
        console.warn('소셜 로그인 초기화 중 오류:', error);
        // 네이티브 모듈이 링크되지 않았을 수 있음
        // 앱은 계속 실행되지만 로그인 기능은 사용할 수 없음
      }
    };

    // 약간의 지연을 두어 네이티브 모듈이 준비될 시간을 줌
    const timer = setTimeout(() => {
      initSocialLogin();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleSocialLogin = async (provider: SocialLoginProvider) => {
    try {
      setLoading(provider);
      const result = await signInWithSocial(provider);

      if (result.success && result.userInfo) {
        // TODO: 서버에 사용자 정보 전송 및 인증 처리
        // 예: await api.login(result);

        // 로그인 성공 시 온보딩으로 이동
        navigation.navigate(RouteNames.FEATURE_INTRO_01);
      } else {
        Alert.alert('로그인 실패', result.error || '로그인에 실패했습니다.');
      }
    } catch (error: any) {
      Alert.alert('오류', error.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(null);
    }
  };

  const handleGoogleLogin = () => handleSocialLogin('google');
  const handleKakaoLogin = () => handleSocialLogin('kakao');
  const handleNaverLogin = () => handleSocialLogin('naver');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 앱 이름 */}
        <Text style={styles.appName}>뇌세포</Text>
        <Text style={styles.tagline}>사고가 자라는 시간</Text>

        {/* 소셜 로그인 버튼들 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={{
              width: '100%',
              height: scaleWidth(56),
              borderRadius: scaleWidth(12),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'orange',
            }}
            onPress={() => navigation.navigate(RouteNames.FEATURE_INTRO_01)}>
            <Text>일단 다음</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '100%',
              height: scaleWidth(56),
              borderRadius: scaleWidth(12),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'Grey',
            }}
            onPress={() => navigation.navigate(RouteNames.REWARD)}>
            <Text>광고 예시</Text>
          </TouchableOpacity>
          {/* 구글 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            onPress={handleGoogleLogin}
            disabled={loading !== null}>
            {loading === 'google' ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.socialButtonText}>구글로 시작하기</Text>
            )}
          </TouchableOpacity>

          {/* 카카오 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.socialButton, styles.kakaoButton]}
            onPress={handleKakaoLogin}
            disabled={loading !== null}>
            {loading === 'kakao' ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={[styles.socialButtonText, styles.kakaoButtonText]}>
                카카오로 시작하기
              </Text>
            )}
          </TouchableOpacity>

          {/* 네이버 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.socialButton, styles.naverButton]}
            onPress={handleNaverLogin}
            disabled={loading !== null}>
            {loading === 'naver' ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.socialButtonText}>Naver로 시작하기</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(80),
    paddingBottom: scaleWidth(40),
  },
  appName: {
    fontSize: scaleWidth(32),
    fontWeight: '700',
    color: '#000000',
    marginBottom: scaleWidth(8),
    textAlign: 'center',
  },
  tagline: {
    fontSize: scaleWidth(16),
    color: '#666666',
    marginBottom: scaleWidth(60),
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
    gap: scaleWidth(12),
  },
  socialButton: {
    width: '100%',
    height: scaleWidth(56),
    borderRadius: scaleWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  naverButton: {
    backgroundColor: '#03C75A',
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: scaleWidth(16),
    fontWeight: '600',
  },
  kakaoButtonText: {
    color: '#000000',
  },
});

export default LoginScreen;
