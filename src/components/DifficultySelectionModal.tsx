import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, scaleWidth, BORDER_RADIUS, Body_16M } from '../styles/global';
import { CheckIcon } from '../icons/commonIcons/commonIcons';
import Spacer from './Spacer';

export type Difficulty = 'easy' | 'normal' | 'hard';

interface DifficultySelectionModalProps {
  initialDifficulty?: Difficulty | null;
  onSelect: (difficulty: Difficulty) => void;
}

const DifficultySelectionModal: React.FC<DifficultySelectionModalProps> = ({
  initialDifficulty = null,
  onSelect,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(initialDifficulty);

  useEffect(() => {
    setSelectedDifficulty(initialDifficulty);
  }, [initialDifficulty]);

  const handleSelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    onSelect(difficulty);
  };
  const difficultyOptions: { value: Difficulty; label: string }[] = [
    { value: 'easy', label: '쉬움' },
    { value: 'normal', label: '보통' },
    { value: 'hard', label: '어려움' },
  ];

  return (
    <View style={styles.container}>
      <Spacer num={24} />
      {difficultyOptions.map((option, index) => {
        const isSelected = selectedDifficulty === option.value;
        return (
          <View key={option.value}>
            <TouchableOpacity
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => handleSelect(option.value)}
            >
              <Text style={styles.optionText}>{option.label}</Text>
              <View
                style={[
                  styles.checkContainer,
                  {
                    backgroundColor: isSelected
                      ? COLORS.puple.main
                      : COLORS.gray300,
                  },
                ]}
              >
                <CheckIcon color={isSelected ? COLORS.white : COLORS.gray500} />
              </View>
            </TouchableOpacity>
            {index < difficultyOptions.length - 1 && <Spacer num={12} />}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: scaleWidth(68),
    paddingHorizontal: scaleWidth(24),
    borderRadius: BORDER_RADIUS[16],
    backgroundColor: COLORS.gray100,
  },
  optionSelected: {
    borderColor: COLORS.puple.main,
    backgroundColor: COLORS.puple[3],
    borderWidth: 1,
  },
  optionText: {
    ...Body_16M,
    color: COLORS.black,
  },
  checkContainer: {
    width: scaleWidth(28),
    height: scaleWidth(28),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS[99],
  },
});

export default DifficultySelectionModal;
