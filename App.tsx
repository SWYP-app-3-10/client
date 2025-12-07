import React, {useState, useEffect} from 'react';
import SplashScreen from './src/screens/SplashScreen';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  // TODO: 실제 인증 및 온보딩 상태 관리로 교체 필요
  const [isAuthenticated] = useState(false);
  const [isOnboardingCompleted] = useState(false);
  const [isSplashLoading, setIsSplashLoading] = useState(true);

  useEffect(() => {
    // 스플래시 화면에서 인증 상태 및 온보딩 완료 여부 확인
    // TODO: AsyncStorage 또는 서버에서 상태 확인
    // 예시:
    // checkAuthStatus().then(auth => setIsAuthenticated(auth));
    // checkOnboardingStatus().then(completed => setIsOnboardingCompleted(completed));
    setTimeout(() => setIsSplashLoading(false), 2000); // 임시
  }, []);

  // 스플래시 로딩 중
  if (isSplashLoading) {
    return <SplashScreen />;
  }

  return (
    <RootNavigator
      isAuthenticated={isAuthenticated}
      isOnboardingCompleted={isOnboardingCompleted}
    />
  );
};

export default App;
