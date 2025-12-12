import React, { useState, useEffect } from 'react';
import SplashScreen from './src/screens/SplashScreen';
import RootNavigator from './src/navigation/RootNavigator';
import { OnboardingProvider } from './src/context/OnboardingContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const App = () => {
  const [isAuthenticated] = useState(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isSplashLoading, setIsSplashLoading] = useState(true);
  const queryClient = new QueryClient();

  const handleCompleteOnboarding = () => {
    console.log('온보딩 완료! 메인 화면으로 전환합니다.');
    setIsOnboardingCompleted(true);
  };
  useEffect(() => {
    // 스플래시 화면에서 인증 상태 및 온보딩 완료 여부 확인
    // TODO: AsyncStorage 또는 서버에서 상태 확인

    setTimeout(() => setIsSplashLoading(false), 2000); // 임시
  }, []);

  // 스플래시 로딩 중
  if (isSplashLoading) {
    return <SplashScreen />;
  }

  return (
    <OnboardingProvider completeOnboarding={handleCompleteOnboarding}>
      <QueryClientProvider client={queryClient}>
        <RootNavigator
          isAuthenticated={isAuthenticated}
          isOnboardingCompleted={isOnboardingCompleted}
        />
      </QueryClientProvider>
    </OnboardingProvider>
  );
};

export default App;
