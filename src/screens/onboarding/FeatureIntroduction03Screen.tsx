import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteNames} from '../../../routes';
import NotificationModal from '../../components/NotificationModal';
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

const FeatureIntroduction03Screen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const handleNext = () => {
    setShowNotificationModal(true);
  };

  const handleNotificationAccept = () => {
    setShowNotificationModal(false);
    navigation.navigate(RouteNames.INTERESTS);
  };

  const handleNotificationDecline = () => {
    setShowNotificationModal(false);
    navigation.navigate(RouteNames.INTERESTS);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 이미지 placeholder */}
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>탐색 기능 이미지</Text>
        </View>

        {/* 텍스트 placeholder */}
        <View style={styles.textPlaceholder}>
          <Text style={styles.placeholderText}>탐색 기능 설명</Text>
        </View>

        {/* 페이지네이션 인디케이터 */}
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>

        {/* Naver로 시작하기 버튼 */}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Naver로 시작하기</Text>
        </TouchableOpacity>
      </View>

      <NotificationModal
        visible={showNotificationModal}
        onAccept={handleNotificationAccept}
        onDecline={handleNotificationDecline}
      />
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: scaleWidth(16),
    fontWeight: '600',
  },
});

export default FeatureIntroduction03Screen;
