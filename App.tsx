import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen';
import RootNavigator from './src/navigation/RootNavigator';
import { queryClient } from './src/config/queryClient';
import { useOnboardingStore } from './src/store/onboardingStore';

const App = () => {
  const [isSplashLoading, setIsSplashLoading] = useState(true);
  const loadOnboardingStatus = useOnboardingStore(
    state => state.loadOnboardingStatus,
  );

  useEffect(() => {
    // 스플래시 화면에서 온보딩 완료 여부 확인
    const checkOnboardingStatus = async () => {
      try {
        // AsyncStorage에서 온보딩 완료 여부 확인
        await loadOnboardingStatus();
      } catch (error) {
        console.error('온보딩 상태 확인 중 오류:', error);
      } finally {
        // 스플래시 화면 표시 시간 (최소 1초)
        setTimeout(() => setIsSplashLoading(false), 1000);
      }
    };

    checkOnboardingStatus();
  }, [loadOnboardingStatus]);

  // 스플래시 로딩 중
  if (isSplashLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export default App;
