import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRewardedAd, TestIds } from 'react-native-google-mobile-ads';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../navigation/types';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

const REWARDScreen = () => {
  const { isLoaded, isClosed, load, show, reward } = useRewardedAd(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });
  const navigation = useNavigation<NavigationProp>();
  const [coins, setCoins] = useState(0);

  //  상태 관리 변수들
  const [isAdShowing, setIsAdShowing] = useState(false); // 내가 버튼을 눌렀는가?
  const [hasEarnedReward, setHasEarnedReward] = useState(false); // 보상 자격을 얻었는가?

  // 1. 화면 포커스 관리 (들어오면 로드, 나가면 초기화)
  useFocusEffect(
    useCallback(() => {
      if (!isLoaded) {
        load();
      }
      return () => {
        setIsAdShowing(false);
        setHasEarnedReward(false);
      };
    }, [load, isLoaded]),
  );

  // 2. [변경] 보상 감지 리스너 (여기선 알림 안 띄움! 기록만 함)
  useEffect(() => {
    if (reward) {
      setHasEarnedReward(true);
    }
  }, [reward]);

  // 3. [변경] 광고 닫힘 리스너 (여기서 최종 정산!)
  useEffect(() => {
    if (isClosed) {
      console.log('🚪 광고 창 닫힘. 정산 시작.');

      // 버튼을 눌러서 광고를 본 경우에만 정산 진행
      if (isAdShowing) {
        if (hasEarnedReward) {
          // 성공: 보상 자격(hasEarnedReward)이 있을 때
          setCoins(current => current + 2);
          Alert.alert('축하합니다!', '2코인이 지급되었습니다! 🪙');
        } else {
          // 실패: 광고는 봤는데 보상 자격이 없을 때 (중간에 닫음)
          Alert.alert(
            '아쉬워요',
            '광고를 끝까지 보셔야 코인을 받을 수 있어요.',
          );
        }
      }

      // 🧹 다음을 위해 모든 상태 초기화 및 재장전
      setIsAdShowing(false);
      setHasEarnedReward(false);
      load();
    }
  }, [isClosed, load, isAdShowing, hasEarnedReward]);

  // 4. 버튼 클릭
  const handleShowAd = () => {
    if (isLoaded) {
      setIsAdShowing(true); // "자, 광고 보러 갑니다"
      setHasEarnedReward(false); // 혹시 모를 이전 기록 삭제
      show();
    } else {
      Alert.alert('잠시만요', '광고를 불러오는 중입니다...');
      load();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 50,
          left: 20,
          padding: 10,
          backgroundColor: '#ddd',
          borderRadius: 8,
          zIndex: 1,
        }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text>뒤로가기</Text>
      </TouchableOpacity>

      <Text style={styles.title}>📺 무료 충전소</Text>

      <View style={styles.coinBox}>
        <Text style={styles.coinText}>현재 코인: {coins} 🪙</Text>
      </View>

      <Text style={styles.description}>
        광고를 끝까지 시청하면{'\n'}코인을 드려요!
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title={isLoaded ? '광고 보고 코인 받기' : '광고 로딩 중...'}
          onPress={handleShowAd}
          disabled={!isLoaded}
          color="#6200EE"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  coinBox: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  coinText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 250,
  },
});

export default REWARDScreen;
