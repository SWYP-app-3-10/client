/**
 * 캐릭터 관련 API 함수
 */

import { useExperienceStore } from '../store/experienceStore';

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
};
