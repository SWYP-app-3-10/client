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
 * 관심분야 업데이트 API 호출
 * @param userId 사용자 ID (query parameter)
 * @param interests 선택된 관심분야 목록 (순서대로)
 */
export const updateUserLevel = async (
  userId: number,
  level: LevelCategory,
): Promise<UpdateResponse> => {
  try {
    console.log('[난이도 업데이트 API] 요청 시작');
    console.log('[난이도 업데이트 API] userId:', userId);
    console.log('[난이도 업데이트 API] level:', level);

    const response = await client.patch<UpdateResponse>(
      `/api/user/update/level?userId=${userId}`,
      { level },
    );

    console.log(
      '[난이도 업데이트 API] 응답 성공:',
      JSON.stringify(response.data, null, 2),
    );

    return response.data;
  } catch (error: any) {
    console.error('[난이도 업데이트 API] 에러:', error);
    if (error.response) {
      console.error('[난이도 업데이트 API] 서버 응답:', {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw error;
  }
};
export const updateUserInterests = async (
  userId: number,
  interests: InterestCategory[],
): Promise<UpdateResponse> => {
  try {
    console.log('[관심분야 업데이트 API] 요청 시작');
    console.log('[관심분야 업데이트 API] userId:', userId);
    console.log('[관심분야 업데이트 API] interests:', interests);

    const response = await client.patch<UpdateResponse>(
      `/api/user/update/interest?userId=${userId}`,
      { interests },
    );

    console.log(
      '[관심분야 업데이트 API] 응답 성공:',
      JSON.stringify(response.data, null, 2),
    );

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
