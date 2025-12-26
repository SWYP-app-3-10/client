export type LevelCriteria = {
  id: number;
  title: string;
  requiredExp: number;
  summaryTitle: string;
  summaryDesc: string;
};

export const levelList: LevelCriteria[] = [
  // summaryDesc 반영하지 않음 -> 추후 기획 수정 시 사용
  {
    id: 1,
    title: 'Lv. 1 아메바',
    requiredExp: 0,
    summaryTitle: '처음 시작',
    summaryDesc: '누구나 ...', // 반영하지 않음 -> 추후 기획 수정 시 사용
  },
  {
    id: 2,
    title: 'Lv. 2 꼬물 물고기',
    requiredExp: 100,
    summaryTitle: '경험치 100',
    summaryDesc: '퀴즈를 5개 풀면 달성할 수 있어요!',
  },
  {
    id: 3,
    title: 'Lv. 3 괴물 뭉게',
    requiredExp: 250,
    summaryTitle: '경험치 500',
    summaryDesc: '퀴즈를 25개 풀면 달성할 수 있어요!',
  },
  {
    id: 4,
    title: 'Lv. 4 꼬마 원시인',
    requiredExp: 450,
    summaryTitle: '경험치 2000',
    summaryDesc: '퀴즈를 100개 풀면 달성할 수 있어요!',
  },
  {
    id: 5,
    title: 'Lv. 5 아인슈타인',
    requiredExp: 800,
    summaryTitle: '경험치 6000',
    summaryDesc: '퀴즈를 300개 풀면 달성할 수 있어요!',
  },
];
