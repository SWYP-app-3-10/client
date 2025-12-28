import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Ic_backIcon } from '../icons';

import { useNavigation } from '@react-navigation/native';
import IconButton from './IconButton';
import { scaleWidth, COLORS } from '../styles/global';
import { Heading_16B } from '../styles/typography';

const Header = ({
  title,
  leftIcon,
  goBackAction,
  iconColor,
}: {
  title?: React.ReactNode; // ReactNode 허용
  leftIcon?: React.ReactNode;
  goBackAction?: () => void;
  iconColor?: string;
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* 왼쪽 아이콘 영역 */}
      {leftIcon ? (
        leftIcon
      ) : (
        <IconButton
          onPress={() => {
            if (goBackAction) {
              goBackAction();
              return;
            }
            navigation.goBack();
          }}
        >
          <Ic_backIcon color={iconColor ?? COLORS.black} />
        </IconButton>
      )}

      {/* 가운데 타이틀 / 커스텀 컴포넌트 */}
      {title && (
        <View style={styles.titleContainer}>
          {typeof title === 'string' ? (
            <Text style={styles.title}>{title}</Text>
          ) : (
            title // 검색바 같은 ReactNode 그대로 렌더
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleWidth(52),
    paddingHorizontal: scaleWidth(20),
    marginTop: scaleWidth(8),
    position: 'relative',
  },
  titleContainer: {
    position: 'absolute',
    left: scaleWidth(60),
    right: scaleWidth(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Heading_16B,
    color: COLORS.black,
  },
});

export default Header;
