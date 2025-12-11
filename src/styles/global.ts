import {Dimensions, PixelRatio} from 'react-native';

// 기준 디자인 크기 (디자인 시안 기준)
export const DESIGN_WIDTH = 393;
export const DESIGN_HEIGHT = 852;

// 실제 디바이스 크기 가져오기 (항상 최신 값)
const getScreenDimensions = () => Dimensions.get('window');

// 디바이스 크기 비율 계산 (가로 기준)
const getScaleWidth = () => {
  const {width} = getScreenDimensions();
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
