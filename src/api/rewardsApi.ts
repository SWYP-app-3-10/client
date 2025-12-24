/**
 * 리워드 설정 관련 API 함수
 * 서버에서 리워드 값을 받아오는 함수
 */

import client from './client';

// API 응답 시뮬레이션을 위한 딜레이 함수 (개발용)
const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), ms));

/**
 * 서버에서 받아올 리워드 설정 타입
 */
export interface RewardsConfig {
  // 기사 읽기 관련
  articleReadPointCost: number;
  articleReadExperience: number;

  // 광고 시청 관련
  adRewardPoints: number;

  // 퀴즈 관련
  quizCorrectExperience: number;
  quizCorrectPoint: number;
  quizIncorrectExperience: number;
  quizIncorrectPoint: number;

  // 데일리 출석
  dailyAttendanceExperience: number;
  dailyAttendancePoint: number;

  // 위클리 출석
  weeklyAttendanceExperience: number;
  weeklyAttendancePoint: number;
}

/**
 * 서버에서 리워드 설정 조회
 * @returns Promise<RewardsConfig>
 */
export const fetchRewardsConfig = async (): Promise<RewardsConfig> => {
  try {
    // 서버 API 호출
    const response = await client.get<RewardsConfig>('/config/rewards');
    return response.data;
  } catch (error) {
    console.error('리워드 설정 조회 실패:', error);
    // 개발 모드에서는 더미 데이터 반환 (서버 연동 전까지)
    if (__DEV__) {
      await delay(300);
      return {
        articleReadPointCost: 30,
        articleReadExperience: 5,
        adRewardPoints: 60,
        quizCorrectExperience: 25,
        quizCorrectPoint: 30,
        quizIncorrectExperience: 15,
        quizIncorrectPoint: 10,
        dailyAttendanceExperience: 5,
        dailyAttendancePoint: 10,
        weeklyAttendanceExperience: 30,
        weeklyAttendancePoint: 30,
      };
    }
    throw error;
  }
};
