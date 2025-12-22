import React, {useState, useCallback, useMemo} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteNames} from '../../../routes';
import {
  Body_16M,
  COLORS,
  Heading_24EB_Round,
  scaleWidth,
} from '../../styles/global';
import {OnboardingStackParamList} from '../../navigation/types';
import Spacer from '../../components/Spacer';
import ProgressBar from '../../components/ProgressBar';
import {Button} from '../../components';
import {BORDER_RADIUS} from '../../styles/global';
import {
  CheckIcon,
  FirstIcon,
  SecondIcon,
  ThirdIcon,
} from '../../icons/commonIcons/commonIcons';
import {Body_15M, Body_18M, Heading_18SB} from '../../styles/typography';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

interface Interest {
  id: string;
  name: string;
}

const INTERESTS: Interest[] = [
  {id: 'politics', name: '정치'},
  {id: 'economy', name: '경제'},
  {id: 'society', name: '사회'},
  {id: 'lifestyle', name: '생활/문화'},
  {id: 'it', name: 'IT/과학'},
  {id: 'world', name: '세계'},
];

const FIRST_ROW_INTERESTS = INTERESTS.slice(0, 3);
const SECOND_ROW_INTERESTS = INTERESTS.slice(3, 6);

interface InterestTagProps {
  interest: Interest;
  priority: number | null;
  isSelected: boolean;
  onPress: (id: string) => void;
  isFirstRow?: boolean;
}

const InterestTag: React.FC<InterestTagProps> = ({
  interest,
  priority,
  isSelected,
  onPress,
  isFirstRow = false,
}) => {
  const renderPriorityIcon = () => {
    if (priority === null) {
      return null;
    }
    if (priority === 1) {
      return <FirstIcon />;
    }
    if (priority === 2) {
      return <SecondIcon />;
    }
    return <ThirdIcon />;
  };

  return (
    <View
      style={isFirstRow ? styles.tagContainerFirstRow : styles.tagContainer}>
      {isSelected && <View style={styles.tagSpacer} />}
      {priority !== null && (
        <View style={styles.priorityBadge}>{renderPriorityIcon()}</View>
      )}
      <Button
        variant="ghost"
        textStyle={styles.tagText}
        style={[styles.tag, isSelected && styles.tagSelected]}
        onPress={() => onPress(interest.id)}>
        <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
          {interest.name}
        </Text>
        {isSelected && <CheckIcon />}
      </Button>
    </View>
  );
};

const InterestsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  // 선택 순서를 저장: Map<id, 순서(1, 2, ...)>
  const [selectedInterests, setSelectedInterests] = useState<
    Map<string, number>
  >(new Map());

  const toggleInterest = useCallback((id: string) => {
    setSelectedInterests(prev => {
      const newSelected = new Map(prev);
      if (newSelected.has(id)) {
        // 이미 선택된 경우 제거하고 순서 재정렬
        const removedOrder = newSelected.get(id)!;
        newSelected.delete(id);
        // 제거된 순서보다 큰 순서들을 1씩 감소
        newSelected.forEach((order, key) => {
          if (order > removedOrder) {
            newSelected.set(key, order - 1);
          }
        });
      } else {
        // 최대 3개까지 선택 가능
        if (newSelected.size < 3) {
          const nextOrder = newSelected.size + 1;
          newSelected.set(id, nextOrder);
        }
      }
      return newSelected;
    });
  }, []);

  const getPriority = useCallback(
    (id: string): number | null => {
      return selectedInterests.get(id) || null;
    },
    [selectedInterests],
  );

  const handleNext = useCallback(() => {
    navigation.navigate(RouteNames.DIFFICULTY_SETTING);
  }, [navigation]);

  const isNextButtonActive = useMemo(
    () => selectedInterests.size >= 2,
    [selectedInterests.size],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Spacer num={24} />
        <ProgressBar fill={1} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Spacer num={92} />
        <Text style={styles.title}>관심분야를 선택해주세요</Text>
        <Spacer num={4} />
        <Text style={[Body_15M, {color: COLORS.gray600}]}>
          미션 화면에서 나의 관심분야 글을 확인할 수 있어요
        </Text>
        <Spacer num={52} />
        {/* 모든 관심분야 */}
        <View style={styles.tagsWrapper}>
          {/* 첫 번째 줄: 정치, 경제, 사회 */}
          <View style={styles.tagsRow}>
            {FIRST_ROW_INTERESTS.map(interest => (
              <InterestTag
                key={interest.id}
                interest={interest}
                priority={getPriority(interest.id)}
                isSelected={getPriority(interest.id) !== null}
                onPress={toggleInterest}
                isFirstRow
              />
            ))}
          </View>
          {/* 두 번째 줄: 생활/문화, IT/과학, 세계 */}
          <View style={styles.tagsRow}>
            {SECOND_ROW_INTERESTS.map(interest => (
              <InterestTag
                key={interest.id}
                interest={interest}
                priority={getPriority(interest.id)}
                isSelected={getPriority(interest.id) !== null}
                onPress={toggleInterest}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="primary"
          title="다음"
          onPress={handleNext}
          disabled={!isNextButtonActive}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(12),
  },
  content: {
    flex: 1,
    paddingHorizontal: scaleWidth(20),
  },
  title: {
    ...Heading_24EB_Round,
    color: COLORS.black,
  },
  subtitle: {
    ...Body_16M,
    color: COLORS.gray600,
  },
  tagsWrapper: {
    gap: scaleWidth(8),
  },
  tagsRow: {
    flexDirection: 'row',
    gap: scaleWidth(12),
  },
  tagContainer: {
    justifyContent: 'flex-end',
    position: 'relative',
  },
  tagContainerFirstRow: {
    justifyContent: 'flex-end',
    position: 'relative',
  },
  tagSpacer: {
    height: scaleWidth(50),
  },
  tag: {
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleWidth(8),
    height: scaleWidth(43),
    borderRadius: BORDER_RADIUS[30],
    backgroundColor: COLORS.puple[3],
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagSelected: {
    backgroundColor: COLORS.puple.main,
    gap: scaleWidth(10),
  },
  priorityBadge: {
    position: 'absolute',
    top: scaleWidth(0),
    alignSelf: 'center',
  },
  tagText: {
    ...Body_18M,
    color: COLORS.puple.main,
  },
  tagTextSelected: {
    ...Heading_18SB,
    color: COLORS.white,
  },
  footer: {
    paddingHorizontal: scaleWidth(20),
  },
});

export default InterestsScreen;
