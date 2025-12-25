/**
 * 온보딩 관련 서비스
 * 서버 API 연동 시 이 파일을 수정하여 실제 온보딩 로직 구현
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';
const ONBOARDING_STEP_KEY = '@onboarding_step';
const INTERESTS_KEY = '@onboarding_interests';
const DIFFICULTY_KEY = '@onboarding_difficulty';

export type OnboardingStep = 'login' | 'interests' | 'difficulty' | 'completed';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type InterestsData = Record<string, number>;

export interface OnboardingData {
  isCompleted: boolean;
  step: OnboardingStep;
  interests: InterestsData | null;
  difficulty: Difficulty | null;
}

/**
 * 온보딩 상태 조회
 * 나중에 서버 API로 교체 가능
 */
export const getOnboardingStatus = async (): Promise<OnboardingData> => {
  try {
    // TODO: 서버 API로 온보딩 상태 조회
    // 예시:
    // const response = await api.get('/user/onboarding');
    // return {
    //   isCompleted: response.data.isCompleted,
    //   step: response.data.step,
    //   interests: response.data.interests,
    //   difficulty: response.data.difficulty,
    // };

    // 현재는 로컬 스토리지에서 조회
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
 * 나중에 서버 API로 교체 가능
 */
export const completeOnboarding = async (): Promise<void> => {
  try {
    // TODO: 서버 API로 온보딩 완료 저장
    // 예시:
    // await api.post('/user/onboarding/complete');

    // 현재는 로컬 스토리지에 저장
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    await AsyncStorage.setItem(ONBOARDING_STEP_KEY, 'completed');
  } catch (error) {
    console.error('온보딩 완료 저장 실패:', error);
    throw error;
  }
};

/**
 * 온보딩 단계 저장
 * 나중에 서버 API로 교체 가능
 */
export const saveOnboardingStep = async (
  step: OnboardingStep,
): Promise<void> => {
  try {
    // TODO: 서버 API로 온보딩 단계 저장
    // 예시:
    // await api.put('/user/onboarding/step', { step });

    // 현재는 로컬 스토리지에 저장
    await AsyncStorage.setItem(ONBOARDING_STEP_KEY, step);
  } catch (error) {
    console.error('온보딩 단계 저장 실패:', error);
    throw error;
  }
};

/**
 * 관심분야 저장
 * 나중에 서버 API로 교체 가능
 */
export const saveInterests = async (
  interests: InterestsData,
): Promise<void> => {
  try {
    // TODO: 서버 API로 관심분야 저장
    // 예시:
    // await api.put('/user/onboarding/interests', { interests });

    // 현재는 로컬 스토리지에 저장
    await AsyncStorage.setItem(INTERESTS_KEY, JSON.stringify(interests));
  } catch (error) {
    console.error('관심분야 저장 실패:', error);
    throw error;
  }
};

/**
 * 난이도 저장
 * 나중에 서버 API로 교체 가능
 */
export const saveDifficulty = async (difficulty: Difficulty): Promise<void> => {
  try {
    // TODO: 서버 API로 난이도 저장
    // 예시:
    // await api.put('/user/onboarding/difficulty', { difficulty });

    // 현재는 로컬 스토리지에 저장
    await AsyncStorage.setItem(DIFFICULTY_KEY, difficulty);
  } catch (error) {
    console.error('난이도 저장 실패:', error);
    throw error;
  }
};

/**
 * 온보딩 상태 초기화
 * 나중에 서버 API로 교체 가능
 */
export const resetOnboarding = async (): Promise<void> => {
  try {
    // TODO: 서버 API로 온보딩 상태 초기화
    // 예시:
    // await api.delete('/user/onboarding');

    // 현재는 로컬 스토리지에서 삭제
    await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
    await AsyncStorage.removeItem(ONBOARDING_STEP_KEY);
    await AsyncStorage.removeItem(INTERESTS_KEY);
    await AsyncStorage.removeItem(DIFFICULTY_KEY);
  } catch (error) {
    console.error('온보딩 상태 초기화 실패:', error);
    throw error;
  }
};

/**
 * 서버와 온보딩 데이터 동기화 (나중에 구현)
 * 로컬 온보딩 데이터를 서버와 동기화하거나, 서버 데이터를 로컬로 가져옴
 */
export const syncOnboardingWithServer = async (): Promise<OnboardingData> => {
  // TODO: 서버 API 연동 시 구현
  // 예시:
  // try {
  //   const response = await api.get('/user/onboarding');
  //   const serverData = response.data;
  //   // 로컬에도 저장 (오프라인 대비)
  //   await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, serverData.isCompleted ? 'true' : 'false');
  //   await AsyncStorage.setItem(ONBOARDING_STEP_KEY, serverData.step);
  //   if (serverData.interests) {
  //     await AsyncStorage.setItem(INTERESTS_KEY, JSON.stringify(serverData.interests));
  //   }
  //   if (serverData.difficulty) {
  //     await AsyncStorage.setItem(DIFFICULTY_KEY, serverData.difficulty);
  //   }
  //   return serverData;
  // } catch (error) {
  //   console.error('온보딩 동기화 실패:', error);
  //   return await getOnboardingStatus(); // 실패 시 로컬 값 반환
  // }

  // 현재는 로컬 값만 반환
  return await getOnboardingStatus();
};
