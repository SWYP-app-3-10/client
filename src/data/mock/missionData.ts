/**
 * 미션 화면 더미 데이터
 * 실제 API 연동 전 테스트용
 */

export interface Mission {
  id: number;
  title: string;
  current: number;
  total: number;
  status: '진행 중' | '완료' | null;
}

export interface Article {
  contentId: number;
  title: string;
  content: string;
  contentCategory: string;
  categoryName: string;
  contentDate: string;
  hits: number;
  imageUrl: string;
}
