import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteNames} from '../../../routes';
import {scaleWidth} from '../../styles/global';

type OnboardingStackParamList = {
  [RouteNames.SOCIAL_LOGIN]: undefined;
  [RouteNames.FEATURE_INTRO_01]: undefined;
  [RouteNames.FEATURE_INTRO_02]: undefined;
  [RouteNames.FEATURE_INTRO_03]: undefined;
  [RouteNames.INTERESTS]: undefined;
  [RouteNames.DIFFICULTY_SETTING]: undefined;
};

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

interface Interest {
  id: string;
  name: string;
  priority: 1 | 2 | 3;
}

const INTERESTS: Interest[] = [
  {id: 'politics', name: '정치', priority: 1},
  {id: 'economy', name: '경제', priority: 1},
  {id: 'lifestyle', name: '생활/문화', priority: 2},
  {id: 'it', name: 'IT/과학', priority: 2},
  {id: 'society', name: '사회', priority: 3},
  {id: 'world', name: '세계', priority: 3},
];

const InterestsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(
    new Set(['politics', 'it', 'world']),
  );

  const toggleInterest = (id: string) => {
    const newSelected = new Set(selectedInterests);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      // 같은 우선순위의 다른 항목이 이미 선택되어 있는지 확인
      const interest = INTERESTS.find(i => i.id === id);
      if (interest) {
        const samePrioritySelected = INTERESTS.find(
          i => i.priority === interest.priority && newSelected.has(i.id),
        );
        if (samePrioritySelected) {
          newSelected.delete(samePrioritySelected.id);
        }
        newSelected.add(id);
      }
    }
    setSelectedInterests(newSelected);
  };

  const handleNext = () => {
    navigation.navigate(RouteNames.DIFFICULTY_SETTING);
  };

  const getInterestsByPriority = (priority: 1 | 2 | 3) => {
    return INTERESTS.filter(i => i.priority === priority);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {width: '50%'}]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>관심분야를 선택해주세요</Text>
        <Text style={styles.subtitle}>
          화면에서 나의 관심분야 글을 확인할 수 있어요
        </Text>

        {/* 1순위 */}
        <View style={styles.prioritySection}>
          <Text style={styles.priorityLabel}>1순위</Text>
          <View style={styles.tagsContainer}>
            {getInterestsByPriority(1).map(interest => (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.tag,
                  selectedInterests.has(interest.id) && styles.tagSelected,
                ]}
                onPress={() => toggleInterest(interest.id)}>
                <Text
                  style={[
                    styles.tagText,
                    selectedInterests.has(interest.id) &&
                      styles.tagTextSelected,
                  ]}>
                  {interest.name}
                </Text>
                {selectedInterests.has(interest.id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 2순위 */}
        <View style={styles.prioritySection}>
          <Text style={styles.priorityLabel}>2순위</Text>
          <View style={styles.tagsContainer}>
            {getInterestsByPriority(2).map(interest => (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.tag,
                  selectedInterests.has(interest.id) && styles.tagSelected,
                ]}
                onPress={() => toggleInterest(interest.id)}>
                <Text
                  style={[
                    styles.tagText,
                    selectedInterests.has(interest.id) &&
                      styles.tagTextSelected,
                  ]}>
                  {interest.name}
                </Text>
                {selectedInterests.has(interest.id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3순위 */}
        <View style={styles.prioritySection}>
          <Text style={styles.priorityLabel}>3순위</Text>
          <View style={styles.tagsContainer}>
            {getInterestsByPriority(3).map(interest => (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.tag,
                  selectedInterests.has(interest.id) && styles.tagSelected,
                ]}
                onPress={() => toggleInterest(interest.id)}>
                <Text
                  style={[
                    styles.tagText,
                    selectedInterests.has(interest.id) &&
                      styles.tagTextSelected,
                  ]}>
                  {interest.name}
                </Text>
                {selectedInterests.has(interest.id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          disabled={selectedInterests.size === 0}>
          <Text
            style={[
              styles.nextButtonText,
              selectedInterests.size === 0 && styles.nextButtonTextDisabled,
            ]}>
            다음
          </Text>
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
  prioritySection: {
    marginBottom: scaleWidth(32),
  },
  priorityLabel: {
    fontSize: scaleWidth(16),
    fontWeight: '600',
    color: '#000000',
    marginBottom: scaleWidth(12),
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaleWidth(8),
  },
  tag: {
    paddingHorizontal: scaleWidth(16),
    paddingVertical: scaleWidth(10),
    borderRadius: scaleWidth(20),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(6),
  },
  tagSelected: {
    backgroundColor: '#9B59B6',
    borderColor: '#9B59B6',
  },
  tagText: {
    fontSize: scaleWidth(14),
    color: '#666666',
  },
  tagTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: scaleWidth(12),
    color: '#FFFFFF',
    fontWeight: '700',
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
  nextButtonTextDisabled: {
    color: '#999999',
  },
});

export default InterestsScreen;
