import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

/**
 * 광고 설정
 * - 광고 단위 ID는 여기서 관리
 */

// 리워드 광고 단위 ID
export const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : Platform.select({
      android: 'ca-app-pub-2195740935444660/8657864344',
      ios: 'ca-app-pub-2195740935444660/8267622737',
    }) || TestIds.REWARDED;

// TODO: 다른 광고 타입도 필요하면 추가
// export const BANNER_AD_UNIT_ID = ...
// export const INTERSTITIAL_AD_UNIT_ID = ...
