/**
 * 온보딩 관련 서비스
 * 서버 API 연동 시 이 파일을 수정하여 실제 온보딩 로직 구현
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { LevelCategory } from '../types/interests';
import { getAuthToken } from './authService';

const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';
const ONBOARDING_STEP_KEY = '@onboarding_step';
const INTERESTS_KEY = '@onboarding_interests';
const DIFFICULTY_KEY = '@onboarding_difficulty';

export type OnboardingStep = 'login' | 'interests' | 'difficulty' | 'completed';
export type InterestsData = Record<string, number>;

export interface OnboardingData {
  isCompleted: boolean;
  step: OnboardingStep;
  interests: InterestsData | null;
  difficulty: LevelCategory | null;
}

/**
 * 온보딩 상태 조회
 */
export const getOnboardingStatus = async (): Promise<OnboardingData> => {
  try {
    // 토큰이 있으면 자동으로 온보딩 완료 상태로 간주
    const token = await getAuthToken();
    if (token) {
      // 토큰이 있으면 온보딩 완료 상태로 설정 (로컬 저장소에도 반영)
      const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      if (completed !== 'true') {
        await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
        await AsyncStorage.setItem(ONBOARDING_STEP_KEY, 'completed');
      }

      const interestsStr = await AsyncStorage.getItem(INTERESTS_KEY);
      const difficultyStr = await AsyncStorage.getItem(DIFFICULTY_KEY);
      const difficulty: LevelCategory | null = difficultyStr
        ? (JSON.parse(difficultyStr) as LevelCategory)
        : null;

      const interests: InterestsData | null = interestsStr
        ? JSON.parse(interestsStr)
        : null;

      return {
        isCompleted: true,
        step: 'completed',
        interests,
        difficulty,
      };
    }

    // 토큰이 없으면 기존 로직대로 진행
    const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
    const step = (await AsyncStorage.getItem(
      ONBOARDING_STEP_KEY,
    )) as OnboardingStep | null;
    const interestsStr = await AsyncStorage.getItem(INTERESTS_KEY);
    const difficultyStr = await AsyncStorage.getItem(DIFFICULTY_KEY);
    const difficulty: LevelCategory | null = difficultyStr
      ? (JSON.parse(difficultyStr) as LevelCategory)
      : null;

    const interests: InterestsData | null = interestsStr
      ? JSON.parse(interestsStr)
      : null;

    if (completed === 'true') {
      return {
        isCompleted: true,
        step: 'completed',
        interests,
        difficulty,
      };
    } else if (step) {
      return {
        isCompleted: false,
        step,
        interests,
        difficulty,
      };
    } else {
      return {
        isCompleted: false,
        step: 'login',
        interests: null,
        difficulty: null,
      };
    }
  } catch (error) {
    console.error('온보딩 상태 조회 실패:', error);
    return {
      isCompleted: false,
      step: 'login',
      interests: null,
      difficulty: null,
    };
  }
};

/**
 * 온보딩 완료 처리
 */
export const completeOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    await AsyncStorage.setItem(ONBOARDING_STEP_KEY, 'completed');
  } catch (error) {
    console.error('온보딩 완료 저장 실패:', error);
    throw error;
  }
};

/**
 * 온보딩 단계 저장
 */
export const saveOnboardingStep = async (
  step: OnboardingStep,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_STEP_KEY, step);
  } catch (error) {
    console.error('온보딩 단계 저장 실패:', error);
    throw error;
  }
};

/**
 * 관심분야 저장
 */
export const saveInterests = async (
  interests: InterestsData,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(INTERESTS_KEY, JSON.stringify(interests));
  } catch (error) {
    console.error('관심분야 저장 실패:', error);
    throw error;
  }
};

/**
 * 난이도 저장
 */
export const saveDifficulty = async (
  difficulty: LevelCategory,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(DIFFICULTY_KEY, JSON.stringify(difficulty));
  } catch (error) {
    console.error('난이도 저장 실패:', error);
    throw error;
  }
};

/**
 * 온보딩 상태 초기화
 */
export const resetOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
    await AsyncStorage.removeItem(ONBOARDING_STEP_KEY);
    await AsyncStorage.removeItem(INTERESTS_KEY);
    await AsyncStorage.removeItem(DIFFICULTY_KEY);
  } catch (error) {
    console.error('온보딩 상태 초기화 실패:', error);
    throw error;
  }
};
