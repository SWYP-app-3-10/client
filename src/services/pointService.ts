/**
 * 포인트 관련 서비스
 * 서버 API 연동 시 이 파일을 수정하여 실제 포인트 로직 구현
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const POINT_KEY = '@user_points';

/**
 * 로컬 스토리지에서 포인트 조회
 * 나중에 서버 API로 교체 가능
 */
export const getPoints = async (): Promise<number> => {
  try {
    // TODO: 서버 API로 포인트 조회
    // 예시:
    // const response = await api.get('/user/points');
    // return response.data.points;

    // 현재는 로컬 스토리지에서 조회
    const stored = await AsyncStorage.getItem(POINT_KEY);
    if (stored) {
      return parseInt(stored, 10) || 0;
    }
    // 초기값 설정 (테스트용 90포인트)
    await AsyncStorage.setItem(POINT_KEY, '90');
    return 90;
  } catch (error) {
    console.error('포인트 조회 실패:', error);
    return 0;
  }
};

/**
 * 포인트 저장
 * 나중에 서버 API로 동기화 가능
 */
export const savePoints = async (points: number): Promise<void> => {
  try {
    // TODO: 서버 API로 포인트 저장
    // 예시:
    // await api.put('/user/points', { points });

    // 현재는 로컬 스토리지에 저장
    await AsyncStorage.setItem(POINT_KEY, points.toString());
  } catch (error) {
    console.error('포인트 저장 실패:', error);
    throw error;
  }
};

/**
 * 포인트 추가
 * 나중에 서버 API로 교체 가능
 */
export const addPoints = async (amount: number): Promise<number> => {
  try {
    // TODO: 서버 API로 포인트 추가
    // 예시:
    // const response = await api.post('/user/points/add', { amount });
    // return response.data.newPoints;

    // 현재는 로컬에서 처리
    const currentPoints = await getPoints();
    const newPoints = currentPoints + amount;
    await savePoints(newPoints);
    return newPoints;
  } catch (error) {
    console.error('포인트 추가 실패:', error);
    throw error;
  }
};

/**
 * 포인트 차감
 * 나중에 서버 API로 교체 가능
 * @returns 차감 성공 여부와 새로운 포인트 값
 */
export const subtractPoints = async (
  amount: number,
): Promise<{ success: boolean; newPoints: number }> => {
  try {
    // TODO: 서버 API로 포인트 차감
    // 예시:
    // try {
    //   const response = await api.post('/user/points/subtract', { amount });
    //   return { success: true, newPoints: response.data.newPoints };
    // } catch (error) {
    //   if (error.response?.status === 400) {
    //     // 포인트 부족
    //     return { success: false, newPoints: await getPoints() };
    //   }
    //   throw error;
    // }

    // 현재는 로컬에서 처리
    const currentPoints = await getPoints();
    if (currentPoints < amount) {
      return { success: false, newPoints: currentPoints };
    }
    const newPoints = currentPoints - amount;
    await savePoints(newPoints);
    return { success: true, newPoints };
  } catch (error) {
    console.error('포인트 차감 실패:', error);
    return { success: false, newPoints: await getPoints() };
  }
};

/**
 * 서버와 포인트 동기화 (나중에 구현)
 * 로컬 포인트를 서버와 동기화하거나, 서버 포인트를 로컬로 가져옴
 */
export const syncPointsWithServer = async (): Promise<number> => {
  // TODO: 서버 API 연동 시 구현
  // 예시:
  // try {
  //   const response = await api.get('/user/points');
  //   const serverPoints = response.data.points;
  //   await savePoints(serverPoints);
  //   return serverPoints;
  // } catch (error) {
  //   console.error('포인트 동기화 실패:', error);
  //   return await getPoints(); // 실패 시 로컬 값 반환
  // }

  // 현재는 로컬 값만 반환
  return await getPoints();
};
