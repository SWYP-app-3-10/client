/**
 * 미션 관련 React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchMissionToday,
  convertMissionTodayToMission,
  updateMissionProgress,
} from '../api/missionApi';
import { Mission } from '../data/mock/missionData';
import { getUserInfo } from '../services/authService';

// Query Keys
export const missionKeys = {
  all: ['missions'] as const,
  lists: () => [...missionKeys.all, 'list'] as const,
  list: (filters: string) => [...missionKeys.lists(), { filters }] as const,
  details: () => [...missionKeys.all, 'detail'] as const,
  detail: (id: number) => [...missionKeys.details(), id] as const,
};

/**
 * 오늘의 미션 목록 조회
 */
export const useMissions = () => {
  return useQuery<Mission[], Error>({
    queryKey: missionKeys.lists(),
    queryFn: async () => {
      const userInfo = await getUserInfo();
      if (!userInfo || !userInfo.userId) {
        throw new Error('사용자 정보가 없습니다');
      }

      const response = await fetchMissionToday(userInfo.userId);
      if (response.data && response.data.missions) {
        // MissionToday를 Mission으로 변환
        return response.data.missions.map((mission, index) =>
          convertMissionTodayToMission(mission, index),
        );
      }
      return [];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

/**
 * 미션 진행도 업데이트 Mutation
 */
export const useUpdateMissionProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      missionId,
      current,
    }: {
      missionId: number;
      current: number;
    }) => updateMissionProgress(missionId, current),
    onSuccess: (data, variables) => {
      // 미션 목록 캐시 업데이트
      queryClient.setQueryData<Mission[]>(missionKeys.lists(), old => {
        if (!old) {
          return [data];
        }
        return old.map(mission =>
          mission.id === variables.missionId ? data : mission,
        );
      });

      // 특정 미션 캐시 업데이트
      queryClient.setQueryData(missionKeys.detail(variables.missionId), data);

      // 미션 목록 쿼리 무효화 (서버에서 최신 데이터 가져오기)
      queryClient.invalidateQueries({ queryKey: missionKeys.lists() });
    },
  });
};
