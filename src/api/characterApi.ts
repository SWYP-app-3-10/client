/**
 * 캐릭터 관련 API 함수
 */

import client from './client';
import { USE_MOCK_DATA } from '../config/apiConfig';

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
export const fetchCharacterData = async (): Promise<CharacterData> => {
  // 더미 데이터 사용 모드이거나 서버 연결 실패 시 더미 데이터 반환
  if (USE_MOCK_DATA) {
    await delay(200);
    return {
      currentLevel: 1,
      currentExp: 50,
      nextLevelExp: 100,
    };
  }

  try {
    // 서버 API 호출
    const response = await client.get<CharacterData>('/user/character');
    return response.data;
  } catch (error) {
    console.error('캐릭터 정보 조회 실패, 더미 데이터 사용:', error);
    // 서버 연결 실패 시 자동으로 더미 데이터 반환
    await delay(200);
    return {
      currentLevel: 1,
      currentExp: 50,
      nextLevelExp: 100,
    };
  }
};

/**
 * 주간 출석 기록 조회
 * @returns Promise<AttendanceData[]>
 */
export const fetchAttendanceData = async (): Promise<AttendanceData[]> => {
  // 더미 데이터 사용 모드이거나 서버 연결 실패 시 더미 데이터 반환
  if (USE_MOCK_DATA) {
    await delay(150);
    return [
      { day: '월', attended: true },
      { day: '화', attended: true },
      { day: '수', attended: false },
      { day: '목', attended: false },
      { day: '금', attended: false },
      { day: '토', attended: false },
      { day: '일', attended: false },
    ];
  }

  try {
    // 서버 API 호출
    const response = await client.get<AttendanceData[]>('/user/attendance');
    return response.data;
  } catch (error) {
    console.error('출석 기록 조회 실패, 더미 데이터 사용:', error);
    // 서버 연결 실패 시 자동으로 더미 데이터 반환
    await delay(150);
    return [
      { day: '월', attended: true },
      { day: '화', attended: true },
      { day: '수', attended: false },
      { day: '목', attended: false },
      { day: '금', attended: false },
      { day: '토', attended: false },
      { day: '일', attended: false },
    ];
  }
};

/**
 * 경험치 추가
 * 나중에 서버 API로 교체 가능
 * @param amount 추가할 경험치 양
 * @returns Promise<CharacterData> 업데이트된 캐릭터 정보
 */
export const addExperience = async (amount: number): Promise<CharacterData> => {
  // 더미 데이터 사용 모드이거나 서버 연결 실패 시 더미 데이터 반환
  if (USE_MOCK_DATA) {
    await delay(200);
    const currentData = await fetchCharacterData();
    const newExp = currentData.currentExp + amount;

    // 레벨업 체크 (간단한 예시)
    let newLevel = currentData.currentLevel;
    let newNextLevelExp = currentData.nextLevelExp;

    if (newExp >= currentData.nextLevelExp) {
      newLevel += 1;
      newNextLevelExp = currentData.nextLevelExp * 2; // 다음 레벨 경험치 (예시)
    }

    return {
      currentLevel: newLevel,
      currentExp: newExp,
      nextLevelExp: newNextLevelExp,
    };
  }

  try {
    // 서버 API 호출
    const response = await client.post<CharacterData>('/user/experience/add', {
      amount,
    });
    return response.data;
  } catch (error) {
    console.error('경험치 추가 실패, 더미 데이터 사용:', error);
    // 서버 연결 실패 시 자동으로 더미 데이터 반환
    await delay(200);
    const currentData = await fetchCharacterData();
    const newExp = currentData.currentExp + amount;

    let newLevel = currentData.currentLevel;
    let newNextLevelExp = currentData.nextLevelExp;

    if (newExp >= currentData.nextLevelExp) {
      newLevel += 1;
      newNextLevelExp = currentData.nextLevelExp * 2;
    }

    return {
      currentLevel: newLevel,
      currentExp: newExp,
      nextLevelExp: newNextLevelExp,
    };
  }
};
