import client from './client';
import { getUserInfo } from '../services/authService';

/** 개별 컨텐츠 데이터 규격 */
export interface ContentResponse {
  contentId: number;
  title: string;
  categoryName: string;
  imgUrl: string;
  hits: number;
  readingTime: number;
  publishedDate: string;
}

/** 탐색 화면 응답 규격 */
export interface ExploreResponse {
  contents: ContentResponse[];
  remainingMinutes: number;
}

/** [GET] 탐색 목록 가져오기 */
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

/** [GET] 검색 목록 가져오기
 */
export const fetchSearchContents = async (params: {
  keyword: string;
  page: number;
}): Promise<ContentResponse[]> => {
  try {
    const userInfo = await getUserInfo();
    if (!userInfo) throw new Error('사용자 정보가 없습니다');

    const response = await client.get<ContentResponse[]>(
      '/api/content/search',
      {
        params: {
          userId: userInfo.userId,
          keyword: params.keyword,
          page: params.page,
        },
      },
    );

    // 서버 응답이 배열 형태인 경우 그대로 반환
    return response.data;
  } catch (error) {
    console.error('[검색 API] 에러:', error);
    throw error;
  }
};
