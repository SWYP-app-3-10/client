import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';
const ONBOARDING_STEP_KEY = '@onboarding_step';
const INTERESTS_KEY = '@onboarding_interests';
const DIFFICULTY_KEY = '@onboarding_difficulty';

export type OnboardingStep = 'login' | 'interests' | 'difficulty' | 'completed';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// 관심분야 선택 데이터: Map<id, 순서(1, 2, 3)>
export type InterestsData = Record<string, number>;

interface OnboardingStore {
  isOnboardingCompleted: boolean;
  currentStep: OnboardingStep;
  interests: InterestsData | null;
  difficulty: Difficulty | null;
  completeOnboarding: () => Promise<void>;
  setOnboardingStep: (step: OnboardingStep) => Promise<void>;
  setInterests: (interests: InterestsData) => Promise<void>;
  setDifficulty: (difficulty: Difficulty) => Promise<void>;
  resetOnboarding: () => Promise<void>;
  loadOnboardingStatus: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingStore>(set => ({
  isOnboardingCompleted: false,
  currentStep: 'login',
  interests: null,
  difficulty: null,
  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      await AsyncStorage.setItem(ONBOARDING_STEP_KEY, 'completed');
      console.log('온보딩 완료! 메인 화면으로 전환합니다.');
      set({ isOnboardingCompleted: true, currentStep: 'completed' });
    } catch (error) {
      console.error('온보딩 완료 상태 저장 실패:', error);
    }
  },
  setOnboardingStep: async (step: OnboardingStep) => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STEP_KEY, step);
      set({ currentStep: step });
    } catch (error) {
      console.error('온보딩 단계 저장 실패:', error);
    }
  },
  setInterests: async (interests: InterestsData) => {
    try {
      await AsyncStorage.setItem(INTERESTS_KEY, JSON.stringify(interests));
      set({ interests });
    } catch (error) {
      console.error('관심분야 저장 실패:', error);
    }
  },
  setDifficulty: async (difficulty: Difficulty) => {
    try {
      await AsyncStorage.setItem(DIFFICULTY_KEY, difficulty);
      set({ difficulty });
    } catch (error) {
      console.error('난이도 저장 실패:', error);
    }
  },
  resetOnboarding: async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
      await AsyncStorage.removeItem(ONBOARDING_STEP_KEY);
      await AsyncStorage.removeItem(INTERESTS_KEY);
      await AsyncStorage.removeItem(DIFFICULTY_KEY);
      set({
        isOnboardingCompleted: false,
        currentStep: 'login',
        interests: null,
        difficulty: null,
      });
    } catch (error) {
      console.error('온보딩 상태 초기화 실패:', error);
    }
  },
  loadOnboardingStatus: async () => {
    try {
      const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      const step = (await AsyncStorage.getItem(
        ONBOARDING_STEP_KEY,
      )) as OnboardingStep | null;
      const interestsStr = await AsyncStorage.getItem(INTERESTS_KEY);
      const difficulty = (await AsyncStorage.getItem(
        DIFFICULTY_KEY,
      )) as Difficulty | null;

      const interests: InterestsData | null = interestsStr
        ? JSON.parse(interestsStr)
        : null;

      if (completed === 'true') {
        set({
          isOnboardingCompleted: true,
          currentStep: 'completed',
          interests,
          difficulty,
        });
      } else if (step) {
        set({
          isOnboardingCompleted: false,
          currentStep: step,
          interests,
          difficulty,
        });
      } else {
        set({
          isOnboardingCompleted: false,
          currentStep: 'login',
          interests: null,
          difficulty: null,
        });
      }
    } catch (error) {
      console.error('온보딩 상태 불러오기 실패:', error);
      set({
        isOnboardingCompleted: false,
        currentStep: 'login',
        interests: null,
        difficulty: null,
      });
    }
  },
}));

// 편의 훅: 온보딩 완료 상태만 필요한 경우
export const useIsOnboardingCompleted = () =>
  useOnboardingStore(state => state.isOnboardingCompleted);

// 편의 훅: completeOnboarding만 필요한 경우
export const useCompleteOnboarding = () =>
  useOnboardingStore(state => state.completeOnboarding);
