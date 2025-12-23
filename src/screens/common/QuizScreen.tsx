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
  Body_16R,
  BORDER_RADIUS,
} from '../../styles/global';
import Header from '../../components/Header';
import Button from '../../components/Button';
import Spacer from '../../components/Spacer';
import { Quiz, QuizOption } from '../../data/mock/quizData';

type QuizScreenProps = {
  quiz: Quiz;
  articleId: number;
};

type QuizState = 'question' | 'feedback';

const QuizScreen: React.FC<QuizScreenProps> = ({ quiz, articleId }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('question');
  const [userAnswerId, setUserAnswerId] = useState<number | null>(null);

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

    // 사용자 답안 저장
    setUserAnswerId(selectedOptionId);
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

  const isUserAnswer = (optionId: number) => {
    return optionId === userAnswerId;
  };

  const renderOption = (option: QuizOption, index: number) => {
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
          <View
            style={[
              styles.checkIcon,
              isSelected
                ? styles.checkIconSelected
                : styles.checkIconUnselected,
            ]}
          >
            {isSelected ? (
              <Text style={styles.checkIconText}>✓</Text>
            ) : (
              <Text style={styles.checkIconTextUnselected}>✓</Text>
            )}
          </View>
        </TouchableOpacity>
      );
    } else {
      // 피드백 화면: 정답/오답에 따라 스타일 변경
      const correct = isCorrect(option.id);
      const userSelected = isUserAnswer(option.id);
      return (
        <View
          key={option.id}
          style={[
            styles.optionCard,
            correct ? styles.optionCardCorrect : styles.optionCardIncorrect,
          ]}
        >
          <Text style={styles.optionText}>{option.text}</Text>
          <View
            style={[
              styles.feedbackIcon,
              correct
                ? styles.feedbackIconCorrect
                : styles.feedbackIconIncorrect,
            ]}
          >
            {correct ? (
              <View style={styles.circleIcon} />
            ) : (
              <Text style={styles.xIconText}>✕</Text>
            )}
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header iconColor={COLORS.black} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Q 아이콘과 문제 */}
        <View style={styles.questionContainer}>
          <View style={styles.qIcon}>
            <Text style={styles.qIconText}>Q</Text>
          </View>
          <Text style={styles.questionText}>{quiz.question}</Text>
        </View>

        <Spacer num={32} />

        {/* 선택지 */}
        {quiz.options.map((option, index) => renderOption(option, index))}

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
  qIcon: {
    width: scaleWidth(48),
    height: scaleWidth(48),
    borderRadius: scaleWidth(24),
    backgroundColor: COLORS.puple.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaleWidth(16),
  },
  qIconText: {
    ...Heading_20EB_Round,
    color: COLORS.white,
    fontSize: scaleWidth(24),
  },
  questionText: {
    ...Heading_20EB_Round,
    color: COLORS.black,
    flex: 1,
    lineHeight: scaleWidth(28),
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaleWidth(20),
    paddingVertical: scaleWidth(20),
    marginBottom: scaleWidth(12),
    borderRadius: BORDER_RADIUS[16],
    backgroundColor: COLORS.gray100,
    borderWidth: 1,
    borderColor: COLORS.gray300,
  },
  optionCardSelected: {
    borderColor: COLORS.puple.main,
    backgroundColor: COLORS.white,
  },
  optionCardCorrect: {
    borderColor: 'blue',
    backgroundColor: COLORS.white,
  },
  optionCardIncorrect: {
    borderColor: 'red',
    backgroundColor: COLORS.white,
  },
  optionText: {
    ...Body_16R,
    color: COLORS.black,
    flex: 1,
    marginRight: scaleWidth(12),
  },
  checkIcon: {
    width: scaleWidth(24),
    height: scaleWidth(24),
    borderRadius: scaleWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIconSelected: {
    backgroundColor: COLORS.puple.main,
  },
  checkIconUnselected: {
    backgroundColor: COLORS.gray300,
  },
  checkIconText: {
    color: COLORS.white,
    fontSize: scaleWidth(16),
    fontWeight: 'bold',
  },
  checkIconTextUnselected: {
    color: COLORS.gray500,
    fontSize: scaleWidth(16),
    fontWeight: 'bold',
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
