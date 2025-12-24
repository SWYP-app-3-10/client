/**
 * 캐릭터 관련 React Query hooks
 */

import { useQuery } from '@tanstack/react-query';
import {
  fetchCharacterData,
  fetchAttendanceData,
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
