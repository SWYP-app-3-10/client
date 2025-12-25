/**
 * 포인트 상태 관리 Store
 */

import { create } from 'zustand';
import {
  getExperience,
  saveExperience,
  addExperience as addExperienceService,
  subtractExperience as subtractExperienceService,
} from '../services/experienceService';

interface ExperienceStore {
  experience: number;
  setExperience: (experience: number) => Promise<void>;
  addExperience: (amount: number) => Promise<void>;
  subtractExperience: (amount: number) => Promise<boolean>; // 성공 여부 반환
  loadExperience: () => Promise<void>;
}

export const useExperienceStore = create<ExperienceStore>((set, get) => ({
  experience: 0,
  setExperience: async (experience: number) => {
    try {
      await saveExperience(experience);
      set({ experience });
    } catch (error) {
      console.error('포인트 저장 실패:', error);
    }
  },
  addExperience: async (amount: number) => {
    try {
      const newExperience = await addExperienceService(amount);
      set({ experience: newExperience });
      console.log(
        '경험치 추가 성공:',
        newExperience,
        '현재 경험치:',
        get().experience,
      );
    } catch (error) {
      console.error('경험치 추가 실패:', error);
    }
  },
  subtractExperience: async (amount: number) => {
    try {
      const result = await subtractExperienceService(amount);
      set({ experience: result.newExperience });
      console.log(
        '경험치 차감 성공:',
        result.newExperience,
        '현재 경험치:',
        get().experience,
      );
      return result.success;
    } catch (error) {
      console.error('경험치 차감 실패:', error);
      return false;
    }
  },
  loadExperience: async () => {
    try {
      const experience = await getExperience();
      set({ experience });
    } catch (error) {
      console.error('경험치 로드 실패:', error);
      set({ experience: 0 });
    }
  },
}));
