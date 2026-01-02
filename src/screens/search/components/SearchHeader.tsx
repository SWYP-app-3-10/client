import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import IconButton from '../../../components/IconButton';
import { Ic_backIcon, CloseIcon } from '../../../icons';
import {
  Body_16M,
  BORDER_RADIUS,
  COLORS,
  scaleWidth,
} from '../../../styles/global';

type Props = {
  value: string;

  // 검색 입력 화면에서만 사용
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;

  placeholder?: string;
  goBackAction?: () => void;
  iconColor?: string;

  // 검색 결과 화면 등에서 동일한 UI로 "표시만" 할 때 사용
  readOnly?: boolean;

  // readOnly 상태에서 검색바를 눌렀을 때 실행할 액션
  // (ex. SearchInputScreen으로 이동)
  onPressBar?: () => void;

  // TextInput에 추가 옵션이 필요할 경우 전달
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

  // 뒤로가기 처리
  // goBackAction이 있으면 우선 실행, 없으면 기본 navigation.goBack()
  const handleBack = () => {
    if (goBackAction) {
      goBackAction();
      return;
    }
    navigation.goBack();
  };

  // X 버튼 클릭 시 입력값 전체 초기화
  const handleClear = () => {
    onChangeText?.('');
  };

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 영역 (기존 Header와 동일한 구조 유지) */}
      <View style={styles.leftArea}>
        <IconButton onPress={handleBack}>
          <Ic_backIcon color={iconColor ?? COLORS.black} />
        </IconButton>
      </View>

      {/* 검색바 영역 */}
      <View style={styles.searchBarWrap}>
        {readOnly ? (
          // readOnly 모드
          // - 실제 입력은 막고
          // - 동일한 UI로만 보여줌
          // - 전체 영역을 눌렀을 때 onPressBar 실행
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.readOnlyPressArea}
            onPress={onPressBar}
          >
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
          // 입력 모드
          // - 실제 검색어 입력 가능
          // - 입력값이 있으면 X 버튼 노출
          <View style={styles.inputRow}>
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

            {/* 입력값이 있을 때만 X 버튼 표시 */}
            {!!value?.length && (
              <Pressable
                onPress={handleClear}
                hitSlop={10}
                style={styles.clearBtn}
                accessibilityRole="button"
                accessibilityLabel="검색어 지우기"
              >
                <CloseIcon color={COLORS.gray500} />
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleWidth(52),
    paddingHorizontal: scaleWidth(20),
    marginTop: scaleWidth(8),
    backgroundColor: COLORS.white,
  },

  leftArea: {
    marginRight: scaleWidth(12),
  },

  searchBarWrap: {
    flex: 1,
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

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchInput: {
    flex: 1,
    ...Body_16M,
    color: COLORS.black,
    padding: 0,
  },

  clearBtn: {
    width: scaleWidth(28),
    height: scaleWidth(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
