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
      android: 'ca-app-pub-5312046759396775/6312225428',
      ios: 'ca-app-pub-5312046759396775/2738784252',
    }) || TestIds.REWARDED;
