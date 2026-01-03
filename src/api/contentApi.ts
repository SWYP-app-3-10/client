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
      `[API Request] URL: ${url} | Page: ${params.page} | Category: ${
        params.category || '전체'
      }`,
    );

    // 로그 확인 결과, 서버 응답이 { status, message, data: { ...실제데이터 } } 구조입니다.
    // 따라서 response.data.data를 가져와야 ExploreResponse 규격에 맞습니다.
    const response = await client.get<any>(url, {
      params: {
        userId: userInfo.userId,
        page: params.page,
      },
    });

    // 서버 로그 기반으로 실제 데이터 추출 (response.data 내부에 data가 또 있음)
    const actualData: ExploreResponse = response.data.data;

    // 서버 응답 데이터 상세 확인
    console.log('[API Response Success]:', {
      contentCount: actualData?.contents?.length,
      firstItem: actualData?.contents?.[0], // 첫 번째 아이템 구조 확인용
      raw: response.data, // 전체 응답 확인
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
