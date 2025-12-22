import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import SplashScreen from './src/screens/SplashScreen';
import RootNavigator from './src/navigation/RootNavigator';
import { queryClient } from './src/config/queryClient';
import { checkAuthStatus } from './src/services/authService';
import { useOnboardingStore } from './src/store/onboardingStore';

const App = () => {
  const [isSplashLoading, setIsSplashLoading] = useState(true);
  const completeOnboarding = useOnboardingStore(
    state => state.completeOnboarding,
  );

  useEffect(() => {
    // 스플래시 화면에서 인증 상태 및 온보딩 완료 여부 확인
    const checkAuthAndOnboarding = async () => {
      try {
        // 인증 상태 확인 (로컬 스토리지 + 서버 API 검증)
        const authStatus = await checkAuthStatus();

        // 인증된 사용자가 있으면 온보딩 완료 처리 (자동 로그인)
        if (authStatus.isAuthenticated) {
          completeOnboarding();
        }
      } catch (error) {
        console.error('인증 상태 확인 중 오류:', error);
      } finally {
        // 스플래시 화면 표시 시간 (최소 1초)
        setTimeout(() => setIsSplashLoading(false), 1000);
      }
    };

    checkAuthAndOnboarding();
  }, [completeOnboarding]);

  // 스플래시 로딩 중
  if (isSplashLoading) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  );
};

export default App;
