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
import {
  BORDER_RADIUS,
  COLORS,
  Heading_18EB_Round,
  Heading_24EB_Round,
  scaleWidth,
} from '../../styles/global';
import {OnboardingStackParamList} from '../../navigation/types';
import FeatureCarousel, {CAROUSEL_DATA} from '../../components/FeatureCarousel';
import LottieView from 'lottie-react-native';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

const IntroCardList = () => {
  const navigation = useNavigation<NavigationProp>();
  const CAROUSEL_DATA = [
    {
      id: '1',
      color: '#E0E0E0',
      imgUrl: <></>,
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: '#ddd',
          borderRadius: 8,
          width: scaleWidth(50),
          height: scaleWidth(30),
        }}
        onPress={() => {
          navigation.goBack();
        }}>
        <Text>뒤로가기</Text>
      </TouchableOpacity>
      <Text style={[Heading_24EB_Round, {color: COLORS.black}]}>
        관심 있는 분야의 글을 맞춤으로 추천받아요
      </Text>

      <View style={styles.content}>
        <FeatureCarousel data={CAROUSEL_DATA} />
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
        onPress={() => navigation.navigate(RouteNames.INTRO_FUNCTION)}>
        <Text style={[Heading_18EB_Round, {color: COLORS.white}]}>다음</Text>
      </TouchableOpacity>
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
    paddingTop: scaleWidth(40),
    paddingBottom: scaleWidth(40),
  },
  imagePlaceholder: {
    width: '100%',
    height: scaleWidth(300),
    backgroundColor: '#F5F5F5',
    borderRadius: scaleWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleWidth(20),
  },
  textPlaceholder: {
    width: '100%',
    height: scaleWidth(80),
    backgroundColor: '#F5F5F5',
    borderRadius: scaleWidth(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleWidth(40),
  },
  placeholderText: {
    color: '#999999',
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
    backgroundColor: '#E0E0E0',
  },
  activeDot: {
    backgroundColor: '#9B59B6',
    width: scaleWidth(24),
  },
  button: {
    width: '100%',
    height: scaleWidth(56),
    backgroundColor: '#2ECC71',
    borderRadius: scaleWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButton: {
    width: '100%',
    height: scaleWidth(56),
    backgroundColor: '#F5F5F5',
    borderRadius: scaleWidth(12),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: scaleWidth(16),
    fontWeight: '600',
  },
});

export default IntroCardList;
