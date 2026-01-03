import client from './client';
import { getUserInfo } from '../services/authService';

export interface ContentResponse {
  contentId: number;
  title: string;
  categoryName: string;
  imgUrl: string;
  hits: number;
  readingTime: number;
  publishedDate: string;
}

export interface ExploreResponse {
  contents: ContentResponse[];
  nextBatchTime: string;
  updatedContent: boolean;
}

/** [GET] 탐색 목록 가져오기 */
export const fetchExploreContents = async (params: {
  category?: string;
  page: number;
}): Promise<ExploreResponse> => {
  const userInfo = await getUserInfo();
  if (!userInfo) throw new Error('사용자 정보가 없습니다');

  const url = params.category
    ? `/api/content/explore/${params.category}`
    : '/api/content/explore';

  const response = await client.get<ExploreResponse>(url, {
    params: {
      userId: userInfo.userId,
      page: params.page,
    },
  });

  return response.data;
};
