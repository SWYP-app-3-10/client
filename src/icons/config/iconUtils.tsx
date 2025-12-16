import React, {FC} from 'react';
import {ColorValue, StyleProp} from 'react-native';
import FastImage, {ImageStyle} from 'react-native-fast-image';
import {SvgProps} from 'react-native-svg';

export interface IconProps {
  color?: ColorValue;
  [key: string]: any;
}

//svg
export const createIconComponent = (IconSVG: React.FC<any>, size: number) => {
  return ({color = '#171717', ...props}: IconProps) => (
    <IconSVG
      width={size}
      height={size}
      {...(color !== undefined && {color})}
      {...props}
    />
  );
};
export const createRectangleIconComponent = (
  IconSVG: FC<SvgProps>,
  width_: number,
  height: number,
) => {
  return ({...props}: IconProps) => (
    <IconSVG width={width_} height={height} {...props} />
  );
};

//png,gif 등
export const createImageIconComponent = (
  imgSource: any,
  width: number,
  height?: number,
) => {
  return ({style}: {style?: StyleProp<ImageStyle>}) => (
    <FastImage
      source={imgSource}
      style={[{width, height: height ?? width}, style]}
      resizeMode="contain"
    />
  );
};
