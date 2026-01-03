import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  COLORS,
  scaleWidth,
  BORDER_RADIUS,
  Heading_16B,
  Heading_20EB_Round,
  Body_16M,
  Heading_18SB,
} from '../../styles/global';

import { useShowToast } from '../../store/toastStore';
import { getUserInfo } from '../../services/authService';

/**
 * 문의하기 화면
 * - 문의 내용(멀티라인) + 답변 받을 이메일 입력
 * - 하단 "전달하기" 버튼은 문의 내용이 1글자 이상이면 활성화
 * - 라벨은 공통 Input의 label만 사용 (중복 방지)
 * - textarea는 Input의 containerStyle로 높이만 확장 (공통 컴포넌트 유지)
 */
const InquiryScreen = () => {
  const navigation = useNavigation<any>();

  // 토스트 요청 함수
  const showToast = useShowToast();

  const [content, setContent] = useState(''); // 문의 내용
  const [email, setEmail] = useState(''); // 답변 받을 이메일

  /**
   * 로그인 정보에서 이메일 가져오기
   */
  useEffect(() => {
    const fetchEmail = async () => {
      const userInfo = await getUserInfo();
      console.log('저장된 유저 정보:', userInfo);
      if (userInfo?.email) {
        setEmail(userInfo.email);
      }
    };
    fetchEmail();
  }, []);

  /**
   * 버튼 활성화 조건
   * - 문의 내용이 비어있지 않으면 활성화
   */
  const isSubmitEnabled = useMemo(() => {
    return content.trim().length >= 10; // 10자 이상 입력 시 활성화
  }, [content]); // content 변경 시 재계산

  /**
   * 전달하기
   * - TODO: 실제 API 연결
   */
  const onPressSubmit = () => {
    console.log('[Inquiry] submit', { content, email }); // 임시 로그

    // 설정 화면에서 토스트가 뜨도록 store에 메시지 저장
    showToast('전달이 완료되었어요');

    // 이전 화면(설정 화면)으로 돌아가기
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* 키보드 올라올 때 화면 밀어올리기 */}
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 헤더 영역 */}
        <View style={styles.headerWrap}>
          {/* 공통 헤더는 그대로 사용 (title은 비워서 기본 Text 출력 방지) */}
          <Header title="" />

          {/* 중앙 타이틀 오버레이 */}
          <View pointerEvents="none" style={styles.headerCenterTitleWrap}>
            <Text style={styles.headerCenterTitle}>문의하기</Text>
          </View>
        </View>

        {/* 스크롤 영역 */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 안내 문구 */}
          <Text style={styles.title}>
            뉴로스 이용 중 불편한 점이나{'\n'}
            궁금한 점이 있다면 말씀해주세요.
          </Text>

          {/* ===== 문의 내용 라벨 ===== */}
          <Text style={styles.sectionLabel}>문의 내용</Text>

          {/* 문의 내용 입력 */}
          <Input
            placeholder="문의 사항을 입력해주세요"
            value={content}
            onChangeText={setContent}
            variant="outline"
            multiline
            textAlignVertical="top"
            containerStyle={styles.textareaContainer}
            style={styles.textareaInput}
          />

          {/* ===== 답변 받을 이메일 라벨 ===== */}
          <Text style={[styles.sectionLabel, styles.sectionLabelWithTop]}>
            답변 받을 이메일
          </Text>

          {/* 답변 받을 이메일 입력 */}
          <Input
            placeholder="abcd@naver.com"
            value={email}
            onChangeText={setEmail}
            variant="outline"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.emailContainer}
            style={styles.textareaInput}
          />
        </ScrollView>

        {/* 하단 버튼 영역 */}
        <View style={styles.bottom}>
          <Button
            title="전달하기"
            onPress={onPressSubmit}
            disabled={!isSubmitEnabled} // 문의 내용 입력 전까지 비활성화
            variant="primary"
            style={styles.submitButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InquiryScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingBottom: scaleWidth(20),
  },
  headerWrap: {
    position: 'relative',
  },
  headerCenterTitleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: scaleWidth(8),
    height: scaleWidth(52),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenterTitle: {
    ...Heading_16B,
    color: COLORS.black,
  },
  kav: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(25),
    paddingBottom: scaleWidth(10),
  },
  title: {
    ...Heading_20EB_Round,
    color: COLORS.black,
    lineHeight: scaleWidth(35),
    marginBottom: scaleWidth(52),
  },
  sectionLabel: {
    ...Heading_18SB,
    color: COLORS.black,
    marginBottom: scaleWidth(12),
  },
  textareaContainer: {
    height: scaleWidth(207),
    alignItems: 'flex-start',
    padding: scaleWidth(18),
    borderRadius: BORDER_RADIUS[16],
    borderColor: COLORS.gray300,
  },
  emailContainer: {
    height: scaleWidth(60),
    borderColor: COLORS.gray300,
  },
  textareaInput: {
    ...Body_16M,
    color: COLORS.gray600,
  },
  sectionLabelWithTop: {
    marginTop: scaleWidth(32),
  },
  bottom: {
    height: scaleWidth(63),
    paddingHorizontal: scaleWidth(20),
    backgroundColor: COLORS.white,
  },
  submitButton: {
    width: '100%',
    borderRadius: scaleWidth(12),
  },
});
