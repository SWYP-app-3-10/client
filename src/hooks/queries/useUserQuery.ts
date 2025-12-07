import {useQuery} from '@tanstack/react-query';
import {getUserProfile} from '../../api/user';

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 5, // 5분 동안은 다시 요청 안 함 (캐싱 설정 예시)
  });
};
