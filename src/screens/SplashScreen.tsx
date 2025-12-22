import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {scaleWidth} from '../styles/global';

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
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: scaleWidth(120),
    height: scaleWidth(120),
    backgroundColor: '#F5F5F5',
    borderRadius: scaleWidth(12),
  },
});

export default SplashScreen;
