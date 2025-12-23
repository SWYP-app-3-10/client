import { Dimensions, PixelRatio } from 'react-native';

// 기준 디자인 크기 (디자인 시안 기준)
export const DESIGN_WIDTH = 393;
export const DESIGN_HEIGHT = 852;

// 실제 디바이스 크기 가져오기 (항상 최신 값)
const getScreenDimensions = () => Dimensions.get('window');

// 디바이스 크기 비율 계산 (가로 기준)
const getScaleWidth = () => {
  const { width } = getScreenDimensions();
  return width / DESIGN_WIDTH;
};

// 가로 기준 스케일링 함수
// 항상 최신 디바이스 크기를 기준으로 계산 (회전 시 자동 반영)
export const scaleWidth = (size: number): number => {
  const scaled = size * getScaleWidth();
  return PixelRatio.roundToNearestPixel(scaled);
};

// 현재 디바이스 크기 (필요시 사용)
export const getScreenSize = () => getScreenDimensions();

// (Border Radius)
export const BORDER_RADIUS: Record<number, number> = {
  16: scaleWidth(16),
  20: scaleWidth(20),
  // ?
  99: scaleWidth(99),
  30: scaleWidth(30),
  10: scaleWidth(10),
  12: scaleWidth(12),
};

// 컬러 팔레트
export const COLORS = {
  // 그레이 색상
  white: '#FFFFFF',
  gray100: '#F6F7F9',
  gray200: '#E8E9EF',
  gray300: '#D9DCE5',
  gray400: '#CACED9',
  gray500: '#BCC1CF',
  gray600: '#ADB3C5',
  gray700: '#9EA5BB',
  gray800: '#767C91',
  black: '#19181E',
  // 메인
  puple: { main: '#6F44F5', 3: '#F6F4FE', 5: '#9b7bFF' },
};

// 타이포그래피 스타일 export
export {
  Heading_24EB_Round,
  Heading_20EB_Round,
  Heading_18B,
  Heading_18EB_Round,
  Heading_18SB,
  Heading_16B,
  Body_18M,
  Body_16SB,
  Body_16M,
  Body_16R,
  Caption_14R,
  Caption_12SB,
  Caption_12M,
} from './typography';
