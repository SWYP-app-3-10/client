import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getApp, initializeApp, getApps } from '@react-native-firebase/app';
import SplashScreen from './src/screens/SplashScreen';
import RootNavigator from './src/navigation/RootNavigator';
import { queryClient } from './src/config/queryClient';
import { useOnboardingStore } from './src/store/onboardingStore';

const App = () => {
  const [isSplashLoading, setIsSplashLoading] = useState(true);
  const loadOnboardingStatus = useOnboardingStore(
    state => state.loadOnboardingStatus,
  );

  // Firebase 초기화
  useEffect(() => {
    try {
      // 이미 초기화된 앱이 있는지 확인
      const apps = getApps();
      if (apps.length === 0) {
        // 초기화되지 않았다면 GoogleService-Info.plist의 값으로 초기화
        const firebaseConfig = {
          apiKey: 'AIzaSyBW0P43--sWylkopx3bXhY3JDZVd6CWc2c',
          projectId: 'neurous-b290f',
          storageBucket: 'neurous-b290f.firebasestorage.app',
          messagingSenderId: '1081679299790',
          appId: '1:1081679299790:ios:454610318b56c75388fc9f',
          databaseURL: 'https://neurous-b290f-default-rtdb.firebaseio.com',
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
