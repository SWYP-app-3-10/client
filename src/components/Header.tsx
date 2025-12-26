import React from 'react';
import { Text, View } from 'react-native';
import { Ic_backIcon } from '../icons';

import { useNavigation } from '@react-navigation/native';
import IconButton from './IconButton';
import { scaleWidth } from '../styles/global';

const Header = ({
  title,
  leftIcon,
  goBackAction,
  iconColor,
}: {
  title?: string;
  leftIcon?: React.ReactNode;
  goBackAction?: () => void;
  iconColor?: string;
}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: scaleWidth(52),
        paddingHorizontal: scaleWidth(20),
        marginTop: scaleWidth(8),
      }}
    >
      {leftIcon ? (
        leftIcon
      ) : (
        <IconButton
          onPress={() => {
            if (goBackAction) {
              goBackAction(); // ✅ 함수 실행
              return;
            }
            navigation.goBack(); // ✅ 기본 뒤로가기
          }}
        >
          <Ic_backIcon color={iconColor} />
        </IconButton>
      )}
      <Text>{title}</Text>
    </View>
  );
};

export default Header;
