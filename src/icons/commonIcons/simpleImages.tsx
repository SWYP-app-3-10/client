import { scaleWidth } from '../../styles/global';
import { createImageIconComponent } from '../config/iconUtils';
import Tooltip_Recent from '../../assets/png/Tooltip_Recent.png';
import Lock from '../../assets/png/Lock.png';

export const Tooltip_RecentIcon = createImageIconComponent(
  Tooltip_Recent,
  scaleWidth(163),
  scaleWidth(55),
);
export const LockIcon = createImageIconComponent(
  Lock,
  scaleWidth(40),
  scaleWidth(47),
);
