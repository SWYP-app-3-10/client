// levelData.ts
import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

// 레벨 캐릭터 SVG import
import Lv1Ameba from '../../../../assets/svg/level/Lv1_Ameba.svg';
import Lv2Fish from '../../../../assets/svg/level/Lv2_Fish.svg';
import Lv3Cloud from '../../../../assets/svg/level/Lv3_Cloud.svg';
import Lv4Caveman from '../../../../assets/svg/level/Lv4_Caveman.svg';
import Lv5Einstein from '../../../../assets/svg/level/Lv5_Einstein.svg';

export type LevelCriteria = {
  id: number;
  title: string;
  requiredExp: number;
  summaryTitle: string;
  summaryDesc: string;

  // 레벨별 캐릭터 SVG 컴포넌트
  character: ComponentType<SvgProps>;
};

export const levelList: LevelCriteria[] = [
  // summaryDesc 반영하지 않음 -> 추후 기획 수정 시 사용
  {
    id: 1,
    title: 'Lv. 1 아메바',
    requiredExp: 0,
    summaryTitle: '처음 시작',
    summaryDesc: '누구나 ...', // 반영하지 않음 -> 추후 기획 수정 시 사용
    character: Lv1Ameba,
  },
  {
    id: 2,
    title: 'Lv. 2 꼬물 물고기',
    requiredExp: 100,
    summaryTitle: '짧은 글부터 천천히 헤엄치듯 읽기 시작한 단계예요.',
    summaryDesc: '퀴즈를 5개 풀면 달성할 수 있어요!',
    character: Lv2Fish,
  },
  {
    id: 3,
    title: 'Lv. 3 괴물 뭉게',
    requiredExp: 500,
    summaryTitle: '읽는 재미를 알게 되어, 빠르게 자라나는 단계예요.',
    summaryDesc: '퀴즈를 25개 풀면 달성할 수 있어요!',
    character: Lv3Cloud,
  },
  {
    id: 4,
    title: 'Lv. 4 꼬마 원시인',
    requiredExp: 2000,
    summaryTitle: '글을 이해하고, 지식을 도구처럼 활용하기 시작한 단계에요.',
    summaryDesc: '퀴즈를 100개 풀면 달성할 수 있어요!',
    character: Lv4Caveman,
  },
  {
    id: 5,
    title: 'Lv. 5 아인슈타인',
    requiredExp: 6000,
    summaryTitle: '복잡한 글도 스스로 생각하며 읽어내는 단계예요.',
    summaryDesc: '퀴즈를 300개 풀면 달성할 수 있어요!',
    character: Lv5Einstein,
  },
];
