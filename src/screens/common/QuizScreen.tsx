import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  COLORS,
  scaleWidth,
  BORDER_RADIUS,
  Body_16M,
  Body_16SB,
} from '../../styles/global';
import Header from '../../components/Header';
import Button from '../../components/Button';
import QuizOptionCard from '../../components/QuizOptionCard';
import QuizQuestion from '../../components/QuizQuestion';
import Spacer from '../../components/Spacer';
import { QuizOption } from '../../data/mock/quizData';
import { CheckIcon } from '../../icons/commonIcons/commonIcons';
import { useShowModal, useHideModal } from '../../store/modalStore';
import DifficultySelectionModal, {
  Difficulty,
} from '../../components/DifficultySelectionModal';
import {
  useNavigation,
  useRoute,
  CommonActions,
} from '@react-navigation/native';
import { RouteNames } from '../../../routes';
import { mockQuiz } from '../../data/mock/quizData';
import { ExperienceModalContent } from '../../components/ArticlePointModalContent';
import { usePointStore } from '../../store/pointStore';
import { useExperienceStore } from '../../store/experienceStore';
import {
  QUIZ_CORRECT_POINT,
  QUIZ_CORRECT_EXPERIENCE,
} from '../../config/rewards';

type QuizState = 'question' | 'feedback';

const QuizScreen: React.FC = () => {
  const route = useRoute();
  // @ts-ignore
  const articleId = route.params?.articleId || 0;
  // @ts-ignore
  const returnTo = route.params?.returnTo || 'mission';
  const quiz = mockQuiz; // TODO: articleId로 실제 퀴즈 데이터 가져오기
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('question');
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);
  const showModal = useShowModal();
  const hideModal = useHideModal();
  const navigation = useNavigation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOptionSelect = (optionId: number) => {
    if (quizState === 'question') {
      setSelectedOptionId(optionId);
    }
  };
  const { addPoints } = usePointStore();
  const { addExperience } = useExperienceStore();
  const handleNext = async () => {
    if (!selectedOptionId) {
      return;
    }

    // TODO: 서버로 답안 전송
    // 예시: await submitQuizAnswer(articleId, quiz.id, selectedOptionId);
    console.log('퀴즈 답안 전송:', {
      articleId,
      quizId: quiz.id,
      answerId: selectedOptionId,
    });

    await Promise.all([
      addPoints(QUIZ_CORRECT_POINT),
      addExperience(QUIZ_CORRECT_EXPERIENCE),
    ]);

    showModal({
      title: '포인트 & 경험치 획득!',
      titleDescriptionGapSize: scaleWidth(20),
      children: React.createElement(ExperienceModalContent, {
        point: true,
        correct: isCorrect(selectedOptionId),
      }),
      primaryButton: {
        title: '확인',
        onPress: () => {},
      },
    });
    if (true) {
      // 피드백 안떴다면
      setQuizState('feedback');
    }
  };

  const handleComplete = () => {
    // 기존 타이머가 있으면 클리어
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 난이도 선택 모달 표시
    showModal({
      title: '이번 글의 난이도는\n 어떠셨나요?',
      description: '콘텐츠의 난이도에 반영해드려요!',
      titleDescriptionGapSize: scaleWidth(8),
      descriptionColor: COLORS.gray600,
      closeOnBackdropPress: false,
      children: (
        <DifficultySelectionModal
          initialDifficulty={selectedDifficulty}
          onSelect={difficulty => {
            setSelectedDifficulty(difficulty);
            // 난이도 선택 시 모달 닫고 원래 화면으로 이동
            setTimeout(() => {
              hideModal();
              // 원래 화면으로 이동 (스택 초기화)
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: RouteNames.MAIN_TAB,
                      state: {
                        routes: [
                          {
                            name:
                              returnTo === 'search'
                                ? RouteNames.SEARCH_TAB
                                : RouteNames.MISSION_TAB,
                            state: {
                              routes: [
                                {
                                  name:
                                    returnTo === 'search'
                                      ? RouteNames.SEARCH
                                      : RouteNames.MISSION,
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                }),
              );
            }, 2000);
            // TODO: 서버로 난이도 전송
            console.log('난이도 전송:', {
              articleId,
              difficulty,
            });
          }}
        />
      ),
    });
  };

  const isCorrect = (optionId: number) => {
    return optionId === quiz.correctAnswerId;
  };

  const renderOption = (option: QuizOption) => {
    if (quizState === 'question') {
      // 문제 화면: 선택 여부에 따라 스타일 변경
      const isSelected = selectedOptionId === option.id;
      return (
        <TouchableOpacity
          key={option.id}
          style={[styles.optionCard, isSelected && styles.optionCardSelected]}
          onPress={() => handleOptionSelect(option.id)}
        >
          <Text style={styles.optionText}>{option.text}</Text>
          <View style={[styles.checkIcon]}>
            <View
              style={[
                styles.checkIconContainer,
                {
                  backgroundColor: isSelected
                    ? COLORS.puple.main
                    : COLORS.gray300,
                },
              ]}
            >
              <CheckIcon color={isSelected ? COLORS.white : COLORS.gray100} />
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      // 피드백 화면: 정답/오답에 따라 스타일 변경
      const correct = isCorrect(option.id);
      return (
        <QuizOptionCard key={option.id} option={option} isCorrect={correct} />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header iconColor={COLORS.black} />
      <Spacer num={32} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Q 아이콘과 문제 */}
        <QuizQuestion question={quiz.question} />

        <Spacer num={40} />

        {/* 선택지 */}
        {quiz.options.map((option, index) => {
          return (
            <View key={option.id}>
              {renderOption(option)}
              {index !== quiz.options.length - 1 && <Spacer num={12} />}
            </View>
          );
        })}

        <Spacer num={48} />
      </ScrollView>

      {/* 하단 버튼 */}
      <Button
        title={quizState === 'question' ? '다음' : '완료'}
        onPress={quizState === 'question' ? handleNext : handleComplete}
        variant="primary"
        style={styles.actionButton}
        disabled={quizState === 'question' && !selectedOptionId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(20),
    paddingBottom: scaleWidth(100),
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: scaleWidth(68),
    gap: scaleWidth(20),
    paddingHorizontal: scaleWidth(24),
    borderRadius: BORDER_RADIUS[16],
    backgroundColor: COLORS.gray100,
  },
  optionCardSelected: {
    borderColor: COLORS.puple.main,
    backgroundColor: COLORS.puple[3],
    borderWidth: 1,
  },
  optionCardCorrect: {
    borderColor: COLORS.blue.main,
    backgroundColor: COLORS.blue[3],
    borderWidth: 1,
  },
  optionCardIncorrect: {
    borderColor: COLORS.red.main,
    backgroundColor: COLORS.red[3],
  },
  checkIconContainer: {
    width: scaleWidth(28),
    height: scaleWidth(28),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS[99],
    backgroundColor: COLORS.gray300,
  },
  correctIconContainer: {
    width: scaleWidth(28),
    height: scaleWidth(28),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS[99],
    backgroundColor: COLORS.blue.main,
  },
  incorrectIconContainer: {
    width: scaleWidth(28),
    height: scaleWidth(28),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS[99],
    backgroundColor: COLORS.red.main,
  },
  optionText: {
    ...Body_16M,
    color: COLORS.black,
    flex: 1,
  },
  checkIcon: {
    width: scaleWidth(28),
    height: scaleWidth(28),
    borderRadius: BORDER_RADIUS[99],
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackIcon: {
    width: scaleWidth(24),
    height: scaleWidth(24),
    borderRadius: scaleWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackIconCorrect: {
    backgroundColor: 'blue',
  },
  feedbackIconIncorrect: {
    backgroundColor: 'red',
  },
  circleIcon: {
    width: scaleWidth(12),
    height: scaleWidth(12),
    borderRadius: scaleWidth(6),
    backgroundColor: COLORS.white,
  },
  xIconText: {
    color: COLORS.white,
    fontSize: scaleWidth(16),
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingHorizontal: scaleWidth(20),
    paddingBottom: scaleWidth(20),
    paddingTop: scaleWidth(16),
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  actionButton: {
    marginHorizontal: scaleWidth(20),
  },
  difficultyOptionsContainer: {
    width: '100%',
  },
  difficultyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: scaleWidth(68),
    paddingHorizontal: scaleWidth(32),
    borderRadius: BORDER_RADIUS[16],
    backgroundColor: COLORS.gray100,
  },
  difficultyOptionSelected: {
    borderColor: COLORS.puple.main,
    backgroundColor: COLORS.puple[3],
    borderWidth: 1,
  },
  difficultyOptionText: {
    ...Body_16SB,
    color: COLORS.black,
  },
  difficultyCheckContainer: {
    width: scaleWidth(28),
    height: scaleWidth(28),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS[99],
  },
});

export default QuizScreen;
