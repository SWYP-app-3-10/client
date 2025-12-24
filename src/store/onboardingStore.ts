/**
 * 온보딩 상태 관리 Store
 * onboardingService를 통해 온보딩 데이터를 관리하며,
 * 나중에 서버 API 연동 시 onboardingService만 수정하면 됨
 */

import { create } from 'zustand';
import {
  getOnboardingStatus,
  completeOnboarding as completeOnboardingService,
  saveOnboardingStep as saveOnboardingStepService,
  saveInterests as saveInterestsService,
  saveDifficulty as saveDifficultyService,
  resetOnboarding as resetOnboardingService,
  type OnboardingStep,
  type Difficulty,
  type InterestsData,
} from '../services/onboardingService';

// 타입 재export (외부에서 사용 가능하도록)
export type { OnboardingStep, Difficulty, InterestsData };

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
      await completeOnboardingService();
    console.log('온보딩 완료! 메인 화면으로 전환합니다.');
      set({ isOnboardingCompleted: true, currentStep: 'completed' });
    } catch (error) {
      console.error('온보딩 완료 상태 저장 실패:', error);
    }
  },
  setOnboardingStep: async (step: OnboardingStep) => {
    try {
      await saveOnboardingStepService(step);
      set({ currentStep: step });
    } catch (error) {
      console.error('온보딩 단계 저장 실패:', error);
    }
  },
  setInterests: async (interests: InterestsData) => {
    try {
      await saveInterestsService(interests);
      set({ interests });
    } catch (error) {
      console.error('관심분야 저장 실패:', error);
    }
  },
  setDifficulty: async (difficulty: Difficulty) => {
    try {
      await saveDifficultyService(difficulty);
      set({ difficulty });
    } catch (error) {
      console.error('난이도 저장 실패:', error);
    }
  },
  resetOnboarding: async () => {
    try {
      await resetOnboardingService();
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
      const data = await getOnboardingStatus();
      set({
        isOnboardingCompleted: data.isCompleted,
        currentStep: data.step,
        interests: data.interests,
        difficulty: data.difficulty,
      });
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
