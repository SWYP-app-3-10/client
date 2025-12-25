/**
 * 포인트 관련 서비스
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';
import { USE_MOCK_DATA } from '../config/apiConfig';

const EXPERIENCE_KEY = '@user_experience';

/**
 * 로컬 스토리지에서 포인트 조회
 * 나중에 서버 API로 교체 가능
 */
export const getExperience = async (): Promise<number> => {
  // 더미 데이터 사용 모드에서는 로컬 스토리지에서 바로 조회
  if (USE_MOCK_DATA) {
    const stored = await AsyncStorage.getItem(EXPERIENCE_KEY);
    if (stored) {
      return parseInt(stored, 10) || 0;
    }
    // 초기값 설정 (테스트용 90포인트)
    await AsyncStorage.setItem(EXPERIENCE_KEY, '0');
    return 0;
  }

  try {
    // 서버 API 호출
    const response = await client.get<{ experience: number }>(
      '/user/experience',
    );
    const serverExperience = response.data.experience;
    // 로컬에도 저장 (오프라인 대비)
    await AsyncStorage.setItem(EXPERIENCE_KEY, serverExperience.toString());
    return serverExperience;
  } catch (error) {
    console.error('경험치 조회 실패, 로컬 데이터 사용:', error);
    // 서버 연결 실패 시 로컬 값 반환
    const stored = await AsyncStorage.getItem(EXPERIENCE_KEY);
    if (stored) {
      return parseInt(stored, 10) || 0;
    }
    // 초기값 설정
    await AsyncStorage.setItem(EXPERIENCE_KEY, '0');
    return 0;
  }
};

/**
 * 포인트 저장
 * 나중에 서버 API로 동기화 가능
 */
export const saveExperience = async (experience: number): Promise<void> => {
  // 더미 데이터 사용 모드에서는 로컬에만 저장
  if (USE_MOCK_DATA) {
    await AsyncStorage.setItem(EXPERIENCE_KEY, experience.toString());
    return;
  }

  try {
    // 서버 API 호출
    await client.put('/user/experience', { experience });
    // 로컬에도 저장 (오프라인 대비)
    await AsyncStorage.setItem(EXPERIENCE_KEY, experience.toString());
  } catch (error) {
    console.error('경험치 저장 실패, 로컬에만 저장:', error);
    // 서버 연결 실패 시 로컬에만 저장
    await AsyncStorage.setItem(EXPERIENCE_KEY, experience.toString());
  }
};

/**
 * 포인트 추가
 * 나중에 서버 API로 교체 가능
 */
export const addExperience = async (amount: number): Promise<number> => {
  // 더미 데이터 사용 모드에서는 로컬에서 바로 처리
  if (USE_MOCK_DATA) {
    const currentExperience = await getExperience();
    const newExperience = currentExperience + amount;
    await AsyncStorage.setItem(EXPERIENCE_KEY, newExperience.toString());
    return newExperience;
  }

  try {
    // 서버 API 호출
    const response = await client.post<{ newExperience: number }>(
      '/user/experience/add',
      { amount },
    );
    const newExperience = response.data.newExperience;
    // 로컬에도 저장 (오프라인 대비)
    await AsyncStorage.setItem(EXPERIENCE_KEY, newExperience.toString());
    return newExperience;
  } catch (error) {
    console.error('경험치 추가 실패, 로컬에서 처리:', error);
    // 서버 연결 실패 시 로컬에서 처리
    const currentExperience = await getExperience();
    const newExperience = currentExperience + amount;
    await AsyncStorage.setItem(EXPERIENCE_KEY, newExperience.toString());
    return newExperience;
  }
};

/**
 * 포인트 차감
 * 나중에 서버 API로 교체 가능
 * @returns 차감 성공 여부와 새로운 포인트 값
 */
export const subtractExperience = async (
  amount: number,
): Promise<{ success: boolean; newExperience: number }> => {
  // 더미 데이터 사용 모드에서는 로컬에서 바로 처리
  if (USE_MOCK_DATA) {
    const currentExperience = await getExperience();
    if (currentExperience < amount) {
      return { success: false, newExperience: currentExperience };
    }
    const newExperience = currentExperience - amount;
    await AsyncStorage.setItem(EXPERIENCE_KEY, newExperience.toString());
    return { success: true, newExperience };
  }

  try {
    // 서버 API 호출
    const response = await client.post<{ newExperience: number }>(
      '/user/experience/subtract',
      { amount },
    );
    const newExperience = response.data.newExperience;
    // 로컬에도 저장 (오프라인 대비)
    await AsyncStorage.setItem(EXPERIENCE_KEY, newExperience.toString());
    return { success: true, newExperience };
  } catch (error: any) {
    console.error('경험치 차감 실패, 로컬에서 처리:', error);
    // 400 에러는 포인트 부족
    if (error.response?.status === 400) {
      const currentExperience = await getExperience();
      return { success: false, newExperience: currentExperience };
    }
    // 서버 연결 실패 시 로컬에서 처리
    const currentExperience = await getExperience();
    if (currentExperience < amount) {
      return { success: false, newExperience: currentExperience };
    }
    const newExperience = currentExperience - amount;
    await AsyncStorage.setItem(EXPERIENCE_KEY, newExperience.toString());
    return { success: true, newExperience };
  }
};

/**
 * 서버와 포인트 동기화 (나중에 구현)
 * 로컬 경험치를 서버와 동기화하거나, 서버 경험치를 로컬로 가져옴
 */
export const syncExperienceWithServer = async (): Promise<number> => {
  // TODO: 서버 API 연동 시 구현
  // 예시:
  // try {
  //   const response = await api.get('/user/experience');
  //   const serverPoints = response.data.points;
  //   await saveExperience(serverExperience);
  //   return serverExperience;
  // } catch (error) {
  //   console.error('경험치 동기화 실패:', error);
  //   return await getExperience(); // 실패 시 로컬 값 반환
  // }

  // 현재는 로컬 값만 반환
  return await getExperience();
};
