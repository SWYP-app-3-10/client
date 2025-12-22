import React, {ReactNode} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  ImageSourcePropType,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {BORDER_RADIUS, COLORS, scaleWidth} from '../styles/global';
import Button, {ButtonVariant} from './Button';

export interface ModalButton {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
}

export interface NotificationModalProps {
  visible: boolean;
  title: string;
  description?: string;
  image?: ImageSourcePropType | ReactNode;
  imageSize?: {width: number; height: number};

  // 단일 버튼 또는 이중 버튼
  primaryButton: ModalButton;
  secondaryButton?: ModalButton;
  children?: ReactNode;
  onClose?: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  title,
  description,
  image,
  imageSize = {width: scaleWidth(80), height: scaleWidth(80)},
  children,
  primaryButton,
  secondaryButton,
  onClose,
}) => {
  const handleClose = () => {
    onClose?.();
  };

  const handleOverlayPress = () => {
    // 배경 탭 시 모달 닫기
    handleClose();
  };

  const renderImage = () => {
    if (!image) {
      return null;
    }

    // ReactNode인 경우 (SVG 컴포넌트 등)
    if (React.isValidElement(image)) {
      return <View style={styles.imageWrapper}>{image}</View>;
    }

    // ImageSourcePropType인 경우
    if (typeof image === 'object' && ('uri' in image || 'source' in image)) {
      return (
        <Image
          source={image as ImageSourcePropType}
          style={[styles.image, imageSize]}
          resizeMode="contain"
        />
      );
    }

    return <View style={imageSize}>{image as ReactNode}</View>;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              {/* 이미지 */}
              {renderImage()}

              {/* 제목 */}
              <Text style={styles.title}>{title}</Text>

              {/* 설명 텍스트 */}
              {description && (
                <Text style={styles.description}>{description}</Text>
              )}

              {/* 컨텐츠 */}
              {children && (
                <View style={styles.childrenContainer}>{children}</View>
              )}

              {/* 버튼 컨테이너 */}
              <View
                style={[
                  styles.buttonContainer,
                  !secondaryButton && styles.singleButtonContainer,
                ]}>
                {secondaryButton && (
                  <Button
                    title={secondaryButton.title}
                    onPress={secondaryButton.onPress}
                    variant={secondaryButton.variant || 'primary'}
                    style={[styles.button, secondaryButton.style]}
                    textStyle={secondaryButton.textStyle}
                  />
                )}
                <Button
                  title={primaryButton.title}
                  onPress={primaryButton.onPress}
                  variant={primaryButton.variant || 'primary'}
                  style={secondaryButton ? styles.button : styles.singleButton}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(20),
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS[20],
    paddingHorizontal: scaleWidth(24),
    paddingTop: scaleWidth(40),
    paddingBottom: scaleWidth(24),
    width: '100%',
    alignItems: 'center',
  },
  imagePlaceholder: {
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS[16],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleWidth(20),
  },
  image: {
    marginBottom: scaleWidth(20),
  },
  imageWrapper: {
    marginBottom: scaleWidth(20),
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleWidth(80),
    height: scaleWidth(80),
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS[16],
    minHeight: scaleWidth(80),
    minWidth: scaleWidth(80),
  },

  title: {
    fontSize: scaleWidth(20),
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: scaleWidth(12),
    textAlign: 'center',
  },
  description: {
    fontSize: scaleWidth(14),
    color: COLORS.gray600,
    textAlign: 'center',
    lineHeight: scaleWidth(20),
    marginBottom: scaleWidth(16),
  },

  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: scaleWidth(12),
    marginTop: scaleWidth(8),
  },
  singleButtonContainer: {
    flexDirection: 'column',
  },
  button: {
    flex: 1,
    height: scaleWidth(48),
  },
  singleButton: {
    width: '100%',
    height: scaleWidth(48),
  },
  childrenContainer: {
    marginBottom: scaleWidth(16),
  },
});

export default NotificationModal;
