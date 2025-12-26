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
  title?: string;
  leftIcon?: React.ReactNode;
  goBackAction?: () => void;
  iconColor?: string;
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {leftIcon ? (
        leftIcon
      ) : (
        <IconButton onPress={() => goBackAction ?? navigation.goBack()}>
          <Ic_backIcon color={iconColor} />
        </IconButton>
      )}
      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
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
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Heading_16B,
    color: COLORS.black,
  },
});

export default Header;
