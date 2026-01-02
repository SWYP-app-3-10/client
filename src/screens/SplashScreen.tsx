import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../styles/global';

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.content}>
        <Image
          source={require('../assets/png/SplashScreen.png')}
          style={styles.splashImage}
          resizeMode="cover"
        />
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
  splashImage: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;
