import { scaleWidth } from '../../styles/global';
import { createImageIconComponent } from '../config/iconUtils';
import Tooltip_Recent from '../../assets/png/Tooltip_Recent.png';
import Lock from '../../assets/png/Lock.png';
import Level_1_tooltip from '../../assets/png/Level_1_tooltip.png';
import Check_3D from '../../assets/png/Check_3D.png';
import ProgressBar from '../../assets/png/ProgressBar.png';
export const Tooltip_RecentIcon = createImageIconComponent(
  Tooltip_Recent,
  scaleWidth(163),
  scaleWidth(55),
);
export const Level_1_Tooltip = createImageIconComponent(
  Level_1_tooltip,
  scaleWidth(270),
  scaleWidth(73),
);
export const LockIcon = createImageIconComponent(
  Lock,
  scaleWidth(40),
  scaleWidth(47),
);
export const Check_3DIcon = createImageIconComponent(
  Check_3D,
  scaleWidth(30),
  scaleWidth(30),
);
export const ProgressBarIcon = createImageIconComponent(
  ProgressBar,
  scaleWidth(305),
  scaleWidth(18),
);
