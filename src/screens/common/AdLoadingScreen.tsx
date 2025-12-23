import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRewardedAd, TestIds } from 'react-native-google-mobile-ads';
import { COLORS } from '../../styles/global';
import { FullScreenStackParamList } from '../../navigation/types';
import { RouteNames } from '../../../routes';
import { Alert } from 'react-native';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy';

type NavigationProp = NativeStackNavigationProp<FullScreenStackParamList>;

const AdLoadingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();

  const articleId = (route.params as FullScreenStackParamList['ad-loading'])
    ?.articleId as number;
  const returnTo = (route.params as FullScreenStackParamList['ad-loading'])
    ?.returnTo;
  const { isLoaded, isClosed, load, show, reward } = useRewardedAd(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  const [isAdShowing, setIsAdShowing] = useState(false);
  const [hasEarnedReward, setHasEarnedReward] = useState(false);

  // 보상 감지
  useEffect(() => {
    if (reward) {
      setHasEarnedReward(true);
    }
  }, [reward]);

  // 화면 진입 시 광고 로드
  useEffect(() => {
    if (!isLoaded) {
      load();
    }
  }, [isLoaded, load]);

  // 광고 로드 완료 후 자동 표시
  useEffect(() => {
    if (isLoaded && !isAdShowing) {
      setIsAdShowing(true);
      setHasEarnedReward(false);
      try {
        show();
      } catch (error) {
        console.error('광고 표시 실패:', error);
        Alert.alert('오류', '광고를 표시할 수 없습니다.');
        navigation.goBack();
      }
    }
  }, [isLoaded, isAdShowing, show, navigation]);

  // 광고 닫힘 처리
  useEffect(() => {
    if (isClosed && isAdShowing) {
      if (hasEarnedReward) {
        navigation.replace(RouteNames.ARTICLE_DETAIL, {
          articleId,
          returnTo,
        });
      } else {
        // 보상 미지급 - 알림 후 뒤로가기
        Alert.alert(
          '알림',
          '광고를 끝까지 시청해야 포인트를 받을 수 있습니다.',
          [
            {
              text: '확인',
              onPress: () => {
                navigation.goBack();
              },
            },
          ],
        );
      }
    }
  }, [isClosed, isAdShowing, hasEarnedReward, articleId, navigation, returnTo]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.puple.main} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdLoadingScreen;
