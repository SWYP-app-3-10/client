import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteNames } from '../../../routes';
import {
  BORDER_RADIUS,
  COLORS,
  Heading_18EB_Round,
  Heading_24EB_Round,
  scaleWidth,
} from '../../styles/global';
import { OnboardingStackParamList } from '../../navigation/types';
import Header from '../../components/Header';
import Spacer from '../../components/Spacer';
import FastImage from 'react-native-fast-image';
import ActivityIndicator from '../../components/ActivityIndicator';
import { Body_15M } from '../../styles/typography';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

const IntroSearch = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header />
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: scaleWidth(20) }}>
          <Text style={[Heading_24EB_Round, { color: COLORS.black }]}>
            더 다양한 분야의
            {'\n'}글을 읽어볼 수 있어요
          </Text>
          <Spacer num={20} />
          <Text style={[Body_15M, { color: COLORS.gray600 }]}>
            미션 화면에서 나의 관심분야 글을 확인할 수 있어요
          </Text>
          <Spacer num={86} />
        </View>

        <View
          style={{
            paddingHorizontal: scaleWidth(41),
          }}
        >
          <FastImage
            source={{ uri: '' }}
            aria-label="카드리스트"
            resizeMode="contain"
            style={{
              borderWidth: 1,
              height: scaleWidth(276),
              borderColor: COLORS.gray400,
              borderRadius: BORDER_RADIUS[20],
            }}
          />
          <Spacer num={124} />
          <ActivityIndicator activeIndex={2} />
        </View>
      </View>
      <TouchableOpacity
        style={{
          height: scaleWidth(56),
          borderRadius: BORDER_RADIUS[16],
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.puple.main,
          marginHorizontal: scaleWidth(20),
        }}
        onPress={() => navigation.navigate(RouteNames.SOCIAL_LOGIN)}
      >
        <Text style={[Heading_18EB_Round, { color: COLORS.white }]}>다음</Text>
      </TouchableOpacity>
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
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(40),
    paddingBottom: scaleWidth(40),
  },
  imagePlaceholder: {
    width: '100%',
    height: scaleWidth(300),
    backgroundColor: COLORS.grayLight,
    borderRadius: scaleWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleWidth(20),
  },
  textPlaceholder: {
    width: '100%',
    height: scaleWidth(80),
    backgroundColor: COLORS.grayLight,
    borderRadius: scaleWidth(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleWidth(40),
  },
  placeholderText: {
    color: COLORS.gray600,
    fontSize: scaleWidth(14),
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleWidth(40),
    gap: scaleWidth(8),
  },
  dot: {
    width: scaleWidth(8),
    height: scaleWidth(8),
    borderRadius: scaleWidth(4),
    backgroundColor: COLORS.grayMedium,
  },
  activeDot: {
    backgroundColor: COLORS.onboardingPurple,
    width: scaleWidth(24),
  },
  button: {
    width: '100%',
    height: scaleWidth(56),
    backgroundColor: COLORS.onboardingGreen,
    borderRadius: scaleWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButton: {
    width: '100%',
    height: scaleWidth(56),
    backgroundColor: COLORS.grayLight,
    borderRadius: scaleWidth(12),
  },
  buttonText: {
    color: COLORS.white,
    fontSize: scaleWidth(16),
    fontWeight: '600',
  },
});

export default IntroSearch;
