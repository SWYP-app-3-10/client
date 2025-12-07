# 뇌세포

뇌세포 모바일 애플리케이션 클라이언트 레포지토리입니다.

## 기술 스택

- **React Native** 0.73.6
- **TypeScript** 5.0.4
- **React Navigation** 6.x
  - `@react-navigation/native`
  - `@react-navigation/native-stack`
- **Node.js** >= 18

## 프로젝트 구조

```
src/
├── navigation/           # 네비게이션 설정
│   ├── RootNavigator.tsx
│   ├── MainStackNavigator.tsx
│   ├── MissionStackNavigator.tsx
│   ├── CharacterStackNavigator.tsx
│   ├── SearchStackNavigator.tsx
│   ├── MyPageStackNavigator.tsx
│   ├── OnboardingNavigator.tsx
│   └── types.ts          # 네비게이션 타입 정의
├── screens/             # 화면 컴포넌트
│   ├── auth/            # 인증 관련 화면
│   ├── onboarding/      # 온보딩 화면
│   └── main/            # 메인 화면
├── components/          # 공통 컴포넌트
└── utils/               # 유틸리티 함수
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
```

## 개발

### 코드 스타일

커밋 전에 반드시 린트를 실행하여 코드 스타일을 확인하세요.
```
# 린트 실행 (코드 스타일 검사)
npm run lint

# 자동 수정 가능한 문제 자동 수정
npm run lint -- --fix
```
### 라우트 관리

라우트 이름은 `routes.ts`에서 관리하며, 네비게이션 파라미터 타입은 `src/navigation/types.ts`에서 정의합니다.
