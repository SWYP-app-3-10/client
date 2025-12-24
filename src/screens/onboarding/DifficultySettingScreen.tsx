import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

const DIFFICULTY_INFO = {
  beginner: {
    label: '초급',
    time: '1분',
    description:
      '록히드 마틴이 F-35 전투기 관련 총 11억 4천만 달러 규모의 대형 계약을 추가로 확보하면서 글로벌 방산 산업에 다시 한 번 강한 신호를 보냈다. 이번 계약은 단순한 무기 판매를 넘어, 미·중·러를 축으로 한 패권 경쟁이 얼마나 구조적으로 고착화되고 있는지를 보여주는 상징적 사건이다. ',
  },
  intermediate: {
    label: '중급',
    time: '3분',
    description:
      '중급 난이도는 조금 더 깊이 있는 내용을 다룹니다. 하루에 3분 정도 투자하면 꾸준히 성장할 수 있어요.',
  },
  advanced: {
    label: '고급',
    time: '5분',
    description:
      '고급 난이도는 전문적이고 심화된 내용을 다룹니다. 하루에 5분 정도 투자하면 전문성을 키울 수 있어요.',
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
    await completeOnboarding();
  };

  const selectedInfo = DIFFICULTY_INFO[selectedDifficulty];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header iconColor={COLORS.gray400} />
      <Spacer num={2} />

      <View style={styles.header}>
        <ProgressBar fill={2} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
