/**
 * 보상 관련 상수 정의
 * 경험치(XP)와 포인트(P) 획득/차감 기준
 *
 * 서버에서 리워드 설정을 받아오지만, 오프라인/에러 시 기본값으로 사용
 */

import { RewardsConfig } from '../api/rewardsApi';

// 기본 리워드 설정 (서버 연동 전 또는 오프라인 시 사용)
export const DEFAULT_REWARDS_CONFIG: RewardsConfig = {
  // 기사 읽기 관련
  articleReadPointCost: 30,
  articleReadExperience: 15,

  // 광고 시청 관련
  adRewardPoints: 60,

  // 퀴즈 관련
  quizCorrectExperience: 25,
  quizCorrectPoint: 30,
  quizIncorrectExperience: 15,
  quizIncorrectPoint: 10,

  // 데일리 출석
  dailyAttendanceExperience: 5,
  dailyAttendancePoint: 10,

  // 위클리 출석
  weeklyAttendanceExperience: 30,
  weeklyAttendancePoint: 30,
};

// 하위 호환성을 위한 개별 상수 export (기존 코드 마이그레이션용)
export const ARTICLE_READ_POINT_COST =
  DEFAULT_REWARDS_CONFIG.articleReadPointCost;
export const ARTICLE_READ_EXPERIENCE =
  DEFAULT_REWARDS_CONFIG.articleReadExperience;
export const AD_REWARD_POINTS = DEFAULT_REWARDS_CONFIG.adRewardPoints;
export const QUIZ_CORRECT_EXPERIENCE =
  DEFAULT_REWARDS_CONFIG.quizCorrectExperience;
export const QUIZ_CORRECT_POINT = DEFAULT_REWARDS_CONFIG.quizCorrectPoint;
export const QUIZ_INCORRECT_EXPERIENCE =
  DEFAULT_REWARDS_CONFIG.quizIncorrectExperience;
export const QUIZ_INCORRECT_POINT = DEFAULT_REWARDS_CONFIG.quizIncorrectPoint;
export const DAILY_ATTENDANCE_EXPERIENCE =
  DEFAULT_REWARDS_CONFIG.dailyAttendanceExperience;
export const DAILY_ATTENDANCE_POINT =
  DEFAULT_REWARDS_CONFIG.dailyAttendancePoint;
export const WEEKLY_ATTENDANCE_EXPERIENCE =
  DEFAULT_REWARDS_CONFIG.weeklyAttendanceExperience;
export const WEEKLY_ATTENDANCE_POINT =
  DEFAULT_REWARDS_CONFIG.weeklyAttendancePoint;

// 타입 export (useRewards hook에서 사용)
export type { RewardsConfig };
