import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, scaleWidth, BORDER_RADIUS, Body_16M } from '../styles/global';
import { QuizOption } from '../data/mock/quizData';
import { CircleIcon, CloseIcon } from '../icons/commonIcons/commonIcons';

interface QuizOptionCardProps {
  option: QuizOption;
  isCorrect: boolean;
}

const QuizOptionCard: React.FC<QuizOptionCardProps> = ({
  option,
  isCorrect,
}) => {
  return (
    <View
      style={[
        styles.optionCard,
        isCorrect ? styles.optionCardCorrect : styles.optionCardIncorrect,
      ]}
    >
      <Text style={styles.optionText}>{option.text}</Text>

      {isCorrect ? (
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
};

const styles = StyleSheet.create({
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
  optionCardCorrect: {
    borderColor: COLORS.blue.main,
    backgroundColor: COLORS.blue[3],
    borderWidth: 1,
  },
  optionCardIncorrect: {
    borderColor: COLORS.red.main,
    backgroundColor: COLORS.red[3],
  },
  optionText: {
    ...Body_16M,
    color: COLORS.black,
    flex: 1,
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
});

export default QuizOptionCard;
