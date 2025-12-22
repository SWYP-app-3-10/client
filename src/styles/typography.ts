import {StyleSheet, TextStyle} from 'react-native';
import {scaleWidth} from './global';

const getFontFamily = (weight: number): string => {
  if (weight >= 800) {
    return 'Pretendard-ExtraBold';
  } else if (weight >= 700) {
    return 'Pretendard-Bold';
  } else if (weight >= 600) {
    return 'Pretendard-SemiBold';
  } else if (weight >= 500) {
    return 'Pretendard-Medium';
  } else {
    return 'Pretendard-Regular';
  }
};

const getLineHeight = (fontSize: number, lineHeightPercent: number): number => {
  return scaleWidth((fontSize * lineHeightPercent) / 100);
};

const getLetterSpacing = (
  fontSize: number,
  letterSpacingPercent: number,
): number => {
  return scaleWidth((fontSize * letterSpacingPercent) / 100);
};

const createTextStyle = (
  size: number,
  weight: number,
  lineHeightPercent: number,
  letterSpacingPercent: number = 0,
): TextStyle => {
  const fontSize = scaleWidth(size);
  return {
    fontFamily: getFontFamily(weight),
    fontSize,
    fontWeight: weight.toString() as TextStyle['fontWeight'],
    lineHeight: getLineHeight(size, lineHeightPercent),
    letterSpacing: getLetterSpacing(size, letterSpacingPercent),
  };
};

const TYPOGRAPHY = StyleSheet.create({
  // ========== Heading Styles ==========
  Heading_24EB_Round: createTextStyle(24, 800, 150, 0),
  Heading_20EB_Round: createTextStyle(20, 800, 150, 0),
  Heading_18B: createTextStyle(18, 700, 150, 0),
  Heading_18EB_Round: createTextStyle(18, 800, 150, 0),
  Heading_18SB: createTextStyle(18, 600, 150, 0),
  Heading_16B: createTextStyle(16, 700, 150, 0),

  // ========== Body Styles ==========
  Body_18M: createTextStyle(18, 500, 150, 0),
  Body_16SB: createTextStyle(16, 600, 150, 0),
  Body_16M: createTextStyle(16, 500, 150, 0),
  Body_16R: createTextStyle(16, 400, 160, 0),
  //
  Body_15M: createTextStyle(15, 500, 160, -2),

  // ========== Caption Styles ==========
  Caption_14R: createTextStyle(14, 400, 135, 0),
  Caption_12SB: createTextStyle(12, 600, 150, 0),
  Caption_12M: createTextStyle(12, 500, 150, 0),
});

export const Heading_24EB_Round = TYPOGRAPHY.Heading_24EB_Round;
export const Heading_20EB_Round = TYPOGRAPHY.Heading_20EB_Round;
export const Heading_18B = TYPOGRAPHY.Heading_18B;
export const Heading_18EB_Round = TYPOGRAPHY.Heading_18EB_Round;
export const Heading_18SB = TYPOGRAPHY.Heading_18SB;
export const Heading_16B = TYPOGRAPHY.Heading_16B;

export const Body_18M = TYPOGRAPHY.Body_18M;
export const Body_16SB = TYPOGRAPHY.Body_16SB;
export const Body_16M = TYPOGRAPHY.Body_16M;
export const Body_16R = TYPOGRAPHY.Body_16R;
export const Body_15M = TYPOGRAPHY.Body_15M;

export const Caption_14R = TYPOGRAPHY.Caption_14R;
export const Caption_12SB = TYPOGRAPHY.Caption_12SB;
export const Caption_12M = TYPOGRAPHY.Caption_12M;
