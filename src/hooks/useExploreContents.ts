import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchExploreContents, ExploreResponse } from '../api/contentApi';

export const exploreKeys = {
  all: ['explore'] as const,
  lists: () => [...exploreKeys.all, 'list'] as const,
  list: (categoryName?: string) =>
    [...exploreKeys.lists(), { categoryName }] as const,
};

export const useExploreContents = (params: { categoryName?: string } = {}) => {
  // ✅ params에 기본값 {}를 주어 undefined 에러(categoryName을 읽을 수 없음)를 방지합니다.
  const { categoryName } = params;

  return useInfiniteQuery<ExploreResponse, Error>({
    queryKey: exploreKeys.list(categoryName),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchExploreContents({
        categoryName,
        page: Number(pageParam),
      }),
    getNextPageParam: (lastPage, allPages) => {
      const currentContentsLength = lastPage?.contents?.length ?? 0;
      if (currentContentsLength === 0) return undefined;
      return allPages.length;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
