import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import IconButton from '../../../components/IconButton';
import { Ic_backIcon } from '../../../icons';
import {
  Body_16M,
  BORDER_RADIUS,
  COLORS,
  scaleWidth,
} from '../../../styles/global';

type Props = {
  value: string;

  // ✅ 입력 모드에서만 사용 (검색 입력 화면)
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;

  placeholder?: string;
  goBackAction?: () => void;
  iconColor?: string;

  // ✅ 표시 전용 모드 (검색 결과 화면에서 "같은 모양"으로 보여주기)
  readOnly?: boolean;

  // ✅ readOnly일 때 검색바 누르면 실행 (ex. SearchInputScreen으로 이동)
  onPressBar?: () => void;

  // ✅ 필요한 경우 TextInput 옵션 추가로 전달
  inputProps?: Omit<
    TextInputProps,
    'value' | 'onChangeText' | 'onSubmitEditing'
  >;
};

export default function SearchHeader({
  value,
  onChangeText,
  onSubmit,
  placeholder = '글을 검색해보세요',
  goBackAction,
  iconColor,
  readOnly = false,
  onPressBar,
  inputProps,
}: Props) {
  const navigation = useNavigation();

  const input = (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={COLORS.gray400}
      returnKeyType="search"
      onSubmitEditing={onSubmit}
      style={styles.searchInput}
      editable={!readOnly}
      {...inputProps}
    />
  );

  return (
    <View style={styles.container}>
      {/* ✅ 기존 Header와 동일한 뒤로가기 버튼 구성 */}
      <View style={styles.leftArea}>
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
      </View>

      {/* ✅ 검색창이 남은 영역 전부 차지 */}
      <View style={styles.searchBarWrap}>
        {readOnly ? (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.readOnlyPressArea}
            onPress={onPressBar}
          >
            {/* readOnly: 입력 막고 동일 UI로 표시 */}
            <TextInput
              value={value}
              placeholder={placeholder}
              placeholderTextColor={COLORS.gray400}
              style={styles.searchInput}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
        ) : (
          input
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // 뒤로 + 검색바 가로 배치
    alignItems: 'center',
    height: scaleWidth(52),
    paddingHorizontal: scaleWidth(20),
    marginTop: scaleWidth(8),
    backgroundColor: COLORS.white,
  },

  leftArea: {
    marginRight: scaleWidth(12), // 뒤로 버튼과 검색바 간격
  },

  searchBarWrap: {
    flex: 1, // 🔥 남은 영역 전부
    height: scaleWidth(40),
    borderRadius: BORDER_RADIUS[16],
    backgroundColor: COLORS.gray100,
    paddingHorizontal: scaleWidth(14),
    justifyContent: 'center',
  },

  readOnlyPressArea: {
    flex: 1,
    justifyContent: 'center',
  },

  searchInput: {
    ...Body_16M,
    color: COLORS.black,
    padding: 0,
  },
});
