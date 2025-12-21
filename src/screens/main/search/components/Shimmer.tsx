import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View, ViewStyle} from 'react-native';

type Props = {
  style?: ViewStyle;
};

/**
 * ✅ 움직이는 Shimmer
 * - 회색 베이스 위에 밝은 띠가 좌→우로 이동
 */
export default function Shimmer({style}: Props) {
  const anim = useRef(new Animated.Value(0)).current;

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

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 240],
  });

  return (
    <View style={[styles.base, style]}>
      <Animated.View style={[styles.shine, {transform: [{translateX}]}]} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {backgroundColor: '#EDEDED', overflow: 'hidden'},
  shine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: 'rgba(255,255,255,0.45)',
    transform: [{skewX: '-20deg'}],
  },
});
