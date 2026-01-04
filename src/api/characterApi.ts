/**
 * 캐릭터 관련 API 함수
 */

import { useExperienceStore } from '../store/experienceStore';
import client from './client';

/**
 * 캐릭터 정보 타입
 */
export interface CharacterData {
  currentLevel: number;
  currentExp: number;
  nextLevelExp: number;
}

/**
 * 출석 기록 타입
 */
export interface AttendanceData {
  day: string;
  attended: boolean;
}

/**
 * 포인트/경험치 정보 타입
 */
export interface AboutPointExpInformation {
  rewardType: string;
  description: string;
}

/**
 * 리워드 데이터 응답 타입
 */
export interface RewardDataResponse {
  rewardItem: string;
  exp: number;
  point: number;
}

/**
 * 캐릭터 리워드 정보 응답 타입
 */
export interface CharacterRewardResponse {
  aboutPointExpInformation: AboutPointExpInformation;
  rewardDataResponse: RewardDataResponse;
}

/**
 * 캐릭터 정보 조회
 * @returns Promise<CharacterData>
 */

export const fetchCharacterData = async (): Promise<CharacterData> => {
  const { experience } = useExperienceStore.getState();
  return {
    currentLevel: 1,
    currentExp: experience,
    nextLevelExp: 100,
  };
};

/**
 * 주간 출석 기록 조회
 * @returns Promise<AttendanceData[]>
 */
export const fetchAttendanceData = async (): Promise<AttendanceData[]> => {
  try {
    // 서버 API 호출
    // const response = await client.get<AttendanceData[]>('/user/attendance');
    // return response.data;
  } catch (error) {}
  return [];
};

/**
 * 캐릭터 리워드 정보 조회
 * @returns Promise<CharacterRewardResponse>
 */
export const fetchCharacterReward =
  async (): Promise<CharacterRewardResponse> => {
    try {
      const response = await client.get<CharacterRewardResponse>(
        '/api/characters/standards/reward',
      );
      return response.data;
    } catch (error) {
      if (__DEV__) {
        console.error('[캐릭터 리워드 API] 에러:', error);
      }
      throw error;
    }
  };
