/**
 * 아티클 관련 React Query hooks
 */

import {useQuery} from '@tanstack/react-query';
import {fetchArticles} from '../api/missionApi';

// Query Keys
export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (filters: string) => [...articleKeys.lists(), {filters}] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (id: number) => [...articleKeys.details(), id] as const,
};

/**
 * 아티클 목록 조회
 */
export const useArticles = () => {
  return useQuery({
    queryKey: articleKeys.lists(),
    queryFn: fetchArticles,
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
  });
};
