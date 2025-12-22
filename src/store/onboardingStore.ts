import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';
const ONBOARDING_STEP_KEY = '@onboarding_step';

export type OnboardingStep = 'login' | 'interests' | 'difficulty' | 'completed';

interface OnboardingStore {
  isOnboardingCompleted: boolean;
  currentStep: OnboardingStep;
  completeOnboarding: () => Promise<void>;
  setOnboardingStep: (step: OnboardingStep) => Promise<void>;
  resetOnboarding: () => Promise<void>;
  loadOnboardingStatus: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingStore>(set => ({
  isOnboardingCompleted: false,
  currentStep: 'login',
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
  resetOnboarding: async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
      await AsyncStorage.removeItem(ONBOARDING_STEP_KEY);
      set({ isOnboardingCompleted: false, currentStep: 'login' });
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

      if (completed === 'true') {
        set({ isOnboardingCompleted: true, currentStep: 'completed' });
      } else if (step) {
        set({ isOnboardingCompleted: false, currentStep: step });
      } else {
        set({ isOnboardingCompleted: false, currentStep: 'login' });
      }
    } catch (error) {
      console.error('온보딩 상태 불러오기 실패:', error);
      set({ isOnboardingCompleted: false, currentStep: 'login' });
    }
  },
}));

// 편의 훅: 온보딩 완료 상태만 필요한 경우
export const useIsOnboardingCompleted = () =>
  useOnboardingStore(state => state.isOnboardingCompleted);

// 편의 훅: completeOnboarding만 필요한 경우
export const useCompleteOnboarding = () =>
  useOnboardingStore(state => state.completeOnboarding);
