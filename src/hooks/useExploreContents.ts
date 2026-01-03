import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchExploreContents, ExploreResponse } from '../api/contentApi';

export const exploreKeys = {
  all: ['explore'] as const,
  list: (category?: string) => [...exploreKeys.all, { category }] as const,
};

export const useExploreContents = (category?: string) => {
  return useInfiniteQuery<ExploreResponse, Error>({
    queryKey: exploreKeys.list(category),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchExploreContents({
        category,
        page: Number(pageParam),
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.contents.length > 0 ? allPages.length : undefined;
    },
    staleTime: 1000 * 60 * 1,
  });
};
