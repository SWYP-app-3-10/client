/**
 * 사용자 관련 API
 */
import client from './client';
import { InterestCategory } from '../types/interests';
import { LevelCategory } from '../types/interests';

export interface UpdateInterestRequest {
  interests: InterestCategory[];
}

export interface UpdateResponse {
  success: boolean;
  message?: string;
}

/**
 * 마이페이지 콘텐츠 정보
 */
export interface MyPageContent {
  contentId: number;
  title: string;
  category: string;
  readAt: string;
  isQuizCorrect: boolean;
}

/**
 * 마이페이지 데이터
 */
export interface MyPageData {
  profileImgUrl: string;
  name: string;
  email: string;
  interests: InterestCategory[];
  level: LevelCategory;
  weeklyCount: number;
  contents: MyPageContent[];
}

/**
 * 마이페이지 API 응답 타입
 */
export interface MyPageResponse {
  status: number;
  message: string;
  data: MyPageData;
}

/**
 * 관심분야 업데이트 API 호출
 * @param userId 사용자 ID (query parameter)
 * @param interests 선택된 관심분야 목록 (순서대로)
 */
export const updateUserLevel = async (
  userId: number,
  level: LevelCategory,
): Promise<UpdateResponse> => {
  try {
    const response = await client.patch<UpdateResponse>(
      `/api/user/update/level?userId=${userId}`,
      { level },
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
export const updateUserInterests = async (
  userId: number,
  interests: InterestCategory[],
): Promise<UpdateResponse> => {
  try {
    const response = await client.patch<UpdateResponse>(
      `/api/user/update/interest?userId=${userId}`,
      { interests },
    );

    console.log(response.data);

    return response.data;
  } catch (error: any) {
    console.error('[관심분야 업데이트 API] 에러:', error);
    if (error.response) {
      console.error('[관심분야 업데이트 API] 서버 응답:', {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw error;
  }
};

/**
 * 마이페이지 정보 조회
 * @returns Promise<MyPageResponse>
 */
export const fetchMyPage = async (
  startDate: string,
): Promise<MyPageResponse> => {
  try {
    console.log('[마이페이지 API] 요청 시작');

    const response = await client.get<MyPageResponse>(
      `/api/mypage?date=${startDate}`,
    );

    console.log(
      '[마이페이지 API] 응답 성공:',
      JSON.stringify(response.data, null, 2),
    );

    return response.data;
  } catch (error: any) {
    console.error('[마이페이지 API] 에러:', error);
    if (error.response) {
      console.error('[마이페이지 API] 서버 응답:', {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw error;
  }
};
