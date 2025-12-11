import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteNames} from '../../../routes';
import {scaleWidth} from '../../styles/global';

type OnboardingStackParamList = {
  [RouteNames.SOCIAL_LOGIN]: undefined;
  [RouteNames.FEATURE_INTRO_01]: undefined;
  [RouteNames.FEATURE_INTRO_02]: undefined;
  [RouteNames.FEATURE_INTRO_03]: undefined;
  [RouteNames.INTERESTS]: undefined;
  [RouteNames.DIFFICULTY_SETTING]: undefined;
};

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleNaverLogin = () => {
    // TODO: 실제 Naver 로그인 로직 구현
    navigation.navigate(RouteNames.FEATURE_INTRO_01);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 앱 이름 */}
        <Text style={styles.appName}>뇌세포</Text>
        <Text style={styles.tagline}>사고가 자라는 시간</Text>

        {/* 입력 필드 placeholder */}
        <View style={styles.inputContainer}>
          <View style={styles.inputPlaceholder} />
          <View style={styles.inputPlaceholder} />
          <View style={styles.inputPlaceholder} />
        </View>

        {/* Naver로 시작하기 버튼 */}
        <TouchableOpacity style={styles.button} onPress={handleNaverLogin}>
          <Text style={styles.buttonText}>Naver로 시작하기</Text>
        </TouchableOpacity>
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
  inputContainer: {
    marginBottom: scaleWidth(40),
    gap: scaleWidth(12),
  },
  inputPlaceholder: {
    width: '100%',
    height: scaleWidth(56),
    backgroundColor: '#F5F5F5',
    borderRadius: scaleWidth(12),
  },
  button: {
    width: '100%',
    height: scaleWidth(56),
    backgroundColor: '#2ECC71',
    borderRadius: scaleWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: scaleWidth(16),
    fontWeight: '600',
  },
});

export default LoginScreen;
