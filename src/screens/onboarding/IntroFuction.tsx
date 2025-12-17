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
import {OnboardingStackParamList} from '../../navigation/types';
import FeatureCarousel, {CAROUSEL_DATA} from '../../components/FeatureCarousel';
import LottieView from 'lottie-react-native';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

const IntroFuction = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 50,
          left: 20,
          padding: 10,
          backgroundColor: '#ddd',
          borderRadius: 8,
          zIndex: 1,
        }}
        onPress={() => {
          navigation.goBack();
        }}>
        <Text>뒤로가기</Text>
      </TouchableOpacity>
      <View style={{flex: 1, padding: 30, justifyContent: 'center'}}>
        <View style={{position: 'relative'}}>
          <LottieView
            source={require('../../assets/lottie/PolarBear.json')} // 다운받은 json 파일 경로
            style={{width: '100%', height: 500}}
            autoPlay // 자동 재생
            loop // 무한 반복
          />
          <View
            style={{
              borderWidth: 1,
              borderColor: 'red',
              width: '100%',
              height: 45,
              zIndex: 1,
              position: 'absolute',
              backgroundColor: 'white',
              bottom: 100,
              justifyContent: 'center',
            }}>
            <Text>애니메이션 위에 컴포넌트!</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={{
          width: '100%',
          height: scaleWidth(56),
          borderRadius: scaleWidth(12),
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'orange',
        }}
        onPress={() => navigation.navigate(RouteNames.INTRO_SEARCH)}>
        <Text>일단 다음</Text>
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

export default IntroFuction;
