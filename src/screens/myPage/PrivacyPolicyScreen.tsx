import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/Header';
import { scaleWidth, COLORS } from '../../styles/global';

/**
 * 개인정보 처리방침 화면
 */
const PrivacyPolicyScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* 상단 헤더 */}
      <Header
        title="개인정보 처리방침"
        goBackAction={() => navigation.goBack()}
      />

      {/* 본문 */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.text}>
          혹성탈출 (이하 “팀”)은 팀이 제공하는 서비스 “뉴로스(Neurous)”(이하
          “서비스”)를 이용하는 개인(이하 “이용자”)의 정보를 보호하기 위해,
          「개인정보 보호법」 등 관련 법령을 준수하고, 서비스 이용자의 개인정보
          보호 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여
          다음과 같이 개인정보 처리방침을 수립·공개합니다.
        </Text>

        {/* 1. 개인정보 수집 및 이용 목적 */}
        <Text style={styles.title}>1. 개인정보 수집 및 이용 목적</Text>
        <Text style={styles.text}>
          팀은 이용자의 개인정보를 다음의 목적으로만 활용합니다.
        </Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.list}>
            • <Text style={styles.bold}>회원 관리:</Text> 본인 식별, 가입 의사
            확인, 불량 회원 부정 이용 방지, 각종 고지 및 분쟁 조정을 위한 기록
            보존
          </Text>
          <Text style={styles.list}>
            • <Text style={styles.bold}>서비스 제공:</Text> 콘텐츠(미션, 탐색,
            퀴즈 등) 제공, 이용자 맞춤형 로직 적용, 포인트/경험치 관리
          </Text>
          <Text style={styles.list}>
            • <Text style={styles.bold}>광고 및 리워드 제공:</Text> Google AdMob
            송출, 리워드 지급 및 부정 이용 방지
          </Text>
          <Text style={styles.list}>
            • <Text style={styles.bold}>신규 서비스 개발 및 마케팅:</Text> 이용
            통계 분석 및 서비스 최적화
          </Text>
        </View>
        <Text style={[styles.text, { marginTop: 8 }]}>
          <Text style={styles.bold}>나. 아동의 개인정보 보호:</Text> 만 14세
          이상임을 필수적으로 확인하며, 만 14세 미만 아동의 개인정보가 확인될
          경우 즉시 파기합니다.
        </Text>

        {/* 2. 수집하는 개인정보의 항목 및 방법 */}
        <Text style={styles.title}>2. 수집하는 개인정보의 항목 및 방법</Text>
        <Text style={styles.subTitle}>가. 처리하는 개인정보의 항목</Text>
        <Text style={styles.list}>
          • 소셜 로그인: 식별 값(CI/DI), 이메일, 이름
        </Text>
        <Text style={styles.list}>• 초기 설정: 관심 분야, 설정 난이도</Text>
        <Text style={styles.list}>
          • 자동 수집: 접속 로그, 열람 시간, 퀴즈 결과, 포인트 내역, 단말기
          정보(모델명, OS), ADID/IDFA, IP 주소
        </Text>

        <Text style={styles.subTitle}>나. 수집 방법</Text>
        <Text style={styles.text}>
          직접 입력, 소셜 제휴사 제공, 자동 생성 정보 수집 툴(SDK)을 통한 수집
        </Text>

        <Text style={styles.subTitle}>다. 자동 수집 장치의 거부</Text>
        <Text style={styles.text}>
          이용자는 설정을 통해 광고 식별자 수집을 거부할 수 있습니다.{'\n'}-
          Android: 설정 {'>'} Google {'>'} 광고{'\n'}- iOS: 설정 {'>'} 개인정보
          보호 {'>'} 추적
        </Text>

        {/* 3. 개인정보의 제3자 제공 및 위탁 */}
        <Text style={styles.title}>3. 개인정보의 제3자 제공 및 위탁</Text>
        <Text style={styles.subTitle}>가. 개인정보 처리 위탁</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { flex: 1 }]}>수탁 업체</Text>
            <Text style={[styles.tableHeader, { flex: 2 }]}>
              위탁 업무 내용
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>NCP</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>
              데이터 저장, 서버 운영
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>Google AdMob</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>
              리워드 광고 관리(국외)
            </Text>
          </View>
        </View>

        {/* 4. 개인정보 보유 기간 및 파기 */}
        <Text style={styles.title}>4. 개인정보 보유 기간 및 파기</Text>
        <Text style={styles.text}>
          이용자의 개인정보는 수집 목적이 달성되면 지체 없이 파기합니다. 회원
          탈퇴 시 즉시 삭제되며, 전자적 파일은 재생할 수 없는 기술적 방법으로
          영구 삭제합니다.
        </Text>

        {/* 5. 이용자의 권리 및 행사 방법 */}
        <Text style={styles.title}>5. 이용자의 권리 및 행사 방법</Text>
        <Text style={styles.text}>
          이용자는 앱 내 [마이페이지 {'>'} 설정]을 통해 개인정보를
          조회·수정하거나 [회원 탈퇴]를 통해 동의를 철회할 수 있습니다.
        </Text>

        {/* 6. 개인정보 보호 책임자 */}
        <Text style={styles.title}>6. 개인정보 보호 책임자</Text>
        <View style={styles.box}>
          <Text style={styles.text}>
            <Text style={styles.bold}>성명/직책:</Text> 이슬희 / PM
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>연락처:</Text> neurous2@gmail.com
          </Text>
        </View>
        <Text style={[styles.text, { marginTop: 12 }]}>
          기타 침해 신고는 개인정보분쟁조정위원회(1833-6972) 또는 경찰청
          사이버수사국(182)에 문의하시기 바랍니다.
        </Text>

        {/* 7. 변경 고지 */}
        <Text style={styles.title}>7. 개인정보 처리방침의 변경</Text>
        <Text style={styles.text}>공고 일자: 2026.01.03</Text>
        <Text style={styles.text}>시행 일자: 2026.01.04</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: scaleWidth(20),
  },
  content: {
    paddingTop: scaleWidth(16),
    paddingBottom: scaleWidth(60),
  },
  title: {
    marginTop: scaleWidth(32),
    marginBottom: scaleWidth(12),
    fontSize: scaleWidth(18),
    fontWeight: '700',
    color: COLORS.black,
  },
  subTitle: {
    marginTop: scaleWidth(16),
    marginBottom: scaleWidth(8),
    fontSize: scaleWidth(15),
    fontWeight: '600',
    color: COLORS.black,
  },
  text: {
    fontSize: scaleWidth(14),
    lineHeight: scaleWidth(22),
    color: COLORS.gray700,
  },
  list: {
    fontSize: scaleWidth(14),
    lineHeight: scaleWidth(22),
    color: COLORS.gray700,
    marginBottom: scaleWidth(4),
  },
  bulletContainer: {
    marginTop: scaleWidth(8),
  },
  bold: {
    fontWeight: '700',
    color: COLORS.black,
  },
  table: {
    marginTop: scaleWidth(8),
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray300,
  },
  tableHeader: {
    padding: scaleWidth(8),
    backgroundColor: COLORS.gray100,
    fontWeight: '700',
    fontSize: scaleWidth(12),
    textAlign: 'center',
  },
  tableCell: {
    padding: scaleWidth(8),
    fontSize: scaleWidth(12),
    color: COLORS.gray700,
    textAlign: 'center',
  },
  box: {
    padding: scaleWidth(12),
    backgroundColor: COLORS.gray100,
    borderRadius: 8,
    marginTop: scaleWidth(8),
  },
});
