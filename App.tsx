import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getApp, initializeApp, getApps } from '@react-native-firebase/app';
import SplashScreen from './src/screens/SplashScreen';
import RootNavigator from './src/navigation/RootNavigator';
import { queryClient } from './src/config/queryClient';
import { useOnboardingStore } from './src/store/onboardingStore';
import { usePointStore } from './src/store/pointStore';
import { useExperienceStore } from './src/store/experienceStore';

const App = () => {
  const [isSplashLoading, setIsSplashLoading] = useState(true);
  const loadOnboardingStatus = useOnboardingStore(
    state => state.loadOnboardingStatus,
  );
  const loadPoints = usePointStore(state => state.loadPoints);
  const loadExperience = useExperienceStore(state => state.loadExperience);

  // Firebase 초기화
  useEffect(() => {
    try {
      // 이미 초기화된 앱이 있는지 확인
      const apps = getApps();
      if (apps.length === 0) {
        // 초기화되지 않았다면 GoogleService-Info.plist의 값으로 초기화
        const firebaseConfig = {
          apiKey: 'AIzaSyCvW-xajcxIsfsKoc96vnvOL1ihSn-3A0E',
          projectId: 'neurous-d632a',
          storageBucket: 'neurous-d632a.firebasestorage.app',
          messagingSenderId: '424320333528',
          appId: '1:424320333528:ios:980dd3a741185e3a48c9ad',
          databaseURL: 'https://neurous-d632a-default-rtdb.firebaseio.com',
        };
        initializeApp(firebaseConfig);
      } else {
        // 이미 초기화되어 있다면 확인만
        getApp();
      }
    } catch (error) {
      console.error('Firebase 초기화 오류:', error);
    }
  }, []);

  useEffect(() => {
    // 스플래시 화면에서 온보딩 완료 여부 및 포인트/경험치 로드
    const initializeAppData = async () => {
      try {
        // 병렬로 모든 초기화 작업 수행
        await Promise.all([
          loadOnboardingStatus(),
          loadPoints(),
          loadExperience(),
        ]);
        console.log('[App] 앱 초기화 완료 - 포인트/경험치 로드됨');
      } catch (error) {
        console.error('앱 초기화 중 오류:', error);
      } finally {
        // 스플래시 화면 표시 시간 (최소 1초)
        setTimeout(() => setIsSplashLoading(false), 1000);
      }
    };

    initializeAppData();
  }, [loadOnboardingStatus, loadPoints, loadExperience]);

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
