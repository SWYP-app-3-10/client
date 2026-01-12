import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  RouteProp,
  CommonActions,
} from '@react-navigation/native';
import { RouteNames } from '../../../routes';
import { COLORS, scaleWidth } from '../../styles/global';
import { Body_16SB, Heading_16B } from '../../styles/typography';
import {
  signInWithSocial,
  initializeGoogleSignIn,
  initializeNaverLogin,
  SocialLoginProvider,
} from '../../services/socialLoginService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import Spacer from '../../components/Spacer';
import { SocialLoginButton } from '../../components';
import {
  getRecentLogin,
  RecentLoginInfo,
} from '../../services/authStorageService';
import { useShowModal } from '../../store/modalStore';
import {
  useOnboardingStore,
  useCompleteOnboarding,
} from '../../store/onboardingStore';
import { useNotificationPermission } from '../../hooks/useNotificationPermission';
import { LoginBackground } from '../../icons/commonIcons/simpleImages';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;
type LoginRouteProp = RouteProp<
  OnboardingStackParamList,
  typeof RouteNames.SOCIAL_LOGIN
>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LoginRouteProp>();

  const [loading, setLoading] = useState<SocialLoginProvider | null>(null);
  const [recentLogin, setRecentLogin] = useState<RecentLoginInfo | null>(null);
  const showModal = useShowModal();
  const setOnboardingStep = useOnboardingStore(
    state => state.setOnboardingStep,
  );
  const completeOnboarding = useCompleteOnboarding();
  const waitingForSettingsRef = useRef(false);
  const { checkPermission, requestPermission } = useNotificationPermission({
    onSettingsOpened: () => {
      waitingForSettingsRef.current = true;
    },
  });

  // 설정에서 돌아왔을 때 관심분야 화면으로 이동 (권한 설정 여부와 관계없이)
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (nextAppState === 'active' && waitingForSettingsRef.current) {
          // 설정에서 돌아왔을 때 무조건 관심분야 화면으로 이동
          waitingForSettingsRef.current = false;
          await setOnboardingStep('interests');
          navigation.navigate(RouteNames.INTERESTS, {});
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [setOnboardingStep, navigation]);

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

  // 약관 화면에서 agreedProvider를 넘겨서 돌아오면,
  // 기존 handleSocialLogin 로직을 그대로 실행
  useEffect(() => {
    const agreedProvider = route.params?.agreedProvider;
    if (!agreedProvider) {
      return;
    }

    handleSocialLogin(agreedProvider);

    // 재진입/리렌더 시 중복 실행 방지용으로 params를 비움
    navigation.setParams({ agreedProvider: undefined });
  }, [route.params?.agreedProvider]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNotificationModal = async () => {
    const shouldShowModal = await checkPermission();

    if (shouldShowModal) {
      showModal({
        image: <></>,
        title: '알림을 받으시겠어요?',
        description:
          '알림을 켜두면, 하루 두 번 문해력 루틴을 \n잊지 않고 챙길 수 있어요!',
        descriptionColor: COLORS.gray600,
        primaryButton: {
          title: '알림 받을래요',
          textStyle: { ...Heading_16B, color: COLORS.white },
          onPress: async () => {
            const granted = await requestPermission();
            if (granted) {
              console.log('알림 권한이 허용되었습니다.');
              await setOnboardingStep('interests');
              navigation.navigate(RouteNames.INTERESTS, {});
            } else {
              // 권한이 거부되었거나 설정으로 이동한 경우
              waitingForSettingsRef.current = true;
            }
          },
        },
        secondaryButton: {
          title: '괜찮아요',
          variant: 'outline',
          textStyle: { color: COLORS.gray700, ...Heading_16B },
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
        // newUser가 false이면 온보딩 건너뛰고 바로 메인 화면으로 이동
        if (result.newUser === false) {
          // 온보딩 완료 처리
          await completeOnboarding();
          // 메인 화면으로 이동
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: RouteNames.MAIN_TAB }],
            }),
          );
        } else {
          // 신규 사용자이면 온보딩 진행
          await handleNotificationModal();
        }
      } else {
        Alert.alert('로그인 실패', result.error || '로그인에 실패했습니다.');
      }
    } catch (error: any) {
      Alert.alert('오류', error.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(null);
    }
  };

  // 로그인 버튼을 누르면 바로 로그인하지 않고 약관 화면으로 먼저 이동
  // 약관에서 동의 완료 시 agreedProvider로 다시 돌아오고, 위 useEffect에서 handleSocialLogin이 실행
  const goTermsAgreement = (provider: SocialLoginProvider) => {
    navigation.navigate(RouteNames.TERMS_AGREEMENT, { provider });
  };

  const handleGoogleLogin = () => goTermsAgreement('GOOGLE');
  const handleKakaoLogin = () => goTermsAgreement('KAKAO');
  const handleNaverLogin = () => goTermsAgreement('NAVER');
  const handleAppleLogin = () => goTermsAgreement('APPLE');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundContainer}>
        <LoginBackground style={styles.backgroundImage} />
      </View>
      <View style={styles.content}>
        <Text style={styles.logoText}>
          일상의 틈, 언제든 시작하는 문해력 미션
        </Text>
        <View style={styles.buttonContainer}>
          <SocialLoginButton
            provider="KAKAO"
            onPress={handleKakaoLogin}
            loading={loading}
            recentLogin={recentLogin}
          />

          <SocialLoginButton
            provider="GOOGLE"
            onPress={handleGoogleLogin}
            loading={loading}
            recentLogin={recentLogin}
          />

          <SocialLoginButton
            provider="NAVER"
            onPress={handleNaverLogin}
            loading={loading}
            recentLogin={recentLogin}
          />

          {Platform.OS === 'ios' && (
            <SocialLoginButton
              provider="APPLE"
              onPress={handleAppleLogin}
              loading={loading}
              recentLogin={recentLogin}
            />
          )}
        </View>
      </View>
      <Spacer num={52} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.puple.main,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  backgroundImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: scaleWidth(20),
    zIndex: 1,
  },
  logoContainer: {
    width: scaleWidth(140),
    height: scaleWidth(140),
    borderWidth: 1,
    backgroundColor: COLORS.gray300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    ...Body_16SB,
    color: COLORS.puple.main,
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
