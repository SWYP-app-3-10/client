/**
 * 리워드 설정 관련 React Query hooks
 * 서버에서 리워드 설정을 가져오되, 실패 시 기본값 사용
 */

import { useQuery } from '@tanstack/react-query';
import { fetchRewardsConfig, RewardsConfig } from '../api/rewardsApi';
import { DEFAULT_REWARDS_CONFIG } from '../config/rewards';

// Query Keys
export const rewardsKeys = {
  all: ['rewards'] as const,
  config: () => [...rewardsKeys.all, 'config'] as const,
};

/**
 * 리워드 설정 조회
 * 서버에서 가져오되, 실패 시 기본값 사용
 */
export const useRewards = () => {
  const query = useQuery<RewardsConfig, Error>({
    queryKey: rewardsKeys.config(),
    queryFn: fetchRewardsConfig,
    staleTime: 1000 * 60 * 30, // 30분간 fresh 상태 유지 (설정은 자주 바뀌지 않음)
    gcTime: 1000 * 60 * 60, // 1시간간 캐시 유지
    retry: 2, // 실패 시 2번 재시도
    // 에러 발생 시 기본값 사용
    placeholderData: DEFAULT_REWARDS_CONFIG,
  });

  // 서버 데이터가 있으면 사용, 없으면 기본값 사용
  const rewards: RewardsConfig = query.data || DEFAULT_REWARDS_CONFIG;

  return {
    ...query,
    rewards, // 실제 사용할 리워드 값 (서버 데이터 또는 기본값)
  };
};
