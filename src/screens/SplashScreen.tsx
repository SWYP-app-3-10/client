import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, scaleWidth } from '../styles/global';

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 로고 placeholder */}
        <View style={styles.logoPlaceholder} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: scaleWidth(120),
    height: scaleWidth(120),
    backgroundColor: COLORS.grayLight,
    borderRadius: scaleWidth(12),
  },
});

export default SplashScreen;
