// 읽은 글 데이터 타입
export interface ReadArticle {
  id: number;
  title: string;
  category: string;
  quizResult: 'correct' | 'incorrect';
  readDate: string; // YYYY-MM-DD 형식
}

// 날짜별로 그룹화된 읽은 글 데이터
export interface ReadArticlesByDate {
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // "수요일"
  count: number;
  articles: ReadArticle[];
}

// Mock 데이터
export const readArticlesMock: ReadArticlesByDate[] = [
  {
    date: '2024-12-03',
    dayOfWeek: '수요일',
    count: 7,
    articles: [
      {
        id: 1,
        title:
          '검찰청 폐지 후 들어설 중수청, 검사 0.8% 만 근무 희망 검찰청 폐지 후 검찰청 폐지 후',
        category: '경제',
        quizResult: 'correct',
        readDate: '2024-12-03',
      },
      {
        id: 2,
        title:
          '검찰청 폐지 후 들어설 중수청, 검사 0.8% 만 근무 희망 검찰청 폐지 후 검찰청 폐지 후',
        category: '경제',
        quizResult: 'correct',
        readDate: '2024-12-03',
      },
      {
        id: 3,
        title:
          '검찰청 폐지 후 들어설 중수청, 검사 0.8% 만 근무 희망 검찰청 폐지 후 검찰청 폐지 후',
        category: '경제',
        quizResult: 'correct',
        readDate: '2024-12-03',
      },
      {
        id: 4,
        title:
          '검찰청 폐지 후 들어설 중수청, 검사 0.8% 만 근무 희망 검찰청 폐지 후 검찰청 폐지 후',
        category: '경제',
        quizResult: 'correct',
        readDate: '2024-12-03',
      },
      {
        id: 5,
        title:
          '검찰청 폐지 후 들어설 중수청, 검사 0.8% 만 근무 희망 검찰청 폐지 후 검찰청 폐지 후',
        category: '경제',
        quizResult: 'incorrect',
        readDate: '2024-12-03',
      },
    ],
  },
  {
    date: '2024-12-04',
    dayOfWeek: '목요일',
    count: 4,
    articles: [
      {
        id: 6,
        title:
          '검찰청 폐지 후 들어설 중수청, 검사 0.8% 만 근무 희망 검찰청 폐지 후 검찰청 폐지 후',
        category: '경제',
        quizResult: 'correct',
        readDate: '2024-12-04',
      },
      {
        id: 7,
        title:
          '검찰청 폐지 후 들어설 중수청, 검사 0.8% 만 근무 희망 검찰청 폐지 후 검찰청 폐지 후',
        category: '경제',
        quizResult: 'correct',
        readDate: '2024-12-04',
      },
      {
        id: 8,
        title:
          '검찰청 폐지 후 들어설 중수청, 검사 0.8% 만 근무 희망 검찰청 폐지 후 검찰청 폐지 후',
        category: '경제',
        quizResult: 'correct',
        readDate: '2024-12-04',
      },
      {
        id: 9,
        title:
          '검찰청 폐지 후 들어설 중수청, 검사 0.8% 만 근무 희망 검찰청 폐지 후 검찰청 폐지 후',
        category: '경제',
        quizResult: 'incorrect',
        readDate: '2024-12-04',
      },
    ],
  },
];
