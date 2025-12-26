import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  COLORS,
  scaleWidth,
  Body_16M,
  Body_18M,
  Heading_18B,
} from '../styles/global';
import { CheckIcon } from '../icons';
import { Difficulty } from '../store/onboardingStore';

interface LevelOption {
  value: Difficulty;
  label: string;
  description: string;
  time: string;
}

interface LevelSelectionContentProps {
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

const LevelSelectionContent: React.FC<LevelSelectionContentProps> = ({
  selectedLevel,
  onSelect,
}) => {
  const handleSelect = (level: Difficulty) => {
    onSelect(level);
  };

  return (
    <View style={styles.optionsContainer}>
      {LEVEL_OPTIONS.map(option => {
        const isSelected = selectedLevel === option.value;
        return (
          <React.Fragment key={option.value}>
            <TouchableOpacity
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => handleSelect(option.value)}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionDetails}>
                  <View style={styles.optionLabelContainer}>
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.optionSelectedLabel,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {isSelected && <CheckIcon color={COLORS.puple.main} />}
                  </View>
                  <View style={styles.optionDetailsContainer}>
                    <View style={[styles.detailItem]}>
                      <View style={styles.detailItemIcon} />
                      <Text
                        style={[
                          styles.detailText,
                          isSelected && styles.detailTextSelected,
                        ]}
                      >
                        {option.description}
                      </Text>
                    </View>
                    <View style={[styles.detailItem]}>
                      <View style={styles.detailItemIcon} />
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
              </View>
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    width: '100%',
  },
  option: {
    paddingVertical: scaleWidth(16.5),
  },
  optionSelected: {
    backgroundColor: COLORS.puple[3],
  },
  optionContent: {
    flexDirection: 'row',
  },
  optionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(12),
  },
  optionLabel: {
    ...Body_18M,
    color: COLORS.black,
  },
  optionSelectedLabel: {
    ...Heading_18B,
    color: COLORS.puple.main,
  },
  optionDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: scaleWidth(165),
  },
  detailItemIcon: {
    backgroundColor: COLORS.placeholder,
    width: scaleWidth(26),
    height: scaleWidth(26),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(10),
  },
  detailText: {
    ...Body_16M,
    color: COLORS.black,
  },
  detailTextSelected: {
    color: COLORS.black,
  },
});

export default LevelSelectionContent;
