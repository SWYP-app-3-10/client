import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeApp } from '@react-native-firebase/app';
import SplashScreen from './src/screens/SplashScreen';
import RootNavigator from './src/navigation/RootNavigator';
import { queryClient } from './src/config/queryClient';
import { useOnboardingStore } from './src/store/onboardingStore';
import { usePointStore } from './src/store/pointStore';
import { useExperienceStore } from './src/store/experienceStore';
import { Platform } from 'react-native';

const App = () => {
  const [isSplashLoading, setIsSplashLoading] = useState(true);
  const loadOnboardingStatus = useOnboardingStore(
    state => state.loadOnboardingStatus,
  );
  const loadPoints = usePointStore(state => state.loadPoints);
  const loadExperience = useExperienceStore(state => state.loadExperience);

  // Firebase 초기화
  useEffect(() => {
    if (Platform.OS === 'ios') {
      const firebaseConfig = {
        apiKey: 'AIzaSyBW0P43--sWylkopx3bXhY3JDZVd6CWc2c',
        projectId: 'neurous-b290f',
        storageBucket: 'neurous-b290f.firebasestorage.app',
        messagingSenderId: '1081679299790',
        appId: '1:1081679299790:ios:454610318b56c75388fc9f',
        databaseURL: 'https://neurous-b290f-default-rtdb.firebaseio.com',
      };
      initializeApp(firebaseConfig);
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
