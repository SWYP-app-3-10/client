# API 및 React Query 설정 가이드

## 설치

React Query를 설치해야 합니다:

```bash
npm install @tanstack/react-query
```

## 구조

```
src/
├── data/
│   └── mockData.ts          # 더미 데이터 및 타입 정의
├── api/
│   ├── missionApi.ts        # 미션 관련 API 함수
│   └── README.md            # 이 파일
├── hooks/
│   ├── useMissions.ts       # 미션 관련 React Query hooks
│   └── useArticles.ts       # 아티클 관련 React Query hooks
└── config/
    └── queryClient.ts       # QueryClient 설정
```

## 사용 방법

### 1. 더미 데이터 수정

`src/data/mockData.ts`에서 더미 데이터를 수정할 수 있습니다.

### 2. API 함수 수정

실제 API 연동 시 `src/api/missionApi.ts`의 함수들을 수정하세요:

```typescript
export const fetchMissions = async (): Promise<Mission[]> => {
  // 실제 API 호출로 변경
  const response = await fetch('https://api.example.com/missions');
  return response.json();
};
```

### 3. React Query Hooks 사용

컴포넌트에서 hooks를 사용하세요:

```typescript
import {useMissions} from '../../hooks/useMissions';
import {useArticles} from '../../hooks/useArticles';

const MyComponent = () => {
  const {data: missions, isLoading, error} = useMissions();
  const {data: articles} = useArticles();

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return <div>{/* ... */}</div>;
};
```

### 4. Mutation 사용

미션 진행도 업데이트 예시:

```typescript
import {useUpdateMissionProgress} from '../../hooks/useMissions';

const MyComponent = () => {
  const updateProgress = useUpdateMissionProgress();

  const handleUpdate = () => {
    updateProgress.mutate({
      missionId: 1,
      current: 2,
    });
  };

  return <button onClick={handleUpdate}>업데이트</button>;
};
```

## 테스트

더미 데이터는 API 호출을 시뮬레이션하기 위해 약간의 딜레이를 포함하고 있습니다:

- `fetchMissions`: 1초 딜레이
- `fetchArticles`: 800ms 딜레이
- `fetchMissionById`: 500ms 딜레이
- `updateMissionProgress`: 500ms 딜레이

실제 API 연동 시 이 딜레이를 제거하세요.
