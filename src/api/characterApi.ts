/**
 * 캐릭터 관련 API 함수
 */

import { useExperienceStore } from '../store/experienceStore';
import client from './client';
import { getUserInfo } from '../services/authService';

/**
 * 레벨 기준 정보 타입
 */
export interface LevelStandard {
  characterLevel: string;
  characterName: string;
  characterImgUrl: string;
  exp: number;
  lv1Message: string;
}

/**
 * 캐릭터 레벨 API 응답 타입
 */
export interface CharacterLevelResponse {
  currentUserExp: number;
  characterLevel: string; // "LEVEL_1", "LEVEL_2", etc.
  levelStandard: LevelStandard[];
}

/**
 * 캐릭터 정보 타입 (화면에서 사용)
 */
export interface CharacterData {
  currentLevel: number;
  currentExp: number;
  nextLevelExp: number;
  levelStandard?: LevelStandard[];
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
 * 레벨 문자열을 숫자로 변환 (예: "LEVEL_1" -> 1)
 */
const parseLevelNumber = (levelString: string | undefined): number => {
  if (!levelString) {
    return 1;
  }
  const match = levelString.match(/LEVEL_(\d+)/);
  return match ? parseInt(match[1], 10) : 1;
};

/**
 * 캐릭터 레벨 정보 조회
 * @returns Promise<CharacterLevelResponse>
 */
export const fetchCharacterLevel =
  async (): Promise<CharacterLevelResponse> => {
    try {
      const userInfo = await getUserInfo();
      if (!userInfo || !userInfo.userId) {
        throw new Error('사용자 정보가 없습니다');
      }

      const response = await client.get<CharacterLevelResponse>(
        `/api/characters/standards/level?userId=${userInfo.userId}`,
      );
      return response.data;
    } catch (error) {
      if (__DEV__) {
        console.error('[캐릭터 레벨 API] 에러:', error);
      }
      throw error;
    }
  };

/**
 * 캐릭터 정보 조회 (레벨 API 응답을 CharacterData로 변환)
 * @returns Promise<CharacterData>
 */
export const fetchCharacterData = async (): Promise<CharacterData> => {
  try {
    const levelResponse = await fetchCharacterLevel();

    // 응답 데이터 검증
    if (!levelResponse || !levelResponse.characterLevel) {
      throw new Error('레벨 정보가 없습니다');
    }

    const currentLevel = parseLevelNumber(levelResponse.characterLevel);
    const currentExp = levelResponse.currentUserExp ?? 0;

    // 다음 레벨의 경험치 찾기
    const currentLevelStandard = levelResponse.levelStandard?.find(
      std => std.characterLevel === levelResponse.characterLevel,
    );
    const nextLevelIndex =
      levelResponse.levelStandard?.findIndex(
        std => std.characterLevel === levelResponse.characterLevel,
      ) ?? -1;
    const nextLevelStandard =
      nextLevelIndex >= 0 &&
      nextLevelIndex < (levelResponse.levelStandard?.length ?? 0) - 1
        ? levelResponse.levelStandard?.[nextLevelIndex + 1]
        : null;
    const nextLevelExp =
      nextLevelStandard?.exp ?? currentLevelStandard?.exp ?? 100;

    return {
      currentLevel,
      currentExp,
      nextLevelExp,
      levelStandard: levelResponse.levelStandard,
    };
  } catch (error) {
    if (__DEV__) {
      console.error('[캐릭터 정보 조회] 에러:', error);
    }
    // 에러 발생 시 기본값 반환
    const { experience } = useExperienceStore.getState();
    return {
      currentLevel: 1,
      currentExp: experience ?? 0,
      nextLevelExp: 100,
    };
  }
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
