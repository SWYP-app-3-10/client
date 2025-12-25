/**
 * 캐릭터 관련 React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCharacterData,
  fetchAttendanceData,
  addExperience,
  CharacterData,
  AttendanceData,
} from '../api/characterApi';

// Query Keys
export const characterKeys = {
  all: ['character'] as const,
  data: () => [...characterKeys.all, 'data'] as const,
  attendance: () => [...characterKeys.all, 'attendance'] as const,
};

/**
 * 캐릭터 정보 조회
 */
export const useCharacterData = () => {
  return useQuery<CharacterData>({
    queryKey: characterKeys.data(),
    queryFn: fetchCharacterData,
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
  });
};

/**
 * 주간 출석 기록 조회
 */
export const useAttendanceData = () => {
  return useQuery<AttendanceData[]>({
    queryKey: characterKeys.attendance(),
    queryFn: fetchAttendanceData,
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
  });
};

/**
 * 경험치 추가 Mutation
 */
export const useAddExperience = () => {
  const queryClient = useQueryClient();

  return useMutation<CharacterData, Error, number>({
    mutationFn: addExperience,
    onSuccess: () => {
      // 캐릭터 데이터 캐시 무효화하여 최신 데이터 가져오기
      queryClient.invalidateQueries({ queryKey: characterKeys.data() });
    },
  });
};
