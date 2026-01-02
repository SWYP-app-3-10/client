/**
 * 포인트 관련 서비스
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

const EXPERIENCE_KEY = '@user_experience';

/**
 * 로컬 스토리지에서 포인트 조회
 * 나중에 서버 API로 교체 가능
 */
export const getExperience = async (): Promise<number> => {
  try {
    // 서버 API 호출
    const response = await client.get<{ experience: number }>(
      '/user/experience',
    );
    // const serverExperience = response.data.experience;
    // return serverExperience;
  } catch (error) {}
};

/**
 * 포인트 저장
 * 나중에 서버 API로 동기화 가능
 */
export const saveExperience = async (experience: number): Promise<void> => {
  try {
    // 서버 API 호출
    // await client.put('/user/experience', { experience });
    // // 로컬에도 저장 (오프라인 대비)
    // await AsyncStorage.setItem(EXPERIENCE_KEY, experience.toString());
  } catch (error) {}
};

/**
 * 포인트 추가
 * 나중에 서버 API로 교체 가능
 */
export const addExperience = async (amount: number): Promise<number> => {
  try {
    // 서버 API 호출
    // const response = await client.post<{ newExperience: number }>(
    //   '/user/experience/add',
    //   { amount },
    // );
    // const newExperience = response.data.newExperience;
    // return newExperience;
  } catch (error) {}
};

/**
 * 포인트 차감
 * 나중에 서버 API로 교체 가능
 * @returns 차감 성공 여부와 새로운 포인트 값
 */
export const subtractExperience = async (
  amount: number,
): Promise<{ success: boolean; newExperience: number }> => {
  try {
    // 서버 API 호출
    // const response = await client.post<{ newExperience: number }>(
    //   '/user/experience/subtract',
    //   { amount },
    // );
    // const newExperience = response.data.newExperience;
    // return { success: true, newExperience };
  } catch (error: any) {}
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
