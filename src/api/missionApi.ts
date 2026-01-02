/**
 * 미션 관련 API 함수
 */

import client from './client';
import { USE_MOCK_DATA } from '../config/apiConfig';
import {
  Mission,
  Article,
  mockMissions,
  mockArticles,
} from '../data/mock/missionData';
import { getUserInfo } from '../services/authService';

// API 응답 시뮬레이션을 위한 딜레이 함수 (개발용)
const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), ms));

/**
 * 오늘의 미션 목록 조회
 * @returns Promise<Mission[]>
 */
export const fetchMissions = async (): Promise<Mission[]> => {
  // 서버 API 호출 시도
  try {
    const userInfo = await getUserInfo();
    if (!userInfo) {
      throw new Error('사용자 정보가 없습니다');
    }

    const response = await client.get<Mission[]>(
      `/api/content/today/userId=${userInfo.userId}`,
    );
    return response.data;
  } catch (error) {
    console.error('미션 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 아티클 목록 조회
 * @returns Promise<Article[]>
 */
export const fetchArticles = async (): Promise<Article[]> => {
  // 더미 데이터 사용 모드이거나 서버 연결 실패 시 더미 데이터 반환
  if (USE_MOCK_DATA) {
    await delay(200);
    return mockArticles;
  }

  // 서버 API 호출 (현재는 더미 데이터만 사용)
  await delay(200);
  return mockArticles;

  // try {
  //   // 서버 API 호출
  //   const response = await client.get<Article[]>('/articles');
  //   return response.data;
  // } catch (error) {
  //   console.error('기사 목록 조회 실패, 더미 데이터 사용:', error);
  //   // 서버 연결 실패 시 자동으로 더미 데이터 반환
  //   await delay(200);
  //   return mockArticles;
  // }
};

/**
 * 특정 미션 조회
 * @param missionId 미션 ID
 * @returns Promise<Mission | null>
 */
export const fetchMissionById = async (
  missionId: number,
): Promise<Mission | null> => {
  // 더미 데이터 사용 모드이거나 서버 연결 실패 시 더미 데이터 반환
  if (USE_MOCK_DATA) {
    await delay(150);
    const mission = mockMissions.find(m => m.id === missionId);
    return mission || null;
  }

  try {
    // 서버 API 호출
    const response = await client.get<Mission>(`/missions/${missionId}`);
    return response.data;
  } catch (error) {
    console.error('미션 조회 실패, 더미 데이터 사용:', error);
    // 서버 연결 실패 시 자동으로 더미 데이터 반환
    await delay(150);
    const mission = mockMissions.find(m => m.id === missionId);
    return mission || null;
  }
};

/**
 * 미션 진행도 업데이트
 */
export const updateMissionProgress = async (
  missionId: number,
  current: number,
): Promise<Mission> => {
  // 더미 데이터 사용 모드이거나 서버 연결 실패 시 더미 데이터 반환
  if (USE_MOCK_DATA) {
    await delay(200);
    const mission = mockMissions.find(m => m.id === missionId);
    if (!mission) {
      throw new Error('Mission not found');
    }
    const updatedMission = { ...mission, current };
    return updatedMission;
  }

  // 서버 API 호출 (현재는 더미 데이터만 사용)
  await delay(200);
  const mission = mockMissions.find(m => m.id === missionId);
  if (!mission) {
    throw new Error('Mission not found');
  }
  const updatedMission = { ...mission, current };
  return updatedMission;

  // try {
  //   // 서버 API 호출
  //   const response = await client.patch<Mission>(`/missions/${missionId}`, {
  //     current,
  //   });
  //   return response.data;
  // } catch (error) {
  //   console.error('미션 진행도 업데이트 실패, 더미 데이터 사용:', error);
  //   // 서버 연결 실패 시 자동으로 더미 데이터 반환
  //   await delay(200);
  //   const mission = mockMissions.find(m => m.id === missionId);
  //   if (!mission) {
  //     throw new Error('Mission not found');
  //   }
  //   const updatedMission = { ...mission, current };
  //   return updatedMission;
  // }
};
