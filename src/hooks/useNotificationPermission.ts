import { useState, useCallback } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import {
  checkNotifications,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';

export const useNotificationPermission = () => {
  const [isChecking, setIsChecking] = useState(false);

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
                onPress: () => Linking.openSettings(),
              },
            ],
          );
          return false;
        }

        return true;
      } else if (status === RESULTS.BLOCKED) {
        Alert.alert(
          '알림 권한 필요',
          '알림을 받으려면 설정에서 알림 권한을 허용해주세요.',
          [
            {
              text: '취소',
              style: 'cancel',
            },
            {
              text: '설정으로 이동',
              onPress: () => Linking.openSettings(),
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
  }, []);

  return {
    checkPermission,
    requestPermission,
    isChecking,
  };
};
