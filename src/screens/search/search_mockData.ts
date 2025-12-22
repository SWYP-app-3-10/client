// 카테고리 타입
// eslint-disable-next-line prettier/prettier
export type NewsCategory =
  | '정치'
  | '경제'
  | '사회'
  | '생활/문화'
  | 'IT/과학'
  | '세계';

export interface NewsItems {
  id: string;
  category: NewsCategory;
  title: string;
  subtitle: string;
  readTime: string; // ex: "5분 소요"
  content: string;
}

// 뉴스 더미 데이터
export const MOCK_NEWS: NewsItems[] = [
  {
    id: '1',
    category: '경제',
    title: '록히드 마틴, F-35 11억 4천만 계약',
    subtitle: '미중러 열강 갈등 심화, 낙관적 전망',
    readTime: '5분 소요',
    content:
      '록히드 마틴이 F-35 전투기 관련 총 11억 4천만 달러 규모의 대형 계약을 추가로 확보하면서 글로벌 방산 산업에 다시 한 번 강한 신호를 보냈다. 이번 계약은 단순한 무기 판매를 넘어, 미·중·러를 축으로 한 패권 경쟁이 얼마나 구조적으로 고착화되고 있는지를 보여주는 상징적 사건이다. 미국은 동맹국 중심의 군사 블록화를 강화하고 있고, 중국과 러시아는 이에 대응해 군사력 현대화와 전략무기 개발에 막대한 자금을 투입하고 있다. 이처럼 충돌 가능성이 상존하는 국제 질서 속에서 각 국가는 ‘전쟁 억지’를 명분으로 군사 예산을 더욱 확대하고 있으며, 그 수혜는 자연스럽게 글로벌 방산 기업들로 향한다.아이러니하게도 국제 정세의 불안은 금융시장에서는 불확실성이지만, 방산 업종에는 오히려 ‘확실한 수요’로 작용한다. 미·중·러 간 갈등이 단기간에 완화될 가능성은 크지 않으며, 우주·사이버·무인 전력까지 경쟁 영역이 확장되는 흐름도 뚜렷하다. 이러한 구조 속에서 록히드 마틴을 비롯한 글로벌 방산 기업들의 중장기 전망은 당분간 낙관적인 흐름을 이어갈 가능성이 높다. 전쟁을 원치 않는 국제 사회의 역설적인 선택이, 결국 더 많은 무기와 더 강한 군사력을 요구하고 있는 셈이다.',
  },
  {
    id: '2',
    category: '경제',
    title: '경제2-건설 투자가 멈춘 나라에서, 공간은 어떻게 경제를 버틸까',
    subtitle: '경제2-subtitle',
    readTime: '10분 소요',
    content: '경제2-content',
  },
  {
    id: '3',
    category: '정치',
    title: '정치1-title',
    subtitle: '정치1-subtitle',
    readTime: '3분 소요',
    content: '정치1-content',
  },
  {
    id: '4',
    category: '정치',
    title: '정치2-title',
    subtitle: '정치2-subtitle',
    readTime: '3분 소요',
    content: '정치2-content',
  },
  {
    id: '5',
    category: '사회',
    title: '사회1-title',
    subtitle: '사회1-subtitle',
    readTime: '3분 소요',
    content: '사회1-content',
  },
  {
    id: '6',
    category: '사회',
    title: '사회2-title',
    subtitle: '사회2-subtitle',
    readTime: '3분 소요',
    content: '사회2-content',
  },
  {
    id: '7',
    category: '생활/문화',
    title: '생활문화1-title',
    subtitle: '생활문화1-subtitle',
    readTime: '3분 소요',
    content: '생활문화1-content',
  },
  {
    id: '8',
    category: '생활/문화',
    title: '생활문화2-title',
    subtitle: '생활문화2-subtitle',
    readTime: '3분 소요',
    content: '생활문화2-content',
  },
  {
    id: '9',
    category: 'IT/과학',
    title: 'IT과학1-title',
    subtitle: 'IT과학1-subtitle',
    readTime: '3분 소요',
    content: 'IT과학1-content',
  },
  {
    id: '10',
    category: 'IT/과학',
    title: 'IT과학2-title',
    subtitle: 'IT과학2-subtitle',
    readTime: '3분 소요',
    content: 'IT과학2-content',
  },
  {
    id: '11',
    category: '세계',
    title: '세계1-title',
    subtitle: '세계1-subtitle',
    readTime: '3분 소요',
    content: '세계1-content',
  },
  {
    id: '12',
    category: '세계',
    title: '세계2-title',
    subtitle: '세계2-subtitle',
    readTime: '3분 소요',
    content: '세계2-content',
  },
];
