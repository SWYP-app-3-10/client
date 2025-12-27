import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
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
          팀이름 (이하 “팀”)은 팀이 제공하고자 하는 서비스 (이하 “뉴로스”)를
          이용하는 개인(이하 “이용자”)의 정보를 보호하기 위해,
          「개인정보보호법」 등 관련 법령을 준수하고, 서비스 이용자의 개인정보
          보호와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여
          다음과 같이 개인정보처리방침을 수립·공개합니다.
        </Text>

        <Text style={styles.title}>1. 개인정보 수집 및 이용 목적</Text>
        <Text style={styles.text}>
          팀은 이용자의 개인정보를 다음의 목적으로만 활용합니다. 다음 목적 외의
          용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를
          받는 등 필요한 조치를 이행할 예정입니다.
        </Text>
        <Text style={styles.list}>- 회원 관리</Text>
        <Text style={styles.list}>- 서비스 제공 (콘텐츠 제공)</Text>
        <Text style={styles.list}>- 마케팅 및 광고</Text>

        <Text style={styles.title}>2. 수집하는 개인정보의 항목 및 방법</Text>
        <Text style={styles.subTitle}>처리하는 개인정보의 항목</Text>
        <Text style={styles.text}>
          팀은 회원 관리 및 서비스 제공을 위해 다음 개인정보를 수집합니다.
        </Text>

        <Text style={styles.list}>- 회원 가입</Text>
        <Text style={styles.text}>
          (카카오톡, 네이버, 구글, 애플): 로그인 정보 식별 값, 프로필 사진,
          이메일, 이름, 닉네임
        </Text>

        <Text style={styles.list}>- 서비스 이용</Text>
        <Text style={styles.text}>
          PUSH 수신 여부, 단말기 식별정보, 단말 OS 정보
        </Text>

        <Text style={styles.subTitle}>개인정보의 수집 방법</Text>
        <Text style={styles.text}>
          회원가입 및 서비스 이용 과정에서 이용자가 개인정보 수집에 대해
          동의하고 입력하는 경우
        </Text>
        <Text style={styles.text}>스마트폰용 어플리케이션을 통한 수집</Text>

        <Text style={styles.subTitle}>
          개인정보 자동 수집 장치의 설치, 운영 및 거부에 관한 사항
        </Text>

        <Text style={styles.title}>3. 개인정보의 제3자 제공 및 위탁</Text>
        <Text style={styles.text}>개인정보 처리 위탁 (및 국외 이전)</Text>
        <Text style={styles.list}>
          - NCS(Naver Cloud Service): 서비스 데이터 저장 및 서버 운영
        </Text>

        <Text style={styles.title}>4. 개인정보 보유 기간 및 파기</Text>
        <Text style={styles.text}>
          개인정보는 수집 및 이용 목적이 달성된 후에는 지체 없이 파기됩니다.
        </Text>

        <Text style={styles.subTitle}>개인정보 파기 절차 및 방법</Text>

        <Text style={styles.title}>5. 이용자의 권리</Text>
        <Text style={styles.text}>
          정보주체는 개인정보 조회, 수정, 삭제, 처리 정지를 요구할 수 있습니다.
        </Text>
        <Text style={styles.list}>- 동의 철회</Text>
        <Text style={styles.list}>- 개인정보 수정 및 삭제</Text>
        <Text style={styles.list}>- 열람 및 정정</Text>

        <Text style={styles.title}>6. 개인정보 보호 책임자</Text>
        <Text style={styles.text}>개인정보 보호 책임자 및 담당 부서</Text>
        <Text style={styles.text}>정보주체의 권익침해에 대한 구제방법</Text>

        <Text style={styles.title}>7. 개인정보 처리방침의 변경</Text>
        <Text style={styles.text}>
          개인정보처리방침은 관련 법률 및 지침의 변경, 내부 운영 방침의 변경에
          따라 변경될 수 있습니다.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

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
    paddingHorizontal: scaleWidth(20),
  },
  content: {
    paddingTop: scaleWidth(16),
    paddingBottom: scaleWidth(40),
  },
  title: {
    marginTop: scaleWidth(24),
    marginBottom: scaleWidth(8),
    fontSize: scaleWidth(16),
    fontWeight: '700',
    color: COLORS.black,
  },
  subTitle: {
    marginTop: scaleWidth(16),
    marginBottom: scaleWidth(6),
    fontSize: scaleWidth(14),
    fontWeight: '600',
    color: COLORS.black,
  },
  text: {
    fontSize: scaleWidth(14),
    lineHeight: scaleWidth(22),
    color: COLORS.gray700,
  },
  list: {
    marginTop: scaleWidth(4),
    fontSize: scaleWidth(14),
    lineHeight: scaleWidth(22),
    color: COLORS.gray700,
  },
});
