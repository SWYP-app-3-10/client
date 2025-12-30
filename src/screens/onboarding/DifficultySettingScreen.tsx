import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { BORDER_RADIUS, COLORS, scaleWidth } from '../../styles/global';
import {
  useCompleteOnboarding,
  useOnboardingStore,
  Difficulty,
} from '../../store/onboardingStore';
import { ProgressBar } from '../../components';
import {
  Body_15M,
  Body_16M,
  Body_16R,
  Body_16SB,
  Heading_20EB_Round,
  Heading_24EB_Round,
} from '../../styles/typography';
import Spacer from '../../components/Spacer';
import Button from '../../components/Button';
import Header from '../../components/Header';
import { USE_SERVER_API_FOR_LEVEL } from '../../config/apiConfig';
import { getUserInfo } from '../../services/authService';
import { LevelCategory } from '../../types/interests';
import { updateUserLevel } from '../../api/userApi';

// Difficulty를 LevelCategory로 변환
const difficultyToLevelCategory = (difficulty: Difficulty): LevelCategory => {
  switch (difficulty) {
    case 'beginner':
      return LevelCategory.BEGINNER;
    case 'intermediate':
      return LevelCategory.INTERMEDIATE;
    case 'advanced':
      return LevelCategory.ADVANCED;
    default:
      return LevelCategory.BEGINNER;
  }
};

const DIFFICULTY_INFO = {
  [LevelCategory.BEGINNER]: {
    label: '초급',
    time: '1분',
    description:
      '인공지능 기술은 산업과 일상생활에서 빠르게 확산되고 있다. 많은 나라가 인공지능 안전과 신뢰를 높이기 위한 법과 기준을 준비 중이다. 예를 들어 새로운 법의 시행령이 검토되면서 안전과 산업 발전의 균형을 맞추려는 움직임이 있다. 일부 지역에서는 인공지능 서비스의 위험과 책임을 명확히 규정하려는 논의도 진행되고 있다. 이런 움직임은 기술 발전과 사회적 영향 모두를 고려한 것이다.',
  },
  [LevelCategory.INTERMEDIATE]: {
    label: '중급',
    time: '2분',
    description: `인공지능 기술은 의료, 금융, 일상 서비스 등 여러 분야에서 활용이 늘고 있다. 이런 기술적 성장에 맞춰 각국 정부와 기관은 안전과 책임에 관한 규제 체계를 마련하려 한다. 한국에서도 인공지능 기본법의 시행령이 논의되며 신뢰와 안전 기준을 마련하려는 움직임이 있다. 이 법에는 고위험 인공지능의 책임 범위와 투명성 의무 등이 포함될 전망이다.\n
해외에서도 인공지능 규제 논의가 활발하다. 일부 국가는 감시 기능이 있는 서비스에 대한 안전 조치를 강화하고 있으며, 다른 곳에서는 기술 혁신과 안전 사이의 균형을 고민한다. 이런 논의는 인공지능이 사회에 미치는 영향을 줄이려는 시도로 볼 수 있다. 문제 해결을 위해 법과 기술 기준을 함께 정비하는 과정이 계속되고 있다.`,
  },
  [LevelCategory.ADVANCED]: {
    label: '고급',
    time: '4분',
    description: `인공지능 기술은 빠르게 발전하면서 산업, 의료, 금융 등 다양한 분야에 적용되고 있다. 이런 기술적 확산은 효율성을 높이는 동시에 새로운 위험과 책임 문제를 불러왔다. 많은 정부와 기관은 인공지능의 활용과 안전을 균형 있게 관리하기 위한 법적·정책적 틀을 마련하고 있다. 한국에서는 인공지능 기본법의 시행령이 준비되며 신뢰 기반의 규제와 산업 육성을 동시에 고려하는 방향으로 논의가 진행되고 있다. 이 법은 기술의 책임과 투명성, 안전 기준을 정하는 데 초점을 맞춘다.\n
해외에서도 비슷한 흐름이 보인다. 일부 국가는 인공지능의 위험 요소를 줄이기 위한 규제를 도입하고 있으며, 다른 국가들은 혁신을 저해하지 않는 범위에서 조합된 규제 방안을 모색하고 있다. 이러한 논의는 기술 발전을 주도하는 기업과 정부가 함께 참여하는 과정이다. 규제의 방향은 공공 안전, 개인정보 보호, 책임 명확화 등 다양한 요소를 포함하고 있다.\n
기술 발전과 규제 논의는 서로 긴밀하게 맞물려 있다. 기술이 사회 전반에 영향을 미치는 만큼, 법적 틀과 운영 체계도 함께 진화해야 한다. 다양한 국가의 사례는 규제의 범위와 방식이 서로 다르다는 점을 보여 준다. 예를 들어 일부 지역에서는 위험이 큰 응용 분야에 특별한 기준을 적용하고, 다른 곳에서는 기본적인 운영 규칙을 법으로 정한다. 이런 조치는 인공지능이 안전하고 신뢰할 수 있도록 관리하려는 의도를 반영한다.`,
  },
};
const DifficultySettingScreen = () => {
  const savedDifficulty = useOnboardingStore(state => state.difficulty);
  const setDifficulty = useOnboardingStore(state => state.setDifficulty);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(
    savedDifficulty || 'beginner',
  );
  const completeOnboarding = useCompleteOnboarding();

  // 난이도 변경 시 저장
  const handleDifficultyChange = useCallback(
    (difficulty: Difficulty) => {
      setSelectedDifficulty(difficulty);
      setDifficulty(difficulty);
    },
    [setDifficulty],
  );

  const handleNext = async () => {
    // 온보딩 완료 처리 및 메인 화면으로 이동
    if (USE_SERVER_API_FOR_LEVEL) {
      const userInfo = await getUserInfo();
      if (!userInfo || !userInfo.userId) {
        Alert.alert(
          '오류',
          '사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.',
        );
        return;
      }
      console.log('[난이도 업데이트] API 호출 시작');
      await updateUserLevel(
        userInfo.userId,
        difficultyToLevelCategory(selectedDifficulty),
      );
      console.log('[난이도 업데이트] API 호출 성공');
    }
    await completeOnboarding();
  };
  const { bottom } = useSafeAreaInsets();
  const selectedInfo =
    DIFFICULTY_INFO[difficultyToLevelCategory(selectedDifficulty)];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header iconColor={COLORS.gray400} />
      <Spacer num={2} />

      <View style={styles.header}>
        <ProgressBar fill={2} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: bottom }}
        showsVerticalScrollIndicator={false}
      >
        <Spacer num={92} />
        <Text style={styles.title}>난이도를 선택해주세요</Text>
        <Spacer num={4} />
        <Text style={styles.subtitle}>
          화면에서 나의 관심분야 글을 확인할 수 있어요
        </Text>
        <Spacer num={32} />
        {/* 난이도 선택 버튼 */}
        <View style={styles.difficultyContainer}>
          <Button
            variant="primary"
            title="초급"
            style={[
              styles.difficultyButton,
              selectedDifficulty === 'beginner' &&
                styles.difficultyButtonSelected,
            ]}
            onPress={() => handleDifficultyChange('beginner')}
          >
            <Text
              style={[
                styles.difficultyButtonText,
                selectedDifficulty === 'beginner' &&
                  styles.difficultyButtonTextSelected,
              ]}
            >
              초급
            </Text>
          </Button>
          <Button
            variant="primary"
            title="중급"
            style={[
              styles.difficultyButton,
              selectedDifficulty === 'intermediate' &&
                styles.difficultyButtonSelected,
            ]}
            onPress={() => handleDifficultyChange('intermediate')}
          >
            <Text
              style={[
                styles.difficultyButtonText,
                selectedDifficulty === 'intermediate' &&
                  styles.difficultyButtonTextSelected,
              ]}
            >
              중급
            </Text>
          </Button>
          <Button
            variant="primary"
            title="고급"
            style={[
              styles.difficultyButton,
              selectedDifficulty === 'advanced' &&
                styles.difficultyButtonSelected,
            ]}
            onPress={() => handleDifficultyChange('advanced')}
          >
            <Text
              style={[
                styles.difficultyButtonText,
                selectedDifficulty === 'advanced' &&
                  styles.difficultyButtonTextSelected,
              ]}
            >
              고급
            </Text>
          </Button>
        </View>
        <Spacer num={32} />
        {/* 선택된 난이도 설명 */}
        <View>
          <View style={styles.descriptionTitleContainer}>
            <Text style={styles.descriptionTitle}>{selectedInfo.label}</Text>
            <Text style={styles.descriptionLabelTime}>
              소요시간 {selectedInfo.time}
            </Text>
          </View>
          <Spacer num={20} />
          <Text style={styles.descriptionText}>{selectedInfo.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="primary"
          title="다음"
          onPress={handleNext}
          // disabled={!isNextButtonActive}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(20),
  },
  content: {
    flex: 1,
    paddingHorizontal: scaleWidth(20),
  },
  title: {
    ...Heading_24EB_Round,
    color: COLORS.black,
  },
  subtitle: {
    ...Body_15M,
    color: COLORS.gray600,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: scaleWidth(8),
    height: scaleWidth(52),
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS[12],
  },
  difficultyButton: {
    backgroundColor: 'transparent',
    width: scaleWidth(107),
    height: scaleWidth(36),
    borderRadius: BORDER_RADIUS[10],
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyButtonSelected: {
    backgroundColor: COLORS.puple.main,
    borderColor: COLORS.puple.main,
    borderRadius: BORDER_RADIUS[10],
  },
  difficultyButtonText: {
    ...Body_16SB,
    color: COLORS.gray500,
  },
  difficultyButtonTextSelected: {
    ...Body_16SB,
    color: COLORS.white,
  },
  descriptionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(11),
  },
  descriptionTitle: {
    ...Heading_20EB_Round,
    color: COLORS.puple.main,
  },
  descriptionLabelTime: {
    ...Body_16M,
    color: COLORS.puple.main,
  },
  descriptionText: {
    ...Body_16R,
    color: COLORS.black,
  },
  footer: {
    paddingHorizontal: scaleWidth(20),
  },
});

export default DifficultySettingScreen;
