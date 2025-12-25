/**
 * 퀴즈 더미 데이터
 * 실제 API 연동 전 테스트용
 * 서버에서 받을 데이터 구조를 참고하여 작성
 */

export interface QuizOption {
  id: number;
  text: string;
}

export interface Quiz {
  id: number;
  question: string;
  options: QuizOption[];
  correctAnswerId: number; // 정답 option id
}

// 퀴즈 더미 데이터
export const mockQuiz: Quiz = {
  id: 1,
  question: '제트기류 변화가 중요한 이유로\n가장 적절한 설명은 무엇인가?',
  options: [
    {
      id: 1,
      text: '전 세계 기온을 즉시 변화시키기 때문이다',
    },
    {
      id: 2,
      text: '지역별 기상 변동성을 높여 예측 정확도를 낮출 수 있기 때문이다',
    },
    {
      id: 3,
      text: '지역별 기상 변동성을 높여 예측 정확도를 낮출 수 있기 때문이다',
    },
  ],
  correctAnswerId: 1,
};
