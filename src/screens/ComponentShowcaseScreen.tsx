import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import {COLORS, scaleWidth} from '../styles/global';
import {Button, Input} from '../components';
import NotificationModal from '../components/NotificationModal';
import {YoutubeIcon} from '../icons';
import LottieView from 'lottie-react-native';

const ComponentShowcaseScreen = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showPointModal, setShowPointModal] = useState(false);
  const [showXPModal, setShowXPModal] = useState(false);
  const [showSingleButtonModal, setShowSingleButtonModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>공통 컴포넌트</Text>
          <Text style={styles.subtitle}>Button & Input 컴포넌트 예제</Text>
        </View>

        {/* Button Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Button 컴포넌트</Text>
          <LottieView
            source={require('../assets/lottie/Cutebeardancing.json')} // 다운받은 json 파일 경로
            style={{width: scaleWidth(100), height: scaleWidth(100)}}
            autoPlay // 자동 재생
            loop // 무한 반복
          />
          <LottieView
            source={require('../assets/lottie/PolarBear.json')} // 다운받은 json 파일 경로
            style={{width: scaleWidth(100), height: scaleWidth(100)}}
            autoPlay // 자동 재생
            loop // 무한 반복
          />
          {/* Variants */}
          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>Variants</Text>
            <Button
              title="Primary Button"
              onPress={() => {}}
              variant="primary"
              style={styles.component}
            />
            <Button
              title="Outline Button"
              onPress={() => {}}
              variant="outline"
              style={styles.component}
            />
            <Button
              title="Ghost Button"
              onPress={() => {}}
              variant="ghost"
              style={styles.component}
            />
          </View>

          {/* States */}
          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>States</Text>
            <Button
              title="Disabled Button"
              onPress={() => {}}
              disabled
              style={styles.component}
            />
          </View>
        </View>

        {/* Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Input 컴포넌트</Text>

          {/* Variants */}
          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>Variants</Text>
            <Input
              label="Default Input"
              placeholder="기본 인풋"
              value={inputValue}
              onChangeText={setInputValue}
              variant="default"
            />
            <Input
              label="Outline Input"
              placeholder="아웃라인 인풋"
              value={inputValue2}
              onChangeText={setInputValue2}
              variant="outline"
            />
          </View>
        </View>

        {/* Modal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modal 컴포넌트</Text>

          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>예제</Text>
            <Button
              title="버튼 두개 모달 열기"
              onPress={() => setShowNotificationModal(true)}
              style={styles.component}
            />
            <Button
              title="포인트 모달 열기"
              onPress={() => setShowPointModal(true)}
              style={styles.component}
            />
            <Button
              title="경험치 모달 열기"
              onPress={() => setShowXPModal(true)}
              style={styles.component}
            />
            <Button
              title="이미지 있는 모달 열기"
              onPress={() => setShowImageModal(true)}
              style={styles.component}
            />
            <Button
              title="단일 버튼 모달 열기"
              onPress={() => setShowSingleButtonModal(true)}
              style={styles.component}
            />
          </View>
        </View>
      </ScrollView>
      {/* 알림 모달 */}
      <NotificationModal
        visible={showNotificationModal}
        title="알림을 받으시겠어요?"
        description="알림을 켜두면 하루 두 번 운루틴을 잊지 않고 평길 수 있어요!"
        primaryButton={{
          title: '알림 받을래요',
          onPress: () => setShowNotificationModal(false),
        }}
        secondaryButton={{
          title: '괜찮아요',
          onPress: () => setShowNotificationModal(false),
        }}
        onClose={() => setShowNotificationModal(false)}
      />
      {/* 포인트 모달 */}
      <NotificationModal
        visible={showPointModal}
        title="새로운 글을 읽으시겠어요?"
        primaryButton={{
          title: '포인트로 읽기',
          onPress: () => setShowPointModal(false),
        }}
        onClose={() => setShowPointModal(false)}>
        <View style={pointContainerStyles.container}>
          <Text style={pointContainerStyles.text}> 포인트 100p </Text>
        </View>
      </NotificationModal>
      {/* 경험치 모달 */}
      <NotificationModal
        visible={showXPModal}
        title="경험치 획득!"
        primaryButton={{title: '확인', onPress: () => setShowXPModal(false)}}
        onClose={() => setShowXPModal(false)}>
        <View style={xpBadgeStyles.container}>
          <Text style={xpBadgeStyles.text}> 경험치 5 XP </Text>
        </View>
      </NotificationModal>
      {/* 단일 버튼 모달 */}
      <NotificationModal
        visible={showSingleButtonModal}
        title="작업이 완료되었습니다"
        description="모든 변경사항이 성공적으로 저장되었습니다."
        primaryButton={{
          title: '확인',
          onPress: () => setShowSingleButtonModal(false),
        }}
        onClose={() => setShowSingleButtonModal(false)}
      />
      {/* 이미지 있는 모달 */}
      <NotificationModal
        visible={showImageModal}
        title="이미지 있는 모달"
        primaryButton={{title: '확인', onPress: () => setShowImageModal(false)}}
        image={<YoutubeIcon />}
        onClose={() => setShowImageModal(false)}
      />
    </SafeAreaView>
  );
};
// 스타일 추가
const xpBadgeStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.puple.main,
    paddingHorizontal: scaleWidth(16),
    paddingVertical: scaleWidth(8),
    borderRadius: scaleWidth(20),
    marginBottom: scaleWidth(16),
  },
  text: {
    color: COLORS.white,
    fontSize: scaleWidth(14),
    fontWeight: '600',
  },
});
const pointContainerStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.puple.main,
    paddingHorizontal: scaleWidth(16),
    paddingVertical: scaleWidth(8),
    borderRadius: scaleWidth(20),
    marginBottom: scaleWidth(16),
  },
  text: {
    color: COLORS.white,
    fontSize: scaleWidth(14),
    fontWeight: '600',
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: scaleWidth(20),
    paddingBottom: scaleWidth(40),
  },
  header: {
    marginBottom: scaleWidth(32),
  },
  title: {
    fontSize: scaleWidth(28),
    fontWeight: '700',
    color: '#000000',
    marginBottom: scaleWidth(8),
  },
  subtitle: {
    fontSize: scaleWidth(16),
    color: '#666666',
  },
  section: {
    marginBottom: scaleWidth(40),
  },
  sectionTitle: {
    fontSize: scaleWidth(20),
    fontWeight: '600',
    color: '#000000',
    marginBottom: scaleWidth(16),
  },
  subSection: {
    marginBottom: scaleWidth(24),
  },
  subSectionTitle: {
    fontSize: scaleWidth(16),
    fontWeight: '600',
    color: '#666666',
    marginBottom: scaleWidth(12),
  },
  component: {
    marginBottom: scaleWidth(12),
  },
});

export default ComponentShowcaseScreen;
