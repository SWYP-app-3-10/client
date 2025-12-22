import React from 'react';
import {Text, View} from 'react-native';
import {Ic_backIcon} from '../icons';

import {useNavigation} from '@react-navigation/native';
import IconButton from './IconButton';
import {scaleWidth} from '../styles/global';

const Header = ({
  title,
  leftIcon,
  goBackAction,
}: {
  title?: string;
  leftIcon?: React.ReactNode;
  goBackAction?: () => void;
}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: scaleWidth(48),
        paddingHorizontal: scaleWidth(20),
      }}>
      {leftIcon ? (
        leftIcon
      ) : (
        <IconButton onPress={() => goBackAction ?? navigation.goBack()}>
          <Ic_backIcon />
        </IconButton>
      )}
      <Text>{title}</Text>
    </View>
  );
};

export default Header;
