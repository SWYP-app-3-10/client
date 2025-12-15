/* eslint-disable prettier/prettier */
/**
 * 캐릭터 관련 화면(레벨/내역/알림)에서 공통으로 쓰는 Mock 데이터
 */

export type LevelCriteria = {
  id: number;
  title: string;        // 화면에 보여줄 레벨 이름
  requiredExp: number;  // (예시) 해당 레벨 기준 누적 경험치
  summary: string;      // 한 줄 설명
};

export type LevelDetail = {
  levelId: number;
  title: string;
  requiredExp: number;
  rewards: {label: string; xp: number; pt: number}[]; // 경험치/포인트 정책
  tips: string[]; // 안내 문구
};

export type PointHistoryItem = {
  id: string;
  title: string;     // 내역 제목
  createdAt: string; // "방금", "어제" 같은 표기 (예시)
  xpDelta: number;   // +/-
  ptDelta: number;   // +/-
};

export type NotificationItem = {
  id: string;
  title: string;
  createdAt: string;
  isRead: boolean; // 읽음 여부
};

/** 레벨 목록(기준 확인 리스트) */
export const levelList: LevelCriteria[] = [
  {id: 1, title: 'Lv.1 이제막', requiredExp: 0, summary: '기본 미션으로 적응해요'},
  {id: 2, title: 'Lv.2 조금알고', requiredExp: 100, summary: '미션 보상이 조금 증가해요'},
  {id: 3, title: 'Lv.3 꽤함', requiredExp: 250, summary: '연속 달성 보너스가 유리해요'},
  {id: 4, title: 'Lv.4 전문가', requiredExp: 450, summary: '고급 미션이 해금돼요'},
];

/** 레벨 상세(경험치/포인트 기준) */
export const levelDetailMap: Record<number, LevelDetail> = {
  1: {
    levelId: 1,
    title: 'Lv.1 이제막',
    requiredExp: 0,
    rewards: [
      {label: '기사 읽기(10초+)', xp: 40, pt: 0},
      {label: '미션 완료', xp: 30, pt: 10},
      {label: '광고 시청', xp: 10, pt: 3},
    ],
    tips: ['하루 1개 기사부터 꾸준히', '연속 달성 시 보너스가 붙을 수 있어요'],
  },
  2: {
    levelId: 2,
    title: 'Lv.2 조금알고',
    requiredExp: 100,
    rewards: [
      {label: '기사 읽기(10초+)', xp: 50, pt: 0},
      {label: '미션 완료', xp: 40, pt: 12},
      {label: '광고 시청', xp: 12, pt: 4},
    ],
    tips: ['난이도 2 미션 도전 추천', '관심분야를 설정하면 피드가 더 좋아져요'],
  },
  3: {
    levelId: 3,
    title: 'Lv.3 꽤함',
    requiredExp: 250,
    rewards: [
      {label: '기사 읽기(10초+)', xp: 60, pt: 0},
      {label: '미션 완료', xp: 50, pt: 15},
      {label: '광고 시청', xp: 15, pt: 5},
    ],
    tips: ['요약 퀴즈에 집중하면 성장 빨라요', '연속 달성 유지가 중요해요'],
  },
  4: {
    levelId: 4,
    title: 'Lv.4 전문가',
    requiredExp: 450,
    rewards: [
      {label: '기사 읽기(10초+)', xp: 70, pt: 0},
      {label: '미션 완료', xp: 60, pt: 20},
      {label: '광고 시청', xp: 18, pt: 6},
    ],
    tips: ['고급 미션 위주로 플레이', '스트릭 유지로 보너스를 챙기세요'],
  },
};

/** 포인트/경험치 내역 */
export const pointHistoryMock: PointHistoryItem[] = [
  {id: 'h1', title: '기사 읽기(10초 이상)', createdAt: '방금', xpDelta: +40, ptDelta: 0},
  {id: 'h2', title: '미션 완료', createdAt: '10분 전', xpDelta: +30, ptDelta: +10},
  {id: 'h3', title: '광고 시청', createdAt: '어제', xpDelta: +10, ptDelta: +3},
  {id: 'h4', title: '포인트 사용(보상 구매)', createdAt: '3일 전', xpDelta: 0, ptDelta: -20},
];

/** 알림 리스트 */
export const notificationMock: NotificationItem[] = [
  {id: 'n1', title: '오늘의 미션이 갱신되었어요!', createdAt: '1분 전', isRead: false},
  {id: 'n2', title: '레벨업까지 50XP 남았어요!', createdAt: '오늘', isRead: false},
  {id: 'n3', title: '관심분야를 업데이트 해보세요', createdAt: '3일 전', isRead: true},
];