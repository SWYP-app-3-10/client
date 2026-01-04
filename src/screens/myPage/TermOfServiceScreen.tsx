import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/Header';
import { scaleWidth, COLORS } from '../../styles/global';

/**
 * 서비스 이용 약관 화면
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

      {/* 본문 약관 내용 */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>시행일: 2024년 5월 22일</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제1조 (목적)</Text>
          <Text style={styles.sectionContent}>
            본 약관은 혹성탈출(이하 ‘팀’)이 제공하는 콘텐츠 열람, 퀴즈, 캐릭터
            성장 시스템 및 이에 부수되는 제반 서비스의 이용과 관련하여 팀과
            이용자의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제2조 (용어의 정의)</Text>
          <Text style={styles.sectionContent}>
            • <Text style={styles.boldText}>포인트(P):</Text> 서비스 내에서
            콘텐츠 열람 등을 위해 사용되는 가상의 데이터입니다.{'\n'}•{' '}
            <Text style={styles.boldText}>경험치(XP):</Text> 사용자의 활동(출석,
            퀴즈 등)에 따라 적립되며, 캐릭터의 레벨을 결정하는 척도입니다.{'\n'}
            • <Text style={styles.boldText}>무료 열람권:</Text> 매일 정해진
            수량만큼 제공되는 콘텐츠 무료 이용 권한입니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제3조 (서비스의 이용 및 제한)</Text>
          <Text style={styles.sectionContent}>
            1. <Text style={styles.boldText}>이용 대상:</Text> 본 서비스는 만
            14세 이상의 이용자를 대상으로 하며, 만 14세 미만 아동의 가입은
            제한됩니다. 연령 허위 기재로 발생하는 문제에 대해 팀은 책임을 지지
            않습니다.{'\n'}
            2. <Text style={styles.boldText}>무료 열람권 지급:</Text> 팀은
            이용자의 가입 기간 및 활동 상태에 따라 차등화된 무료 열람 횟수를
            제공합니다. 신규 가입자(1~3일)는 일 최대 7개, 일반 이용자(4일
            이후)는 일 최대 3개의 무료 열람권을 가집니다.{'\n'}
            3. <Text style={styles.boldText}>열람 판단 기준:</Text> 각 콘텐츠별
            설정된 최소 체류 시간(초급 50초, 중급 90초, 고급 190초 등)을
            충족해야 '읽음'으로 간주하며, 이에 따른 보상이 지급됩니다.{'\n'}
            4. <Text style={styles.boldText}>업데이트:</Text> 서비스 콘텐츠는
            6시간 간격으로 업데이트되며, 팀의 사정에 따라 업데이트 주기는 변경될
            수 있습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            제4조 (포인트 및 리워드 시스템)
          </Text>
          <Text style={styles.sectionContent}>
            1. <Text style={styles.boldText}>획득:</Text> 이용자는 퀴즈 풀이,
            출석, 광고 시청 등을 통해 포인트 및 경험치를 획득할 수 있습니다.
            {'\n'}
            2. <Text style={styles.boldText}>사용:</Text> 보유 포인트는 무료
            열람권 소진 후 추가 콘텐츠를 열람하는 데 사용됩니다. (글당 30P 차감)
            {'\n'}
            3. <Text style={styles.boldText}>소멸 및 환불:</Text> 무상으로
            지급된 포인트는 현금으로 환급되지 않으며, 회원 탈퇴 시 즉시 소멸되어
            복구되지 않습니다.{'\n'}
            4. <Text style={styles.boldText}>부정 획득:</Text> 매크로 사용,
            시스템 오류 악용 등 부정한 방법으로 획득한 데이터는 사전 통지 없이
            회수될 수 있으며 서비스 이용이 제한될 수 있습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제5조 (광고 및 서비스 알림)</Text>
          <Text style={styles.sectionContent}>
            1. <Text style={styles.boldText}>광고 리워드:</Text> 광고 시청 완료
            시 포인트가 지급되나, 광고 제공사(AdMob 등)의 사정에 따라 반영이
            지연되거나 시청이 제한될 수 있습니다.{'\n'}
            2. <Text style={styles.boldText}>푸시 알림:</Text> 팀은 서비스
            운영을 위해 푸시 알림을 발송할 수 있으며, 이용자는 앱 설정에서 이를
            거부할 수 있습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제6조 (데이터 활용 및 저작권)</Text>
          <Text style={styles.sectionContent}>
            1. <Text style={styles.boldText}>데이터 활용:</Text> 팀은 서비스
            개선 및 알고리즘 고도화를 위해 이용자의 관심 분야, 문제 풀이 결과,
            난이도 평가 데이터 등을 비식별화하여 활용할 수 있습니다.{'\n'}
            2. <Text style={styles.boldText}>저작권:</Text> 서비스 내 모든
            콘텐츠(글, 퀴즈, 이미지 등)의 저작권은 팀 또는 원저작권자에게
            귀속됩니다. 이용자는 이를 무단 복제하거나 배포할 수 없습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제7조 (면책 사항)</Text>
          <Text style={styles.sectionContent}>
            1. 팀은 이용자의 네트워크 환경이나 디바이스 설정으로 인해 발생하는
            서비스 이용 장애에 대해 책임을 지지 않습니다.{'\n'}
            2. 광고 제공사(AdMob 등)의 시스템 장애로 인한 리워드 미지급에 대해
            팀의 고의 또는 중과실이 없는 한 책임을 지지 않습니다.{'\n'}
            3. 서비스 내 콘텐츠와 퀴즈는 AI 기술을 활용하여 생성되므로 정보의
            정확성을 완전히 보장하지 않습니다. 콘텐츠 오류로 인한 직접적인
            손해에 대해 팀은 책임을 지지 않습니다.
          </Text>
        </View>
      </ScrollView>
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
  },
  contentContainer: {
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(16),
    paddingBottom: scaleWidth(40), // 하단 여백 추가
  },
  lastUpdated: {
    fontSize: scaleWidth(12),
    color: COLORS.gray500,
    marginBottom: scaleWidth(20),
  },
  section: {
    marginBottom: scaleWidth(24),
  },
  sectionTitle: {
    fontSize: scaleWidth(16),
    fontWeight: '700',
    color: COLORS.gray800,
    marginBottom: scaleWidth(8),
  },
  sectionContent: {
    fontSize: scaleWidth(14),
    lineHeight: scaleWidth(22),
    color: COLORS.gray700,
  },
  boldText: {
    fontWeight: '600',
    color: COLORS.gray800,
  },
});
