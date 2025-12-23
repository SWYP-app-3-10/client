# neurous

뉴로스 모바일 애플리케이션 클라이언트 레포지토리입니다.

## 기술 스택

- **React Native** 0.73.6
- **TypeScript** 5.0.4
- **React Navigation** 6.x
  - `@react-navigation/native`
  - `@react-navigation/native-stack`
  - `@react-navigation/bottom-tabs`
- **Zustand** 5.0.9 - 전역 상태 관리
- **Node.js** >= 18
- **State Management (Server)**
  - `@tanstack/react-query` v5
- **Networking**
  - `axios`

## 프로젝트 구조

```
src/
├── api/                  # Axios 인스턴스 및 API 호출 함수
├── hooks/
│   └── queries/          # React Query 커스텀 훅 (useQuery, useMutation)
├── navigation/           # 네비게이션 설정
│   ├── RootNavigator.tsx
│   ├── MainTabNavigator.tsx
│   ├── MissionStackNavigator.tsx
│   ├── CharacterStackNavigator.tsx
│   ├── SearchStackNavigator.tsx
│   ├── MyPageStackNavigator.tsx
│   ├── OnboardingNavigator.tsx
│   └── types.ts          # 네비게이션 타입 정의
├── screens/             # 화면 컴포넌트
│   ├── auth/            # 인증 관련 화면
│   ├── onboarding/      # 온보딩 화면
│   ├── main/            # 메인 화면 (각 탭의 메인 화면)
│   ├── common/          # 공통 화면 (여러 탭에서 사용)
│   │   ├── ArticleDetailScreen.tsx
│   │   └── NotificationScreen.tsx
│   ├── character/       # 캐릭터 탭 관련 하위 화면
│   └── search/          # 검색 탭 관련 화면
├── components/          # 공통 컴포넌트
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── NotificationModal.tsx
│   └── ...
├── store/               # Zustand 상태 관리
│   ├── modalStore.ts    # 전역 모달 상태
│   ├── onboardingStore.ts  # 온보딩 상태
│   ├── authStore.ts    # 인증 상태
│   └── pointStore.ts   # 포인트 상태
├── services/            # 서비스 레이어 (로컬/서버 데이터 처리)
│   ├── authService.ts
│   ├── authStorageService.ts
│   ├── socialLoginService.ts
│   └── pointService.ts
└── styles/              # 스타일 정의
    ├── global.ts
    └── typography.ts
```

## 네비게이션 구조

```
스플래시
  ↓
로그인 (소셜 로그인)
  ↓
온보딩
  ├─ 난이도 설정
  └─ 관심분야 설정
  ↓
메인 스택
  ├─ 미션 스택
  ├─ 캐릭터 스택
  ├─ 검색 스택
  └─ 마이페이지 스택
  ↓
전체 화면 스택 (탭바 없는 화면)
  ├─ 기사 상세 (ARTICLE_DETAIL)
  └─ 알림 (CHARACTER_NOTIFICATION)
```

## 상태 관리 (Zustand)

프로젝트는 **Zustand**를 사용하여 전역 상태를 관리합니다. Context API 대신 Zustand를 선택한 이유는 다음과 같습니다:

- **성능 최적화**: Selector 기반 구독으로 불필요한 리렌더링 최소화
- **간결한 API**: Provider 불필요, 보일러플레이트 최소화
- **유연성**: 컴포넌트 외부에서도 사용 가능

### Store 목록

#### 1. ModalStore (`src/store/modalStore.ts`)

전역 모달 상태 관리

```typescript
import { useShowModal } from '../store/modalStore';

const MyComponent = () => {
  const showModal = useShowModal();

  const handleClick = () => {
    showModal({
      title: '알림',
      description: '알림 내용입니다.',
      primaryButton: {
        title: '확인',
        onPress: () => {
          console.log('확인 클릭');
        },
      },
      secondaryButton: {
        title: '취소',
        onPress: () => {
          console.log('취소 클릭');
        },
      },
    });
  };
};
```

#### 2. OnboardingStore (`src/store/onboardingStore.ts`)

온보딩 완료 상태 관리

```typescript
import {
  useCompleteOnboarding,
  useIsOnboardingCompleted,
} from '../store/onboardingStore';

const MyScreen = () => {
  const isOnboardingCompleted = useIsOnboardingCompleted();
  const completeOnboarding = useCompleteOnboarding();

  const handleComplete = () => {
    completeOnboarding(); // 온보딩 완료 처리
  };
};
```

#### 3. AuthStore (`src/store/authStore.ts`)

인증 상태 및 사용자 정보 관리

```typescript
import { useIsAuthenticated, useUser, useAuthStore } from '../store/authStore';

const MyComponent = () => {
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const setUser = useAuthStore(state => state.setUser);

  const handleLogin = async () => {
    // 로그인 로직
    setUser({
      id: '123',
      name: '홍길동',
      email: 'user@example.com',
      profileImage: 'https://...',
    });
  };
};
```

## 전역 모달 시스템

프로젝트는 전역 모달 시스템을 제공합니다. 어디서든 `useShowModal` 훅을 사용하여 모달을 표시할 수 있습니다.

### 사용 예제

```typescript
import { useShowModal } from '../store/modalStore';

const MyScreen = () => {
  const showModal = useShowModal();

  // 단일 버튼 모달
  const showSimpleModal = () => {
    showModal({
      title: '작업 완료',
      description: '모든 변경사항이 저장되었습니다.',
      primaryButton: {
        title: '확인',
        onPress: () => console.log('확인'),
      },
    });
  };

  // 이중 버튼 모달
  const showConfirmModal = () => {
    showModal({
      title: '삭제하시겠습니까?',
      description: '이 작업은 되돌릴 수 없습니다.',
      primaryButton: {
        title: '삭제',
        onPress: () => console.log('삭제'),
      },
      secondaryButton: {
        title: '취소',
        onPress: () => console.log('취소'),
      },
    });
  };

  // 이미지가 있는 모달
  const showImageModal = () => {
    showModal({
      title: '이미지 모달',
      image: <MyIcon />,
      primaryButton: {
        title: '확인',
        onPress: () => console.log('확인'),
      },
    });
  };

  // 커스텀 컨텐츠가 있는 모달
  const showCustomModal = () => {
    showModal({
      title: '포인트 사용',
      primaryButton: {
        title: '사용하기',
        onPress: () => console.log('사용'),
      },
      children: (
        <View>
          <Text>포인트 100p</Text>
        </View>
      ),
    });
  };
};
```

## 개발

### 설치

```bash
# 의존성 설치
npm install

# iOS (CocoaPods 설치 필요)
cd ios && pod install && cd ..
```

### 실행

```bash
# Metro 번들러 시작
npm start

# iOS 실행
npm run ios

# Android 실행
npm run android
```

### 코드 스타일

커밋 전에 반드시 린트를 실행하여 코드 스타일을 확인하세요.

```bash
# 린트 실행 (코드 스타일 검사)
npm run lint

# 자동 수정 가능한 문제 자동 수정
npm run lint -- --fix
```

### 라우트 관리

라우트 이름은 `routes.ts`에서 관리하며, 네비게이션 파라미터 타입은 `src/navigation/types.ts`에서 정의합니다.

## 주요 기능

- ✅ 소셜 로그인 (Google, Kakao, Naver, Apple)
- ✅ 온보딩 플로우
- ✅ 전역 모달 시스템
- ✅ Zustand 기반 상태 관리
- ✅ TypeScript 지원
- ✅ React Navigation 기반 네비게이션
- ✅ 포인트 시스템 (기사 읽기, 광고 시청)
- ✅ 리워드 광고 연동 (Google Mobile Ads)
- ✅ 공통 화면 (기사 상세, 알림)

## 라이선스

Private
