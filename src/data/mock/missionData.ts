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
  id: number;
  title: string;
  category: string;
  readTime: string;
  date: string;
  imageUrl?: string;
}

// 미션 더미 데이터
export const mockMissions: Mission[] = [
  {
    id: 1,
    title: '경제 분야 글 3개 읽기',
    current: 3,
    total: 3,
    status: '완료',
  },
  {
    id: 2,
    title: '과학 분야 글 5개 읽기',
    current: 3,
    total: 5,
    status: '진행 중',
  },
  {
    id: 3,
    title: '기술 분야 글 2개 읽기',
    current: 0,
    total: 2,
    status: null,
  },
  {
    id: 4,
    title: '문화 분야 글 4개 읽기',
    current: 4,
    total: 4,
    status: '완료',
  },
  {
    id: 5,
    title: '정치 분야 글 3개 읽기',
    current: 1,
    total: 3,
    status: '진행 중',
  },
];

// 아티클 더미 데이터
export const mockArticles: Article[] = [
  {
    id: 1,
    title:
      '록히드 마틴, F-35 11억 4천만 계약 미중러 열강 갈등심화, 낙관적 전망',
    category: '경제',
    readTime: '5분',
    date: '2025.12.25',
    imageUrl:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
  },
  {
    id: 2,
    title:
      '록히드 마틴, F-35 11억 4천만 계약 미중러 열강 갈등심화, 낙관적 전망',
    category: '경제',
    readTime: '5분',
    date: '2025.12.25',
    imageUrl:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    title:
      '록히드 마틴, F-35 11억 4천만 계약 미중러 열강 갈등심화, 낙관적 전망',
    category: '경제',
    readTime: '5분',
    date: '2025.12.25',
    imageUrl:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
  },
];
