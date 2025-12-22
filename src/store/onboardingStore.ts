import {create} from 'zustand';

interface OnboardingStore {
  isOnboardingCompleted: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingStore>(set => ({
  isOnboardingCompleted: false,
  completeOnboarding: () => {
    console.log('온보딩 완료! 메인 화면으로 전환합니다.');
    set({isOnboardingCompleted: true});
  },
  resetOnboarding: () => set({isOnboardingCompleted: false}),
}));

// 편의 훅: 온보딩 완료 상태만 필요한 경우
export const useIsOnboardingCompleted = () =>
  useOnboardingStore(state => state.isOnboardingCompleted);

// 편의 훅: completeOnboarding만 필요한 경우
export const useCompleteOnboarding = () =>
  useOnboardingStore(state => state.completeOnboarding);
