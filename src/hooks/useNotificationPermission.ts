import { useState, useCallback } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import {
  checkNotifications,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';

interface UseNotificationPermissionOptions {
  onSettingsOpened?: () => void;
}

export const useNotificationPermission = (
  options?: UseNotificationPermissionOptions,
) => {
  const [isChecking, setIsChecking] = useState(false);
  const { onSettingsOpened } = options || {};

  const checkPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await checkNotifications();
      return status !== RESULTS.GRANTED;
    } catch (error) {
      console.error('알림 권한 확인 중 오류:', error);
      return true;
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const { status } = await requestNotifications([
        'alert',
        'badge',
        'sound',
      ]);

      if (status === RESULTS.GRANTED) {
        const { settings } = await checkNotifications();
        const isNotificationEnabled =
          Platform.OS === 'ios'
            ? settings?.alert === true || settings?.notificationCenter === true
            : true;

        if (Platform.OS === 'ios' && !isNotificationEnabled) {
          Alert.alert(
            '알림 설정 필요',
            '기기 알림이 꺼져있어요.\n설정에서 알림을 켜주세요.',
            [
              {
                text: '취소',
                style: 'cancel',
              },
              {
                text: '설정으로 이동',
                onPress: async () => {
                  try {
                    onSettingsOpened?.();
                    await Linking.openSettings();
                  } catch (error) {
                    console.error('설정 열기 실패:', error);
                    // 최종 fallback
                    try {
                      await Linking.openSettings();
                    } catch (err) {
                      console.error('설정 열기 실패 (fallback):', err);
                    }
                  }
                },
              },
            ],
          );
          return false;
        }

        return true;
      } else if (status === RESULTS.BLOCKED) {
        Alert.alert(
          "'뉴로스'에서 알림을 보내고자 합니다.",
          '경고, 사운드 및 아이콘 배지가 알림에 포함될 수 있습니다. 설정에서 이를 구성할 수 있습니다',
          [
            {
              text: '취소',
              style: 'cancel',
            },
            {
              text: '설정으로 이동',
              onPress: async () => {
                try {
                  onSettingsOpened?.();
                  await Linking.openSettings();
                } catch (error) {
                  console.error('설정 열기 실패:', error);
                  // 최종 fallback
                  try {
                    await Linking.openSettings();
                  } catch (err) {
                    console.error('설정 열기 실패 (fallback):', err);
                  }
                }
              },
            },
          ],
        );
        return false;
      }

      return false;
    } catch (error) {
      console.warn('알림 권한 요청 중 오류:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [onSettingsOpened]);

  return {
    checkPermission,
    requestPermission,
    isChecking,
  };
};
