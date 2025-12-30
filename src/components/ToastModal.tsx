import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  COLORS,
  scaleWidth,
  Caption_14R,
  BORDER_RADIUS,
} from '../styles/global';

interface ToastModalProps {
  visible: boolean;
  message: string;
  duration?: number;
  onClose?: () => void;
}

const ToastModal: React.FC<ToastModalProps> = ({
  visible,
  message,
  duration = 2000,
  onClose,
}) => {
  const { bottom } = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const hideToast = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (visible) {
      // 나타나는 애니메이션
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // 자동으로 사라지는 타이머
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      // 사라지는 애니메이션
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, duration, hideToast]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={hideToast}
    >
      <View style={styles.container} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.toastContainer,
            {
              bottom: bottom + scaleWidth(20),
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.message}>{message}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  toastContainer: {
    backgroundColor: COLORS.gray800,
    borderRadius: BORDER_RADIUS[12],
    paddingHorizontal: scaleWidth(20),
    paddingVertical: scaleWidth(14),
    marginHorizontal: scaleWidth(20),
    minHeight: scaleWidth(48),
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  message: {
    ...Caption_14R,
    color: COLORS.white,
    textAlign: 'center',
  },
});

export default ToastModal;
