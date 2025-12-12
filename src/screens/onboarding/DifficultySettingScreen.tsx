import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {scaleWidth} from '../../styles/global';
import {
  OnboardingStackParamList,
  RootStackParamList,
} from '../../navigation/types';
import {RouteNames} from '../../../routes';
import {useOnboarding} from '../../context/OnboardingContext';

type InterestsScreenProps = CompositeNavigationProp<
  NativeStackNavigationProp<
    OnboardingStackParamList,
    typeof RouteNames.INTERESTS
  >,
  // 부모 내비게이터 (Root) -> 이걸 붙여야 MAIN_TAB으로 이동 가능
  NativeStackNavigationProp<RootStackParamList>
>;
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

const DIFFICULTY_INFO = {
  beginner: {
    label: '초급',
    time: '1분',
    description:
      '초급 난이도는 짧은 시간 동안 간단한 내용을 학습할 수 있습니다. 하루에 1분만 투자하면 부담 없이 시작할 수 있어요.',
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
  const navigation = useNavigation<InterestsScreenProps>();
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>('beginner');
  const {completeOnboarding} = useOnboarding();
  const handleNext = () => {
    // TODO: 온보딩 완료 처리 및 메인 화면으로 이동
    completeOnboarding();
  };

  const selectedInfo = DIFFICULTY_INFO[selectedDifficulty];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {width: '100%'}]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>난이도를 선택해주세요</Text>
        <Text style={styles.subtitle}>
          화면에서 나의 관심분야 글을 확인할 수 있어요
        </Text>

        {/* 난이도 선택 버튼 */}
        <View style={styles.difficultyContainer}>
          <TouchableOpacity
            style={[
              styles.difficultyButton,
              selectedDifficulty === 'beginner' &&
                styles.difficultyButtonSelected,
            ]}
            onPress={() => setSelectedDifficulty('beginner')}>
            <Text
              style={[
                styles.difficultyButtonText,
                selectedDifficulty === 'beginner' &&
                  styles.difficultyButtonTextSelected,
              ]}>
              초급
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.difficultyButton,
              selectedDifficulty === 'intermediate' &&
                styles.difficultyButtonSelected,
            ]}
            onPress={() => setSelectedDifficulty('intermediate')}>
            <Text
              style={[
                styles.difficultyButtonText,
                selectedDifficulty === 'intermediate' &&
                  styles.difficultyButtonTextSelected,
              ]}>
              중급
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.difficultyButton,
              selectedDifficulty === 'advanced' &&
                styles.difficultyButtonSelected,
            ]}
            onPress={() => setSelectedDifficulty('advanced')}>
            <Text
              style={[
                styles.difficultyButtonText,
                selectedDifficulty === 'advanced' &&
                  styles.difficultyButtonTextSelected,
              ]}>
              고급
            </Text>
          </TouchableOpacity>
        </View>

        {/* 선택된 난이도 설명 */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>
            {selectedInfo.label} 소요시간 {selectedInfo.time}
          </Text>
          <Text style={styles.descriptionText}>{selectedInfo.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(12),
    paddingBottom: scaleWidth(16),
    gap: scaleWidth(12),
  },
  backButton: {
    fontSize: scaleWidth(24),
    color: '#000000',
  },
  progressBar: {
    flex: 1,
    height: scaleWidth(4),
    backgroundColor: '#E0E0E0',
    borderRadius: scaleWidth(2),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9B59B6',
  },
  content: {
    flex: 1,
    paddingHorizontal: scaleWidth(20),
  },
  title: {
    fontSize: scaleWidth(24),
    fontWeight: '700',
    color: '#000000',
    marginBottom: scaleWidth(8),
    marginTop: scaleWidth(8),
  },
  subtitle: {
    fontSize: scaleWidth(14),
    color: '#666666',
    marginBottom: scaleWidth(32),
    lineHeight: scaleWidth(20),
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: scaleWidth(8),
    marginBottom: scaleWidth(32),
  },
  difficultyButton: {
    flex: 1,
    height: scaleWidth(48),
    borderRadius: scaleWidth(12),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyButtonSelected: {
    backgroundColor: '#9B59B6',
    borderColor: '#9B59B6',
  },
  difficultyButtonText: {
    fontSize: scaleWidth(16),
    color: '#666666',
    fontWeight: '600',
  },
  difficultyButtonTextSelected: {
    color: '#FFFFFF',
  },
  descriptionContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: scaleWidth(12),
    padding: scaleWidth(20),
    marginBottom: scaleWidth(20),
  },
  descriptionTitle: {
    fontSize: scaleWidth(18),
    fontWeight: '600',
    color: '#000000',
    marginBottom: scaleWidth(12),
  },
  descriptionText: {
    fontSize: scaleWidth(14),
    color: '#666666',
    lineHeight: scaleWidth(20),
  },
  footer: {
    paddingHorizontal: scaleWidth(20),
    paddingBottom: scaleWidth(40),
    paddingTop: scaleWidth(20),
  },
  nextButton: {
    width: '100%',
    height: scaleWidth(56),
    backgroundColor: '#E0E0E0',
    borderRadius: scaleWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#666666',
    fontSize: scaleWidth(16),
    fontWeight: '600',
  },
});

export default DifficultySettingScreen;
