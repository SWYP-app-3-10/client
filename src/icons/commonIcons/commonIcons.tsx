import { ICON_SIZES } from '../config/iconSizes';
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
import Info from '../../assets/svg/Info.svg';
import RightArrow from '../../assets/svg/RightArrow.svg';
import Triangle from '../../assets/svg/Triangle.svg';
import Apple from '../../assets/svg/Apple.svg';
import Google from '../../assets/svg/Google.svg';
import Kakao from '../../assets/svg/Kakao.svg';
import Naver from '../../assets/svg/Naver.svg';
import Alarm from '../../assets/svg/Alarm.svg';
import Check_2 from '../../assets/svg/check_2.svg';
import Home from '../../assets/svg/home.svg';
import Search from '../../assets/svg/search.svg';
import Character from '../../assets/svg/character.svg';
import MyPage from '../../assets/svg/myPage.svg';
import BottomModalCheck from '../../assets/svg/bottomModalCheck.svg';

export const Ic_backIcon = createIconComponent(Icon_back, ICON_SIZES.XL);
export const CircleIcon = createIconComponent(Circle, scaleWidth(14));
export const InfoIcon = createIconComponent(Info, ICON_SIZES.L);
export const CloseIcon = createIconComponent(Close, ICON_SIZES.XL);
export const TriangleIcon = createIconComponent(Triangle, ICON_SIZES.X3L);
export const AppleIcon = createIconComponent(Apple, ICON_SIZES.M);
export const GoogleIcon = createIconComponent(Google, ICON_SIZES.M);
export const KakaoIcon = createIconComponent(Kakao, ICON_SIZES.M);
export const NaverIcon = createIconComponent(Naver, ICON_SIZES.M);
export const AlarmIcon = createIconComponent(Alarm, scaleWidth(28));
export const HomeIcon = createIconComponent(Home, scaleWidth(28));
export const SearchIcon = createIconComponent(Search, scaleWidth(28));
export const CharacterIcon = createIconComponent(Character, scaleWidth(28));
export const MyPageIcon = createIconComponent(MyPage, scaleWidth(28));
//  가로, 세로 크기 다름
export const CheckIcon = createRectangleIconComponent(
  Check,
  scaleWidth(12),
  scaleWidth(9),
);
export const Check_2Icon = createRectangleIconComponent(
  Check_2,
  scaleWidth(10),
  scaleWidth(6),
);
export const BottomModalCheckIcon = createRectangleIconComponent(
  BottomModalCheck,
  scaleWidth(13),
  scaleWidth(10),
);
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
export const RightArrowIcon = createRectangleIconComponent(
  RightArrow,
  scaleWidth(7),
  scaleWidth(12),
);
