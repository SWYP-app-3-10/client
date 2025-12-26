import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS } from '../../../styles/global';

type Props = {
  /** 외부에서 크기/모양을 지정하기 위한 스타일 */
  style?: ViewStyle;
};

/**
 * Shimmer
 *
 * - 스켈레톤 UI에 사용되는 로딩 애니메이션 컴포넌트
 * - 회색 베이스 위에 밝은 띠가 좌 → 우로 반복 이동
 * - Animated + useNativeDriver 사용
 */
export default function Shimmer({ style }: Props) {
  /**
   * 애니메이션 진행도 (0 → 1)
   * 반복(loop) 애니메이션에 사용
   */
  const anim = useRef(new Animated.Value(0)).current;

  /**
   * 컴포넌트 마운트 시
   * - 좌 → 우 이동 애니메이션을 무한 반복
   * 언마운트 시
   * - 애니메이션 정지
   */
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: true,
      }),
    );

    loop.start();
    return () => loop.stop();
  }, [anim]);

  /**
   * 애니메이션 값(0~1)을 실제 이동 거리로 변환
   * 밝은 띠가 컴포넌트 바깥에서 시작해 끝까지 지나가도록 설정
   */
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 240],
  });

  return (
    <View style={[styles.base, style]}>
      {/* 이동하는 밝은 띠 */}
      <Animated.View style={[styles.shine, { transform: [{ translateX }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  /** 스켈레톤 기본 배경 */
  base: {
    backgroundColor: '#EDEDED',
    overflow: 'hidden',
  },

  /** 좌 → 우로 이동하는 하이라이트 */
  shine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: COLORS.gray500,
    transform: [{ skewX: '-20deg' }],
  },
});
