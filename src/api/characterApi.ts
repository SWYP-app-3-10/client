/**
 * 캐릭터 관련 API 함수
 * 현재는 더미 데이터를 반환하지만, 실제 API 연동 시 이 파일을 수정
 */

// API 응답 시뮬레이션을 위한 딜레이 함수
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
  // 실제 API 호출 시뮬레이션 (800ms 딜레이)
  await delay(800);
  return {
    currentLevel: 1,
    currentExp: 50,
    nextLevelExp: 100,
  };
};

/**
 * 주간 출석 기록 조회
 * @returns Promise<AttendanceData[]>
 */
export const fetchAttendanceData = async (): Promise<AttendanceData[]> => {
  // 실제 API 호출 시뮬레이션 (600ms 딜레이)
  await delay(600);
  return [
    { day: '월', attended: true },
    { day: '화', attended: true },
    { day: '수', attended: false },
    { day: '목', attended: false },
    { day: '금', attended: false },
    { day: '토', attended: false },
    { day: '일', attended: false },
  ];
};
