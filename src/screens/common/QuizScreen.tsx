import React, { useState } from 'react';
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
  Heading_20EB_Round,
  BORDER_RADIUS,
  Heading_24EB_Round,
  Body_16M,
} from '../../styles/global';
import Header from '../../components/Header';
import Button from '../../components/Button';
import Spacer from '../../components/Spacer';
import { Quiz, QuizOption } from '../../data/mock/quizData';
import {
  CheckIcon,
  CircleIcon,
  CloseIcon,
} from '../../icons/commonIcons/commonIcons';

type QuizScreenProps = {
  quiz: Quiz;
  articleId: number;
};

type QuizState = 'question' | 'feedback';

const QuizScreen: React.FC<QuizScreenProps> = ({ quiz, articleId }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('question');

  const handleOptionSelect = (optionId: number) => {
    if (quizState === 'question') {
      setSelectedOptionId(optionId);
    }
  };

  const handleNext = async () => {
    if (!selectedOptionId) return;

    // TODO: 서버로 답안 전송
    // 예시: await submitQuizAnswer(articleId, quiz.id, selectedOptionId);
    console.log('퀴즈 답안 전송:', {
      articleId,
      quizId: quiz.id,
      answerId: selectedOptionId,
    });

    // 피드백 화면으로 전환
    setQuizState('feedback');
  };

  const handleComplete = () => {
    // TODO: 난이도 모달 표시 (아직 구현하지 않음)
    console.log('퀴즈 완료 - 난이도 모달 표시 예정');
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
        <View
          key={option.id}
          style={[
            styles.optionCard,
            correct ? styles.optionCardCorrect : styles.optionCardIncorrect,
          ]}
        >
          <Text style={styles.optionText}>{option.text}</Text>

          {correct ? (
            <View style={styles.correctIconContainer}>
              <CircleIcon />
            </View>
          ) : (
            <View style={styles.incorrectIconContainer}>
              <CloseIcon color={COLORS.white} />
            </View>
          )}
        </View>
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
        <Text style={styles.qIconText}>Q</Text>
        <Text style={styles.questionText}>{quiz.question}</Text>

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
      <View style={styles.buttonContainer}>
        <Button
          title={quizState === 'question' ? '다음' : '완료'}
          onPress={quizState === 'question' ? handleNext : handleComplete}
          variant="primary"
          style={styles.actionButton}
          disabled={quizState === 'question' && !selectedOptionId}
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
  qIconText: {
    ...Heading_24EB_Round,
    color: COLORS.puple[5],
    marginBottom: scaleWidth(4),
  },
  questionText: {
    ...Heading_20EB_Round,
    color: COLORS.black,
    flex: 1,
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
    width: '100%',
  },
});

export default QuizScreen;
