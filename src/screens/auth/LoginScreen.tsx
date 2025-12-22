import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteNames } from '../../../routes';
import { BORDER_RADIUS, COLORS, scaleWidth } from '../../styles/global';
import {
  signInWithSocial,
  initializeGoogleSignIn,
  initializeKakaoLogin,
  initializeNaverLogin,
  SocialLoginProvider,
} from '../../services/socialLoginService';
import { OnboardingStackParamList } from '../../navigation/types';
import { Button } from '../../components';
import Spacer from '../../components/Spacer';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import {
  getRecentLogin,
  saveRecentLogin,
  RecentLoginInfo,
} from '../../services/authStorageService';
import { Tooltip_RecentIcon } from '../../icons';
import { useShowModal } from '../../store/modalStore';
import { useOnboardingStore } from '../../store/onboardingStore';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState<SocialLoginProvider | null>(null);
  const [recentLogin, setRecentLogin] = useState<RecentLoginInfo | null>(null);
  const showModal = useShowModal();
  const setOnboardingStep = useOnboardingStore(
    state => state.setOnboardingStep,
  );
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

    // 최근 로그인 정보 불러오기
    const loadRecentLogin = async () => {
      const recent = await getRecentLogin();
      setRecentLogin(recent);
    };

    // 약간의 지연을 두어 네이티브 모듈이 준비될 시간을 줌
    const timer = setTimeout(() => {
      initSocialLogin();
      loadRecentLogin();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleSocialLogin = async (provider: SocialLoginProvider) => {
    try {
      setLoading(provider);
      const result = await signInWithSocial(provider);

      if (result.success && result.userInfo) {
        // 최근 로그인 정보 저장
        await saveRecentLogin({
          provider: result.provider,
          userId: result.userInfo.id,
          name: result.userInfo.name,
          profileImage: result.userInfo.profileImage,
          loginTime: Date.now(),
        });

        // TODO: 서버에 사용자 정보 전송 및 인증 처리
        // 예: await api.login(result);
        const shouldShowNotificationModal = true; // TODO: 실제 알림 권한 상태 확인
        if (shouldShowNotificationModal) {
          // 기기 알람 꺼져있을 경우
          showModal({
            image: <></>,
            title: '알림을 받으시겠어요?',
            description: `알림을 켜두면, 하루 두 번 문해력 루틴을 \n잊지 않고 챙길 수 있어요!`,
            primaryButton: {
              title: '알림 받을래요',
              onPress: async () => {
                // TODO: 알림 권한 요청
                await setOnboardingStep('interests');
                navigation.navigate(RouteNames.INTERESTS);
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
                navigation.navigate(RouteNames.INTERESTS);
              },
            },
          });
        } else {
          // 모달을 표시하지 않을 때는 바로 관심사 선택 화면으로 이동
          await setOnboardingStep('interests');
          navigation.navigate(RouteNames.INTERESTS);
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

  const handleGoogleLogin = () => handleSocialLogin('google');
  const handleKakaoLogin = () => handleSocialLogin('kakao');
  const handleNaverLogin = () => handleSocialLogin('naver');
  const handleAppleLogin = () => handleSocialLogin('apple');
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Spacer num={252} />
        <View
          style={{
            width: scaleWidth(300),
            height: scaleWidth(140),
            borderWidth: 1,
            backgroundColor: COLORS.gray300,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>로고</Text>
        </View>
        {/* 소셜 로그인 버튼들 */}
        <View style={styles.buttonContainer}>
          <Button
            style={{
              width: '100%',
              height: scaleWidth(56),
              borderRadius: scaleWidth(12),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'orange',
            }}
            onPress={() => {
              if (true) {
                showModal({
                  image: <></>,
                  title: '알림을 받으시겠어요?',
                  description: `알림을 켜두면, 하루 두 번 문해력 루틴을 \n잊지 않고 챙길 수 있어요!`,
                  primaryButton: { title: '알림 받을래요', onPress: () => {} },
                  secondaryButton: {
                    title: '괜찮아요',
                    variant: 'outline',
                    textStyle: { color: COLORS.gray700 },
                    style: {
                      borderColor: COLORS.gray300,
                      height: scaleWidth(48),
                    },
                    onPress: () => {
                      navigation.navigate(RouteNames.INTERESTS);
                    },
                  },
                });
              } else {
                navigation.navigate(RouteNames.INTERESTS);
              }
            }}
          >
            <Text>일단 다음</Text>
          </Button>
          {/* <TouchableOpacity
            style={{
              width: '100%',
              height: scaleWidth(56),
              borderRadius: scaleWidth(12),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'grey',
            }}
            onPress={() => navigation.navigate(RouteNames.REWARD)}>
            <Text>광고 예시</Text>
          </TouchableOpacity> */}
          {/* 애플계정 로그인 버튼 */}
          <View style={styles.buttonWrapper}>
            {recentLogin && recentLogin.provider === 'apple' && (
              <View style={styles.tooltipContainer}>
                <View style={styles.tooltipBackground} />
                <Tooltip_RecentIcon />
              </View>
            )}
            <AppleButton
              buttonType={AppleButton.Type.SIGN_IN}
              buttonStyle={AppleButton.Style.BLACK}
              cornerRadius={BORDER_RADIUS[16]}
              style={{ width: '100%', height: scaleWidth(56) }}
              onPress={handleAppleLogin}
            />
          </View>
          {Platform.OS === 'ios' && (
            <Button
              variant="outline"
              style={{ borderColor: COLORS.black }}
              onPress={handleGoogleLogin}
              disabled={loading !== null}
            >
              {loading === 'apple' ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.socialButtonText}>
                  애플 계정으로 로그인
                </Text>
              )}
            </Button>
          )}
          {/* 구글 로그인 버튼 */}
          <View style={styles.buttonWrapper}>
            {recentLogin && recentLogin.provider === 'google' && (
              <View style={styles.tooltipContainer}>
                <View style={styles.tooltipBackground} />
                <Tooltip_RecentIcon />
              </View>
            )}
            <Button
              variant="outline"
              style={{ borderColor: COLORS.black }}
              onPress={handleGoogleLogin}
              disabled={loading !== null}
            >
              {loading === 'google' ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.socialButtonText}>
                  Google 계정으로 로그인
                </Text>
              )}
            </Button>
          </View>

          {/* 카카오 로그인 버튼 */}
          <View style={styles.buttonWrapper}>
            {recentLogin && recentLogin.provider === 'kakao' && (
              <View style={styles.tooltipContainer}>
                <View style={styles.tooltipBackground} />
                <Tooltip_RecentIcon />
              </View>
            )}
            <Button
              variant="primary"
              style={{ backgroundColor: '#FFD43B' }}
              onPress={handleKakaoLogin}
              disabled={loading !== null}
            >
              {loading === 'kakao' ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={[styles.socialButtonText, styles.kakaoButtonText]}>
                  카카오로 시작하기
                </Text>
              )}
            </Button>
          </View>

          {/* 네이버 로그인 버튼 */}
          <View style={styles.buttonWrapper}>
            {recentLogin && recentLogin.provider === 'naver' && (
              <View style={styles.tooltipContainer}>
                <View style={styles.tooltipBackground} />
                <Tooltip_RecentIcon />
              </View>
            )}
            <Button
              variant="primary"
              style={{ backgroundColor: '#2DB400' }}
              onPress={handleNaverLogin}
              disabled={loading !== null}
            >
              {loading === 'naver' ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  style={[styles.socialButtonText, { color: COLORS.white }]}
                >
                  Naver로 시작하기
                </Text>
              )}
            </Button>
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(20),
  },

  buttonContainer: {
    width: '100%',
    gap: scaleWidth(12),
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonWrapper: {
    width: '100%',
    position: 'relative',
  },
  tooltipContainer: {
    position: 'absolute',
    top: scaleWidth(-55),
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
    elevation: 10, // Android
  },
  tooltipBackground: {
    position: 'absolute',
    width: scaleWidth(163),
    height: scaleWidth(42),
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS[16],
    zIndex: -1,
  },
  socialButton: {
    width: '100%',
    height: scaleWidth(56),
    borderRadius: scaleWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButton: {},
  kakaoButton: {
    backgroundColor: '#FFD43B',
  },
  naverButton: {
    backgroundColor: '#2DB400',
  },
  socialButtonText: {
    color: COLORS.black,
    fontSize: scaleWidth(16),
    fontWeight: '600',
  },
  kakaoButtonText: {
    color: '#000000',
  },
});

export default LoginScreen;
