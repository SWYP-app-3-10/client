import React from 'react';
import Button from './Button';
import {scaleWidth} from '../styles/global';
import IconButton from './IconButton';
import {Ic_backIcon} from '../icons';
import Spacer from './Spacer';
import {Text, View} from 'react-native';
import {COLORS} from '../styles/global';
/**
 * 
 * @param props 
 * const [searchRecord, setSearchRecord] = useState<string[]>([]);
 * // 최근검색어 하나 제거
  const removeSearchRecord = async (name: string) => {
    const result = searchRecord.filter(
      (search: any) => search.searchName !== name,
    );
    AsyncStorage.removeItem('searchRecord');
    await getMemberEmail();
    AsyncStorage.setItem(
      'searchRecord',
      JSON.stringify({
        record: result,
      }),
    );
    setSearchRecord(result);
  };

  // 최근검색어 전체 삭제
  const removeAllSearchRecord = () => {
    AsyncStorage.removeItem('searchRecord');
    setSearchRecord([]);
    setCheckRecord(false);
  };
 * <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: scaleWidth(10),
                  width: scaleWidth(329),
                }}>
                {searchRecord.map((value, index) => {
                  return (
                    <RecentSearches
                      key={index.toString()}
                      index={index}
                      removeSearchRecord={removeSearchRecord}
                      recordSearch={recordSearch}
                      setSearch={setSearch}
                      item={value}
                    />
                  );
                })}
              </View>
 * @returns 
 */
const RecentSearches = (props: any) => {
  const {maxWidth, minWidth} = props;

  return (
    <Button
      key={props.index.toString()}
      onPress={() => {
        props.setSearch(props.item.searchName);
        props.recordSearch(props.item.searchName);
      }}
      style={{
        borderRadius: 99,
        width: 'auto',
        minWidth: minWidth ?? undefined,
        maxWidth: maxWidth ?? scaleWidth(133),
        paddingHorizontal: scaleWidth(10),
        height: scaleWidth(40),
      }}>
      <>
        <View style={{flexShrink: 1}}>
          <Text style={{color: COLORS.gray300}} numberOfLines={1}>
            {props.item.searchName}
          </Text>
        </View>
        <Spacer horizontal num={5} />
        <IconButton
          onPress={() => props.removeSearchRecord(props.item.searchName)}>
          <Ic_backIcon />
        </IconButton>
      </>
    </Button>
  );
};

export default RecentSearches;
