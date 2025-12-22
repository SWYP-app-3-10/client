/**
 * 미션 관련 API 함수
 * 현재는 더미 데이터를 반환하지만, 실제 API 연동 시 이 파일을 수정
 */

import { Mission, Article } from '../data/mockData';
import { mockMissions, mockArticles } from '../data/mockData';

// API 응답 시뮬레이션을 위한 딜레이 함수
const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), ms));

/**
 * 오늘의 미션 목록 조회
 * @returns Promise<Mission[]>
 */
export const fetchMissions = async (): Promise<Mission[]> => {
  // 실제 API 호출 시뮬레이션 (1초 딜레이)
  await delay(1000);
  return mockMissions;
};

/**
 * 아티클 목록 조회
 * @returns Promise<Article[]>
 */
export const fetchArticles = async (): Promise<Article[]> => {
  // 실제 API 호출 시뮬레이션 (800ms 딜레이)
  await delay(800);
  return mockArticles;
};

/**
 * 특정 미션 조회
 * @param missionId 미션 ID
 * @returns Promise<Mission | null>
 */
export const fetchMissionById = async (
  missionId: number,
): Promise<Mission | null> => {
  await delay(500);
  const mission = mockMissions.find(m => m.id === missionId);
  return mission || null;
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
  await delay(500);
  const mission = mockMissions.find(m => m.id === missionId);
  if (!mission) {
    throw new Error('Mission not found');
  }
  const updatedMission = { ...mission, current };
  return updatedMission;
};
