/**
 * SVG 모듈 타입 선언
 * react-native-svg-transformer를 사용하여 SVG를 React 컴포넌트로 변환
 */
declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
