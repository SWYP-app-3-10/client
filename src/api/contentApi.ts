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
  remainingMinutes: number;
}

export const fetchExploreContents = async (params: {
  categoryName?: string;
  page: number;
}): Promise<ExploreResponse> => {
  try {
    const userInfo = await getUserInfo();
    if (!userInfo) throw new Error('사용자 정보가 없습니다');

    const response = await client.get<ExploreResponse>('/api/content/explore', {
      params: {
        userId: userInfo.userId,
        categoryName: params.categoryName,
        page: params.page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('[탐색 API] 에러:', error);
    throw error;
  }
};
