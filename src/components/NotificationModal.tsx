import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  ImageSourcePropType,
  TouchableWithoutFeedback,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  BORDER_RADIUS,
  COLORS,
  Heading_18EB_Round,
  Caption_14R,
  scaleWidth,
} from '../styles/global';
import Button, { ButtonVariant } from './Button';
import IconButton from './IconButton';
import { CloseIcon } from '../icons';
import { ICON_SIZES } from '../icons/config/iconSizes';
import Spacer from './Spacer';

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
  imageSize?: { width: number; height: number };

  // 단일 버튼 또는 이중 버튼
  primaryButton?: ModalButton;
  secondaryButton?: ModalButton;
  children?: ReactNode;
  closeButton?: boolean;
  titleDescriptionGapSize?: number;
  descriptionColor?: string;
  onClose?: () => void;
  titleStyle?: StyleProp<TextStyle>;
  closeOnBackdropPress?: boolean;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  title,
  description,
  image,
  imageSize = { width: scaleWidth(80), height: scaleWidth(80) },
  children,
  primaryButton,
  secondaryButton,
  closeButton,
  onClose,
  titleDescriptionGapSize = 12,
  descriptionColor,
  titleStyle,
  closeOnBackdropPress = true,
}) => {
  const handleClose = () => {
    onClose?.();
  };

  const handleOverlayPress = () => {
    // closeOnBackdropPress가 false면 배경 클릭해도 닫지 않음
    if (closeOnBackdropPress) {
      handleClose();
    }
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
      onRequestClose={closeOnBackdropPress ? handleClose : undefined}
    >
      <Pressable style={styles.overlay} onPress={handleOverlayPress}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalContent,
                {
                  paddingTop: closeButton ? scaleWidth(23) : scaleWidth(40),
                },
              ]}
            >
              {/* 닫기 버튼 */}
              {closeButton && (
                <View style={styles.closeButtonContainer}>
                  <IconButton onPress={handleClose}>
                    <CloseIcon color={COLORS.gray500} size={ICON_SIZES.M} />
                  </IconButton>
                </View>
              )}
              {/* 이미지 */}
              {renderImage()}

              {/* 제목 */}
              <Text style={titleStyle ?? styles.title}>{title}</Text>

              <Spacer num={titleDescriptionGapSize} />

              {/* 설명 텍스트 */}
              {description && (
                <Text
                  style={[
                    styles.description,
                    { color: descriptionColor ?? COLORS.gray800 },
                  ]}
                >
                  {description}
                </Text>
              )}
              {/* 컨텐츠 */}
              {children && (
                <View style={styles.childrenContainer}>{children}</View>
              )}
              {primaryButton && (
                <>
                  <Spacer num={20} />
                  {/* 버튼 컨테이너 */}
                  <View
                    style={[
                      styles.buttonContainer,
                      !secondaryButton && styles.singleButtonContainer,
                    ]}
                  >
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
                      style={
                        secondaryButton ? styles.button : styles.singleButton
                      }
                    />
                  </View>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS[20],
    width: scaleWidth(312),
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    paddingHorizontal: scaleWidth(24),
    paddingBottom: scaleWidth(24),
  },
  closeButtonContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: scaleWidth(15),
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
    ...Heading_18EB_Round,
    color: COLORS.black,
    textAlign: 'center',
  },
  description: {
    ...Caption_14R,
    textAlign: 'center',
  },

  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: scaleWidth(12),
  },
  singleButtonContainer: {
    flexDirection: 'column',
  },
  button: {
    height: scaleWidth(48),
  },
  singleButton: {
    width: '100%',
    height: scaleWidth(48),
  },
  childrenContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationModal;
