/**
 * 미션 관련 API 함수
 */

import client from './client';
import {
  Mission,
  Article,
  mockMissions,
  mockArticles,
} from '../data/mock/missionData';

// API 응답 시뮬레이션을 위한 딜레이 함수 (개발용)
const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), ms));

/**
 * 오늘의 미션 목록 조회
 * @returns Promise<Mission[]>
 */
export const fetchMissions = async (): Promise<Mission[]> => {
  try {
    // 서버 API 호출
    const response = await client.get<Mission[]>('/missions');
    return response.data;
  } catch (error) {
    console.error('미션 목록 조회 실패:', error);
    // 개발 모드에서는 더미 데이터 반환 (서버 연동 전까지)
    if (__DEV__) {
      await delay(1000);
      return mockMissions;
    }
    throw error;
  }
};

/**
 * 아티클 목록 조회
 * @returns Promise<Article[]>
 */
export const fetchArticles = async (): Promise<Article[]> => {
  try {
    // 서버 API 호출
    const response = await client.get<Article[]>('/articles');
    return response.data;
  } catch (error) {
    console.error('기사 목록 조회 실패:', error);
    // 개발 모드에서는 더미 데이터 반환 (서버 연동 전까지)
    if (__DEV__) {
      await delay(800);
      return mockArticles;
    }
    throw error;
  }
};

/**
 * 특정 미션 조회
 * @param missionId 미션 ID
 * @returns Promise<Mission | null>
 */
export const fetchMissionById = async (
  missionId: number,
): Promise<Mission | null> => {
  try {
    // 서버 API 호출
    const response = await client.get<Mission>(`/missions/${missionId}`);
    return response.data;
  } catch (error) {
    console.error('미션 조회 실패:', error);
    // 개발 모드에서는 더미 데이터 반환 (서버 연동 전까지)
    if (__DEV__) {
      await delay(500);
      const mission = mockMissions.find(m => m.id === missionId);
      return mission || null;
    }
    throw error;
  }
};

/**
 * 미션 진행도 업데이트
 * @param missionId 미션 ID
 * @param current 현재 진행도
 * @returns Promise<Mission>
 */
export const updateMissionProgress = async (
  missionId: number,
  current: number,
): Promise<Mission> => {
  try {
    // 서버 API 호출
    const response = await client.patch<Mission>(`/missions/${missionId}`, {
      current,
    });
    return response.data;
  } catch (error) {
    console.error('미션 진행도 업데이트 실패:', error);
    // 개발 모드에서는 더미 데이터 반환 (서버 연동 전까지)
    if (__DEV__) {
      await delay(500);
      const mission = mockMissions.find(m => m.id === missionId);
      if (!mission) {
        throw new Error('Mission not found');
      }
      const updatedMission = { ...mission, current };
      return updatedMission;
    }
    throw error;
  }
};
