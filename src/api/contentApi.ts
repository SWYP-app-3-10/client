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
  nextBatchTime: string | null;
  updatedContent: boolean;
}

/** [GET] 탐색 목록 가져오기 */
export const fetchExploreContents = async (params: {
  category?: string;
  nextBatchTime?: string | null;
}): Promise<ExploreResponse> => {
  try {
    const userInfo = await getUserInfo();
    if (!userInfo) {
      console.warn('[API Fetch] 사용자 정보 없음 - 로그인이 필요합니다.');
      throw new Error('사용자 정보가 없습니다');
    }

    const url = params.category
      ? `/api/content/explore/${params.category}`
      : '/api/content/explore';

    console.log(
      `[API Request] URL: ${url} | nextBatchTime: ${
        params.nextBatchTime ?? 'null(첫 요청)'
      } | Category: ${params.category || '전체'}`,
    );

    // Swagger 상 필수는 userId
    const response = await client.get<any>(url, {
      params: {
        userId: userInfo.userId,
        ...(params.nextBatchTime
          ? { nextBatchTime: params.nextBatchTime }
          : {}),
      },
    });

    // 서버 로그 기반으로 실제 데이터 추출 (response.data 내부에 data가 또 있음)
    const actualData: ExploreResponse = response.data.data;

    // 서버 응답 데이터 상세 확인
    console.log('[API Response Success]:', {
      contentCount: actualData?.contents?.length,
      firstItem: actualData?.contents?.[0],
      nextBatchTime: actualData?.nextBatchTime,
      raw: response.data,
    });

    return actualData;
  } catch (error: any) {
    // 에러 발생 시 상태 코드와 메시지 상세 로그
    console.error('[API Response Error]:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      config: error.config?.url,
    });
    throw error;
  }
};
