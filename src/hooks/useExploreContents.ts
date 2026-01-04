import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchExploreContents, ExploreResponse } from '../api/contentApi';

export const exploreKeys = {
  all: ['explore'] as const,
  list: (category?: string) => [...exploreKeys.all, { category }] as const,
};

export const useExploreContents = (category?: string) => {
  return useInfiniteQuery<ExploreResponse, Error>({
    queryKey: exploreKeys.list(category),

    // 페이지 기반이 아니라 커서(nextBatchTime) 기반
    initialPageParam: null as string | null,

    queryFn: ({ pageParam }) => {
      console.log(
        `[React Query] 호출 시작 - Category: ${category}, nextBatchTime: ${pageParam}`,
      );
      return fetchExploreContents({
        category,
        nextBatchTime: pageParam as string | null,
      });
    },

    getNextPageParam: (lastPage, allPages) => {
      // 기존 로직 유지: lastPage.contents가 존재할 때만 length를 확인합니다.
      const isLast = !lastPage?.contents || lastPage.contents.length === 0;

      // 다음 커서는 서버가 내려주는 nextBatchTime
      const next = lastPage?.nextBatchTime ?? null;

      // 무한루프 방지: next가 없거나, 이전과 같으면 종료
      const prev =
        allPages.length >= 2
          ? allPages[allPages.length - 2]?.nextBatchTime
          : null;
      const isSameAsPrev = !!next && !!prev && next === prev;

      console.log(
        `[React Query] 다음 페이지 체크: ${
          isLast || !next || isSameAsPrev
            ? '마지막 페이지임'
            : `다음 커서: ${next}`
        }`,
      );

      return isLast || !next || isSameAsPrev ? undefined : next;
    },

    staleTime: 1000 * 60 * 1,
  });
};
