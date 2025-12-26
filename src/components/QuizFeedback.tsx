import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  COLORS,
  scaleWidth,
  BORDER_RADIUS,
  Caption_14R,
} from '../styles/global';
import Spacer from './Spacer';
import { QuizOption } from '../data/mock/quizData';
import QuizOptionCard from './QuizOptionCard';
import QuizQuestion from './QuizQuestion';

interface QuizFeedbackProps {
  question: string;
  options: QuizOption[];
  correctAnswerId: number;
  selectedAnswerId: number;
  showFeedbackMessage?: boolean;
  containerRef?: React.RefObject<View>;
}

const QuizFeedback: React.FC<QuizFeedbackProps> = ({
  question,
  options,
  correctAnswerId,
  selectedAnswerId,
  showFeedbackMessage = true,
  containerRef,
}) => {
  const isCorrect = selectedAnswerId === correctAnswerId;

  return (
    <View style={styles.quizSection} ref={containerRef}>
      <QuizQuestion question={question} Q_color={COLORS.gray800} />

      {showFeedbackMessage && (
        <>
          <Spacer num={16} />
          {/* 피드백 메시지 */}
          <View
            style={[
              styles.feedbackBox,
              isCorrect
                ? styles.feedbackBoxCorrect
                : styles.feedbackBoxIncorrect,
            ]}
          >
            <Text
              style={[
                styles.feedbackText,
                isCorrect
                  ? styles.feedbackTextCorrect
                  : styles.feedbackTextIncorrect,
              ]}
            >
              {isCorrect ? '정답을 맞혔어요' : '아쉽게 틀렸어요'}
            </Text>
          </View>
        </>
      )}

      <Spacer num={40} />

      {/* 선택지 */}
      {options.map((option: QuizOption, index) => {
        const correct = option.id === correctAnswerId;

        return (
          <View key={option.id}>
            <QuizOptionCard
              key={option.id}
              option={option}
              isCorrect={correct}
            />
            {index !== options.length - 1 && <Spacer num={16} />}
          </View>
        );
      })}

      <Spacer num={40} />
    </View>
  );
};

const styles = StyleSheet.create({
  quizSection: {
    paddingHorizontal: scaleWidth(20),
    backgroundColor: COLORS.white,
  },
  feedbackBox: {
    width: scaleWidth(109),
    height: scaleWidth(31),
    borderRadius: BORDER_RADIUS[30],
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackBoxCorrect: {
    backgroundColor: COLORS.blue[3],
  },
  feedbackBoxIncorrect: {
    backgroundColor: COLORS.red[3],
  },
  feedbackText: {
    ...Caption_14R,
  },
  feedbackTextCorrect: {
    color: COLORS.blue.main,
  },
  feedbackTextIncorrect: {
    color: COLORS.red.main,
  },
});

export default QuizFeedback;
