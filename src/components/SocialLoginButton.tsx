import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import Button from './Button';
import {
  COLORS,
  scaleWidth,
  BORDER_RADIUS,
  Heading_18EB_Round,
} from '../styles/global';
import { Tooltip_RecentIcon } from '../icons';
import { SocialLoginProvider } from '../services/socialLoginService';
import { RecentLoginInfo } from '../services/authStorageService';

interface SocialLoginButtonProps {
  provider: SocialLoginProvider;
  onPress: () => void;
  loading: SocialLoginProvider | null;
  recentLogin: RecentLoginInfo | null;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onPress,
  loading,
  recentLogin,
}) => {
  const showTooltip = recentLogin?.provider === provider;
  const isLoading = loading === provider;

  const renderButton = () => {
    switch (provider) {
      case 'apple':
        return (
          <>
            <AppleButton
              buttonType={AppleButton.Type.SIGN_IN}
              buttonStyle={AppleButton.Style.BLACK}
              cornerRadius={BORDER_RADIUS[16]}
              style={styles.appleButton}
              onPress={onPress}
            />
          </>
        );
      case 'google':
        return (
          <Button
            variant="outline"
            style={styles.outlineButton}
            onPress={onPress}
            disabled={loading !== null}
          >
            {isLoading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={styles.socialButtonText}>
                Google 계정으로 로그인
              </Text>
            )}
          </Button>
        );
      case 'kakao':
        return (
          <Button
            variant="primary"
            style={styles.kakaoButton}
            onPress={onPress}
            disabled={loading !== null}
          >
            {isLoading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={[styles.socialButtonText, styles.kakaoButtonText]}>
                카카오로 시작하기
              </Text>
            )}
          </Button>
        );
      case 'naver':
        return (
          <Button
            variant="primary"
            style={styles.naverButton}
            onPress={onPress}
            disabled={loading !== null}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={[styles.socialButtonText, styles.naverButtonText]}>
                Naver로 시작하기
              </Text>
            )}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.buttonWrapper}>
      {showTooltip && (
        <View style={styles.tooltipContainer}>
          <View style={styles.tooltipBackground} />
          <Tooltip_RecentIcon />
        </View>
      )}
      {renderButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    width: '100%',
    position: 'relative',
  },
  tooltipContainer: {
    position: 'absolute',
    top: scaleWidth(-55),
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
  },
  tooltipBackground: {
    position: 'absolute',
    width: scaleWidth(163),
    height: scaleWidth(42),
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS[16],
    zIndex: -1,
  },
  appleButton: {
    width: '100%',
    height: scaleWidth(56),
  },
  outlineButton: {
    borderColor: COLORS.black,
  },
  kakaoButton: {
    backgroundColor: '#FFD43B',
  },
  naverButton: {
    backgroundColor: '#2DB400',
  },
  socialButtonText: {
    ...Heading_18EB_Round,
  },
  kakaoButtonText: {
    color: '#000000',
  },
  naverButtonText: {
    color: COLORS.white,
  },
});

export default SocialLoginButton;
