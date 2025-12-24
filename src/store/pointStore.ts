/**
 * 포인트 상태 관리 Store
 */

import { create } from 'zustand';
import {
  getPoints,
  savePoints,
  addPoints as addPointsService,
  subtractPoints as subtractPointsService,
} from '../services/pointService';

interface PointStore {
  points: number;
  setPoints: (points: number) => Promise<void>;
  addPoints: (amount: number) => Promise<void>;
  subtractPoints: (amount: number) => Promise<boolean>; // 성공 여부 반환
  loadPoints: () => Promise<void>;
}

export const usePointStore = create<PointStore>((set, get) => ({
  points: 0,
  setPoints: async (points: number) => {
    try {
      await savePoints(points);
      set({ points });
    } catch (error) {
      console.error('포인트 저장 실패:', error);
    }
  },
  addPoints: async (amount: number) => {
    try {
      const newPoints = await addPointsService(amount);
      set({ points: newPoints });
      console.log('포인트 추가 성공:', newPoints, '현재 포인트:', get().points);
    } catch (error) {
      console.error('포인트 추가 실패:', error);
    }
  },
  subtractPoints: async (amount: number) => {
    try {
      const result = await subtractPointsService(amount);
      set({ points: result.newPoints });
      console.log(
        '포인트 차감 성공:',
        result.newPoints,
        '현재 포인트:',
        get().points,
      );
      return result.success;
    } catch (error) {
      console.error('포인트 차감 실패:', error);
      return false;
    }
  },
  loadPoints: async () => {
    try {
      const points = await getPoints();
      set({ points });
    } catch (error) {
      console.error('포인트 로드 실패:', error);
      set({ points: 0 });
    }
  },
}));
