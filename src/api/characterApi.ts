/**
 * 캐릭터 관련 API 함수
 */

import client from './client';

// API 응답 시뮬레이션을 위한 딜레이 함수 (개발용)
const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), ms));

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
import { getExperience } from '../services/experienceService';
import { levelList } from '../data/mock/characterData';

export const fetchCharacterData = async (): Promise<CharacterData> => {
  try {
    // 서버 API 호출
    // const response = await client.get<CharacterData>('/user/character');
    // return response.data;
  } catch (error) {
    console.error('캐릭터 정보 조회 실패, 더미 데이터 사용:', error);
    // 서버 연결 실패 시 자동으로 더미 데이터 반환
    await delay(200);
    // 실제 경험치를 가져와서 레벨 계산
    const currentExp = await getExperience();

    // 경험치를 기반으로 현재 레벨과 다음 레벨 경험치 계산
    let currentLevel = 1;
    let nextLevelExp = 100;

    // levelList를 역순으로 확인하여 현재 레벨 찾기
    for (let i = levelList.length - 1; i >= 0; i--) {
      if (currentExp >= levelList[i].requiredExp) {
        currentLevel = levelList[i].id;
        // 다음 레벨 경험치 찾기
        const nextLevel = levelList.find(l => l.id === currentLevel + 1);
        nextLevelExp = nextLevel
          ? nextLevel.requiredExp
          : levelList[levelList.length - 1].requiredExp * 2;
        break;
      }
    }

    return {
      currentLevel,
      currentExp,
      nextLevelExp,
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
};

/**
 * 경험치 추가
 * 나중에 서버 API로 교체 가능
 * @param amount 추가할 경험치 양
 * @returns Promise<CharacterData> 업데이트된 캐릭터 정보
 */
export const addExperience = async (amount: number): Promise<CharacterData> => {
  try {
    // 서버 API 호출
    // const response = await client.post<CharacterData>('/user/experience/add', {
    //   amount,
    // });
    // return response.data;
  } catch (error) {
    console.error('경험치 추가 실패, 더미 데이터 사용:', error);
  }
};
