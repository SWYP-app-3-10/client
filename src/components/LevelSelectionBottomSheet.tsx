import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  COLORS,
  scaleWidth,
  BORDER_RADIUS,
  Body_16M,
  Caption_14R,
} from '../styles/global';
import { CheckIcon } from '../icons';
import { Difficulty } from '../store/onboardingStore';
import BottomSheetModal from './BottomSheetModal';

interface LevelOption {
  value: Difficulty;
  label: string;
  description: string;
  time: string;
}

interface LevelSelectionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedLevel: Difficulty | null;
  onSelect: (level: Difficulty) => void;
}

const LEVEL_OPTIONS: LevelOption[] = [
  {
    value: 'beginner',
    label: '초급',
    description: '유지',
    time: '1분',
  },
  {
    value: 'intermediate',
    label: '중급',
    description: '2배 증가',
    time: '2분',
  },
  {
    value: 'advanced',
    label: '고급',
    description: '4배 증가',
    time: '4분',
  },
];

const LevelSelectionBottomSheet: React.FC<LevelSelectionBottomSheetProps> = ({
  visible,
  onClose,
  selectedLevel,
  onSelect,
}) => {
  const handleSelect = (level: Difficulty) => {
    onSelect(level);
    onClose();
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose}>
      <View style={styles.optionsContainer}>
        {LEVEL_OPTIONS.map((option, index) => {
          const isSelected = selectedLevel === option.value;
          return (
            <React.Fragment key={option.value}>
              <TouchableOpacity
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => handleSelect(option.value)}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionLeft}>
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.optionSelectedLabel,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <View style={styles.optionDetails}>
                      <View
                        style={[
                          styles.detailItem,
                          isSelected && styles.detailItemSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.detailText,
                            isSelected && styles.detailTextSelected,
                          ]}
                        >
                          {option.description}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.detailItem,
                          isSelected && styles.detailItemSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.detailText,
                            isSelected && styles.detailTextSelected,
                          ]}
                        >
                          {option.time}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {isSelected && (
                    <View style={styles.checkIconContainer}>
                      <CheckIcon color={COLORS.white} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              {index < LEVEL_OPTIONS.length - 1 && (
                <View style={styles.separator} />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    width: '100%',
  },
  option: {
    paddingVertical: scaleWidth(16),
    paddingHorizontal: scaleWidth(20),
    borderRadius: BORDER_RADIUS[16],
    backgroundColor: COLORS.gray100,
  },
  optionSelected: {
    backgroundColor: COLORS.puple.main,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flex: 1,
  },
  optionLabel: {
    ...Body_16M,
    color: COLORS.black,
    marginBottom: scaleWidth(8),
  },
  optionSelectedLabel: {
    color: COLORS.white,
  },
  optionDetails: {
    flexDirection: 'row',
    gap: scaleWidth(8),
  },
  detailItem: {
    paddingHorizontal: scaleWidth(8),
    paddingVertical: scaleWidth(4),
    borderRadius: BORDER_RADIUS[8],
    backgroundColor: COLORS.gray200,
  },
  detailItemSelected: {
    backgroundColor: COLORS.puple[5],
  },
  detailText: {
    ...Caption_14R,
    color: COLORS.gray700,
  },
  detailTextSelected: {
    color: COLORS.white,
  },
  checkIconContainer: {
    width: scaleWidth(24),
    height: scaleWidth(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: scaleWidth(12),
  },
});

export default LevelSelectionBottomSheet;
