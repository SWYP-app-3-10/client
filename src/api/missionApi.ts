/**
 * 미션 관련 API 함수
 */

import client from './client';
import { Mission, mockMissions } from '../data/mock/missionData';
import { getUserInfo } from '../services/authService';

// API 응답 시뮬레이션을 위한 딜레이 함수 (개발용)
const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), ms));

/**
 * 오늘의 미션 목록 조회
 * @returns Promise<Mission[]>
 */
export const fetchMissions = async (): Promise<Mission[]> => {
  // 서버 API 호출 시도
  try {
    const userInfo = await getUserInfo();
    if (!userInfo) {
      throw new Error('사용자 정보가 없습니다');
    }

    const response = await client.get<Mission[]>(
      `/api/content/today/userId=${userInfo.userId}`,
    );
    return response.data;
  } catch (error) {
    console.error('미션 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 미션 조회
 * @param missionId 미션 ID
 * @returns Promise<Mission | null>
 */
export const fetchMissionById = async (
  missionId: number,
): Promise<Mission | null> => {
  try {
    // 서버 API 호출
    const response = await client.get<Mission>(`/missions/${missionId}`);
    return response.data;
  } catch (error) {
    console.error('미션 조회 실패, 더미 데이터 사용:', error);
    // 서버 연결 실패 시 자동으로 더미 데이터 반환
    await delay(150);
    const mission = mockMissions.find(m => m.id === missionId);
    return mission || null;
  }
};

/**
 * 미션 진행도 업데이트
 */
export const updateMissionProgress = async (
  _missionId: number,
  _current: number,
): Promise<Mission> => {
  // TODO: 미션 진행도 업데이트 API 구현
  throw new Error('Not implemented');
  // try {
  //   // 서버 API 호출
  //   const response = await client.patch<Mission>(`/missions/${missionId}`, {
  //     current,
  //   });
  //   return response.data;
  // } catch (error) {
  //   console.error('미션 진행도 업데이트 실패, 더미 데이터 사용:', error);
  //   // 서버 연결 실패 시 자동으로 더미 데이터 반환
  //   await delay(200);
  //   const mission = mockMissions.find(m => m.id === missionId);
  //   if (!mission) {
  //     throw new Error('Mission not found');
  //   }
  //   const updatedMission = { ...mission, current };
  //   return updatedMission;
  // }
};

/**
 * 글 상세 정보 - Content
 */
export interface ContentDetail {
  contentId: number;
  title: string;
  content: string;
  contentCategory: string;
  categoryName: string;
  contentDate: string;
  hits: number;
  imageUrl: string;
}

/**
 * 글 상세 정보 API 응답
 */
export interface ContentDetailResponse {
  status: number;
  message: string;
  data: ContentDetail;
}

/**
 * 글 상세 정보 조회
 * @param userId 사용자 ID (query parameter)
 * @param contentId 컨텐츠 ID (path parameter)
 * @returns Promise<ContentDetailResponse>
 */
export const fetchContentDetail = async (
  userId: number,
  contentId: number,
): Promise<ContentDetailResponse> => {
  try {
    const response = await client.get<ContentDetailResponse>(
      `/api/content/${contentId}?userId=${userId}`,
    );
    return response.data;
  } catch (error: any) {
    console.error('[글 상세 API] 에러:', error);
    if (error.response) {
      console.error('[글 상세 API] 서버 응답:', {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw error;
  }
};

/**
 * 글 접근 권한 확인 응답
 */
export interface ContentAccessResponse {
  accessType: string; // "POINT_USE" 등
  title: string;
  message: string;
  currentPoints: number;
  requiredPoints: number;
  lackOfPoints: number;
  rewardPoints: number;
  readable: boolean;
}

/**
 * 글 접근 권한 확인 API 응답
 */
export interface ContentAccessApiResponse {
  status: number;
  message: string;
  data: ContentAccessResponse;
}

/**
 * 글 접근 권한 확인
 * @param userId 사용자 ID (query parameter)
 * @param contentId 컨텐츠 ID (path parameter)
 * @returns Promise<ContentAccessApiResponse>
 */
export const fetchContentAccess = async (
  userId: number,
  contentId: number,
): Promise<ContentAccessApiResponse> => {
  try {
    const response = await client.get<ContentAccessApiResponse>(
      `/api/content/${contentId}/access?userId=${userId}`,
    );
    return response.data;
  } catch (error: any) {
    console.error('[글 접근 권한 API] 에러:', error);
    if (error.response) {
      console.error('[글 접근 권한 API] 서버 응답:', {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw error;
  }
};

/**
 * 포인트로 컨텐츠 구매 API 응답
 */
export interface PurchaseContentResponse {
  status: number;
  message: string;
  data: string;
}

/**
 * 포인트로 컨텐츠 구매
 * @param userId 사용자 ID (query parameter)
 * @param contentId 컨텐츠 ID (path parameter)
 * @returns Promise<PurchaseContentResponse>
 */
export const purchaseContentWithPoint = async (
  userId: number,
  contentId: number,
): Promise<PurchaseContentResponse> => {
  try {
    const response = await client.post<PurchaseContentResponse>(
      `/api/content/${contentId}/purchase/point?userId=${userId}`,
    );
    return response.data;
  } catch (error: any) {
    console.error('[포인트 구매 API] 에러:', error);
    if (error.response) {
      console.error('[포인트 구매 API] 서버 응답:', {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw error;
  }
};

/**
 * 광고 시청으로 컨텐츠 구매
 * @param userId 사용자 ID (query parameter)
 * @param contentId 컨텐츠 ID (path parameter)
 * @returns Promise<PurchaseContentResponse>
 */
export const purchaseContentWithAd = async (
  userId: number,
  contentId: number,
): Promise<PurchaseContentResponse> => {
  try {
    const response = await client.post<PurchaseContentResponse>(
      `/api/content/${contentId}/purchase/ad?userId=${userId}`,
    );
    return response.data;
  } catch (error: any) {
    console.error('[광고 구매 API] 에러:', error);
    if (error.response) {
      console.error('[광고 구매 API] 서버 응답:', {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw error;
  }
};

/**
 * 완독 여부 체크 - LevelUpInfo
 */
export interface LevelUpInfo {
  title: string;
  message: string;
  profileUrl: string;
  levelCode: string;
  characterName: string;
}

/**
 * 완독 여부 체크 응답
 */
export interface ReadStatusResponse {
  levelUpInfo?: LevelUpInfo;
  completed: boolean;
  levelUp: boolean;
}

/**
 * 완독 여부 체크 API 응답
 */
export interface ReadStatusApiResponse {
  status: number;
  message: string;
  data: ReadStatusResponse;
}

/**
 * 완독 여부 체크
 * @param userId 사용자 ID (query parameter)
 * @param contentId 컨텐츠 ID (path parameter)
 * @param staySeconds 체류 시간 (초)
 * @param isCompleted 완독 여부
 * @returns Promise<ReadStatusApiResponse>
 */
export const checkReadStatus = async (
  userId: number,
  contentId: number,
  staySeconds: number,
  isCompleted: boolean,
): Promise<ReadStatusApiResponse> => {
  try {
    const response = await client.post<ReadStatusApiResponse>(
      `/api/content/${contentId}/read-status?userId=${userId}`,
      {
        staySeconds,
        isCompleted,
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('[완독 체크 API] 에러:', error);
    if (error.response) {
      console.error('[완독 체크 API] 서버 응답:', {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw error;
  }
};

/**
 * 난이도 전송 API 응답
 */
export interface SubmitDifficultyResponse {
  status: number;
  message: string;
  data: string;
}

/**
 * 난이도 전송
 * @param userId 사용자 ID (query parameter)
 * @param contentId 컨텐츠 ID (path parameter)
 * @param difficulty 난이도 (EASY, MEDIUM, HARD) (query parameter)
 * @returns Promise<SubmitDifficultyResponse>
 */
export const submitDifficulty = async (
  userId: number,
  contentId: number,
  difficulty: 'EASY' | 'MEDIUM' | 'HARD',
): Promise<SubmitDifficultyResponse> => {
  try {
    const response = await client.post<SubmitDifficultyResponse>(
      `/api/content/${contentId}/difficulty?userId=${userId}&difficulty=${difficulty}`,
    );
    return response.data;
  } catch (error: any) {
    console.error('[난이도 전송 API] 에러:', error);
    if (error.response) {
      console.error('[난이도 전송 API] 서버 응답:', {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw error;
  }
};
