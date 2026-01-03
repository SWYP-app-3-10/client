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
    queryFn: ({ pageParam }) => {
      console.log(
        `[React Query] 호출 시작 - Category: ${category}, PageParam: ${pageParam}`,
      );
      return fetchExploreContents({
        category,
        page: Number(pageParam),
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      // 수정 포인트: lastPage.contents가 존재할 때만 length를 확인합니다.
      const isLast = !lastPage?.contents || lastPage.contents.length === 0;
      console.log(
        `[React Query] 다음 페이지 체크: ${
          isLast ? '마지막 페이지임' : `다음 페이지 번호: ${allPages.length}`
        }`,
      );
      return isLast ? undefined : allPages.length;
    },
    staleTime: 1000 * 60 * 1,
  });
};
