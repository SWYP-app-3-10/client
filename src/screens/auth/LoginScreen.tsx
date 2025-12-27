import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RouteNames } from '../../../routes';
import { COLORS, scaleWidth } from '../../styles/global';
import {
  signInWithSocial,
  initializeGoogleSignIn,
  initializeNaverLogin,
  SocialLoginProvider,
} from '../../services/socialLoginService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import Spacer from '../../components/Spacer';
import { SocialLoginButton, Button } from '../../components';
import {
  getRecentLogin,
  saveRecentLogin,
  RecentLoginInfo,
} from '../../services/authStorageService';
import { useShowModal } from '../../store/modalStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useNotificationPermission } from '../../hooks/useNotificationPermission';
import { clearAllAuthData } from '../../services/authService';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState<SocialLoginProvider | null>(null);
  const [recentLogin, setRecentLogin] = useState<RecentLoginInfo | null>(null);
  const showModal = useShowModal();
  const setOnboardingStep = useOnboardingStore(
    state => state.setOnboardingStep,
  );
  const resetOnboarding = useOnboardingStore(state => state.resetOnboarding);
  const { checkPermission, requestPermission } = useNotificationPermission();

  useEffect(() => {
    const initSocialLogin = async () => {
      try {
        initializeGoogleSignIn();
        initializeNaverLogin();
      } catch (error) {
        console.warn('소셜 로그인 초기화 중 오류:', error);
      }
    };

    const loadRecentLogin = async () => {
      const recent = await getRecentLogin();
      setRecentLogin(recent);
    };

    const timer = setTimeout(() => {
      initSocialLogin();
      loadRecentLogin();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleNotificationModal = async () => {
    const shouldShowModal = await checkPermission();

    if (shouldShowModal) {
      showModal({
        image: <></>,
        title: '알림을 받으시겠어요?',
        description:
          '알림을 켜두면, 하루 두 번 문해력 루틴을 \n잊지 않고 챙길 수 있어요!',
        primaryButton: {
          title: '알림 받을래요',
          onPress: async () => {
            const granted = await requestPermission();
            if (granted) {
              console.log('알림 권한이 허용되었습니다.');
            }
            await setOnboardingStep('interests');
            navigation.navigate(RouteNames.INTERESTS, {});
          },
        },
        secondaryButton: {
          title: '괜찮아요',
          variant: 'outline',
          textStyle: { color: COLORS.gray700 },
          style: {
            borderColor: COLORS.gray300,
            height: scaleWidth(48),
          },
          onPress: async () => {
            await setOnboardingStep('interests');
            navigation.navigate(RouteNames.INTERESTS, {});
          },
        },
      });
    } else {
      await setOnboardingStep('interests');
      navigation.navigate(RouteNames.INTERESTS, {});
    }
  };

  const handleSocialLogin = async (provider: SocialLoginProvider) => {
    try {
      setLoading(provider);
      const result = await signInWithSocial(provider);

      if (result.success && result.userInfo) {
        await saveRecentLogin({
          provider: result.provider,
          userId: result.userInfo.id,
          name: result.userInfo.name,
          profileImage: result.userInfo.profileImage,
          loginTime: Date.now(),
        });

        await handleNotificationModal();
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
  const handleAppleLogin = () => handleSocialLogin('apple');

  // 개발용: 로그인 초기화
  const handleClearLogin = async () => {
    Alert.alert(
      '로그인 초기화',
      '모든 로그인 및 온보딩 정보를 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            await clearAllAuthData();
            await resetOnboarding();
            Alert.alert(
              '완료',
              '로그인 정보가 초기화되었습니다.\n앱을 재시작하세요.',
            );
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Spacer num={252} />
        <View style={styles.logoContainer}>
          <Text>로고</Text>
        </View>
        <View style={styles.buttonContainer}>
          {/* 개발용: 로그인 초기화 버튼 */}
          {__DEV__ && (
            <Button
              title="로그인 초기화"
              onPress={handleClearLogin}
              variant="ghost"
              style={styles.clearLoginButton}
            />
          )}
          {Platform.OS === 'ios' && (
            <SocialLoginButton
              provider="apple"
              onPress={handleAppleLogin}
              loading={loading}
              recentLogin={recentLogin}
            />
          )}
          {/* <SocialLoginButton
            provider="apple"
            onPress={() => navigation.navigate(RouteNames.INTERESTS)}
            loading={loading}
            recentLogin={recentLogin}
          /> */}
          <SocialLoginButton
            provider="google"
            onPress={handleGoogleLogin}
            loading={loading}
            recentLogin={recentLogin}
          />
          <SocialLoginButton
            provider="kakao"
            onPress={handleKakaoLogin}
            loading={loading}
            recentLogin={recentLogin}
          />
          <SocialLoginButton
            provider="naver"
            onPress={handleNaverLogin}
            loading={loading}
            recentLogin={recentLogin}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(20),
  },
  logoContainer: {
    width: scaleWidth(300),
    height: scaleWidth(140),
    borderWidth: 1,
    backgroundColor: COLORS.gray300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: scaleWidth(12),
    flex: 1,
    justifyContent: 'flex-end',
  },
  clearLoginButton: {
    marginBottom: scaleWidth(12),
  },
});

export default LoginScreen;
