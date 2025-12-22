import React from 'react';
import Button from './Button';
import { scaleWidth } from '../styles/global';
import IconButton from './IconButton';
import { CloseIcon } from '../icons';
import Spacer from './Spacer';
import { Text, View } from 'react-native';
import { BORDER_RADIUS, COLORS } from '../styles/global';

const RecentSearches = (props: any) => {
  const { maxWidth, minWidth } = props;

  return (
    <Button
      key={props.index.toString()}
      onPress={() => {
        props.setSearch(props.item.searchName);
        props.recordSearch(props.item.searchName);
      }}
      style={{
        borderRadius: BORDER_RADIUS[30],
        width: 'auto',
        minWidth: minWidth ?? undefined,
        maxWidth: maxWidth ?? scaleWidth(133),
        paddingHorizontal: scaleWidth(12),
        height: scaleWidth(40),
        backgroundColor: COLORS.gray100,
      }}
    >
      <>
        <View style={{ flexShrink: 1 }}>
          <Text style={{ color: COLORS.gray800 }} numberOfLines={1}>
            {props.item.searchName}
          </Text>
        </View>
        <Spacer horizontal num={5} />
        <IconButton
          onPress={() => props.removeSearchRecord(props.item.searchName)}
        >
          <CloseIcon />
        </IconButton>
      </>
    </Button>
  );
};

export default RecentSearches;
