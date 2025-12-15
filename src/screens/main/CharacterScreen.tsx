import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RouteNames} from '../../../routes';

const CharacterScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>CharacterScreen</Text>
      <Text>캐릭터 페이지</Text>

      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate(RouteNames.CHARACTER_LEVEL as never)
          }>
          <Text style={styles.buttonText}>레벨 기준 확인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate(RouteNames.CHARACTER_LEVEL_DETAIL as never)
          }>
          <Text style={styles.buttonText}>레벨 기준 상세</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate(RouteNames.CHARACTER_POINT_HISTORY as never)
          }>
          <Text style={styles.buttonText}>포인트/경험치 내역</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate(RouteNames.CHARACTER_NOTIFICATION as never)
          }>
          <Text style={styles.buttonText}>알림</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CharacterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonArea: {
    marginTop: 20,
    width: '80%',
  },
  button: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
