import React, {Children} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {BORDER_RADIUS, COLORS, scaleWidth} from '../styles/global';
import {Heading_18EB_Round} from '../styles/typography';
import {Button} from '.';
import {ButtonProps} from '../components/Button';
export type ButtonVariant = 'primary' | 'outline' | 'ghost';

export interface IconButtonProps extends ButtonProps {
  children: React.ReactNode;
  hitSlop?: number;
  style?: ViewStyle;
  onPress?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  hitSlop = 10,
  style,
  onPress,
}) => {
  return (
    <Button onPress={onPress} variant="ghost" hitSlop={hitSlop} style={style}>
      {children}
    </Button>
  );
};

export default IconButton;
