// TermsOfServiceScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/Header';

import { scaleWidth, COLORS } from '../../styles/global';

/**
 * 서비스 이용 약관 화면 (현재는 빈 화면)
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(16),
  },
  placeholder: {
    color: COLORS.gray500,
    fontSize: scaleWidth(14),
  },
});
