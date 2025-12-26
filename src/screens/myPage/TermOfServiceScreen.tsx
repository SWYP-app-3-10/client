// TermsOfServiceScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/Header';

import { scaleWidth, COLORS } from '../../styles/global';

/**
 * 서비스 이용 약관 화면 (현재는 빈 화면)
 * - 나중에: WebView/Markdown/ScrollView로 약관 텍스트 붙이면 됨
 */
const TermsOfServiceScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* 상단 헤더 */}
      <Header
        title="서비스 이용 약관"
        goBackAction={() => navigation.goBack()}
      />

      {/* 본문 */}
      <View style={styles.container}>
        <Text style={styles.placeholder}>약관 내용을 준비 중이에요.</Text>
      </View>
    </SafeAreaView>
  );
};

export default TermsOfServiceScreen;

/* =========================
  스타일
========================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: scaleWidth(20), // 좌우 패딩
    paddingTop: scaleWidth(16), // 상단 패딩
  },
  placeholder: {
    color: COLORS.gray500,
    fontSize: scaleWidth(14),
  },
});
