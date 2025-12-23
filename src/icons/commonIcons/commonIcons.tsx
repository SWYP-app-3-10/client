import { ICON_SIZES } from '../config/iconSizes';
import Youtube from '../../assets/svg/Youtube.svg';
import Icon_back from '../../assets/svg/icon_back.svg';
import {
  createIconComponent,
  createRectangleIconComponent,
} from '../config/iconUtils';
import Check from '../../assets/svg/Check_.svg';
import Close from '../../assets/svg/Close_.svg';
import First from '../../assets/svg/First.svg';
import Second from '../../assets/svg/Second.svg';
import Third from '../../assets/svg/Third.svg';
import { scaleWidth } from '../../styles/global';
import Circle from '../../assets/svg/Circle.svg';

export const YoutubeIcon = createIconComponent(Youtube, ICON_SIZES.X3L);
export const Ic_backIcon = createIconComponent(Icon_back, ICON_SIZES.XL);
export const CircleIcon = createIconComponent(Circle, scaleWidth(14));
export const CheckIcon = createRectangleIconComponent(
  Check,
  scaleWidth(9.29),
  scaleWidth(7.44),
);
export const CloseIcon = createIconComponent(Close, ICON_SIZES.XL);
//  가로, 세로 크기 다름
export const FirstIcon = createRectangleIconComponent(
  First,
  scaleWidth(55),
  scaleWidth(44),
);
export const SecondIcon = createRectangleIconComponent(
  Second,
  scaleWidth(58),
  scaleWidth(44),
);
export const ThirdIcon = createRectangleIconComponent(
  Third,
  scaleWidth(58),
  scaleWidth(44),
);
