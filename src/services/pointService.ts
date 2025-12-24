/**
 * 포인트 관련 서비스
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';
import { USE_MOCK_DATA } from '../config/apiConfig';

const POINT_KEY = '@user_points';

/**
 * 로컬 스토리지에서 포인트 조회
 * 나중에 서버 API로 교체 가능
 */
export const getPoints = async (): Promise<number> => {
  // 더미 데이터 사용 모드에서는 로컬 스토리지에서 바로 조회
  if (USE_MOCK_DATA) {
    const stored = await AsyncStorage.getItem(POINT_KEY);
    if (stored) {
      return parseInt(stored, 10) || 0;
    }
    // 초기값 설정 (테스트용 90포인트)
    await AsyncStorage.setItem(POINT_KEY, '90');
    return 90;
  }

  try {
    // 서버 API 호출
    const response = await client.get<{ points: number }>('/user/points');
    const serverPoints = response.data.points;
    // 로컬에도 저장 (오프라인 대비)
    await AsyncStorage.setItem(POINT_KEY, serverPoints.toString());
    return serverPoints;
  } catch (error) {
    console.error('포인트 조회 실패, 로컬 데이터 사용:', error);
    // 서버 연결 실패 시 로컬 값 반환
    const stored = await AsyncStorage.getItem(POINT_KEY);
    if (stored) {
      return parseInt(stored, 10) || 0;
    }
    // 초기값 설정
    await AsyncStorage.setItem(POINT_KEY, '90');
    return 90;
  }
};

/**
 * 포인트 저장
 * 나중에 서버 API로 동기화 가능
 */
export const savePoints = async (points: number): Promise<void> => {
  // 더미 데이터 사용 모드에서는 로컬에만 저장
  if (USE_MOCK_DATA) {
    await AsyncStorage.setItem(POINT_KEY, points.toString());
    return;
  }

  try {
    // 서버 API 호출
    await client.put('/user/points', { points });
    // 로컬에도 저장 (오프라인 대비)
    await AsyncStorage.setItem(POINT_KEY, points.toString());
  } catch (error) {
    console.error('포인트 저장 실패, 로컬에만 저장:', error);
    // 서버 연결 실패 시 로컬에만 저장
    await AsyncStorage.setItem(POINT_KEY, points.toString());
  }
};

/**
 * 포인트 추가
 * 나중에 서버 API로 교체 가능
 */
export const addPoints = async (amount: number): Promise<number> => {
  // 더미 데이터 사용 모드에서는 로컬에서 바로 처리
  if (USE_MOCK_DATA) {
    const currentPoints = await getPoints();
    const newPoints = currentPoints + amount;
    await savePoints(newPoints);
    console.log(
      `[pointService] 포인트 추가: ${currentPoints} + ${amount} = ${newPoints}`,
    );
    return newPoints;
  }

  try {
    // 서버 API 호출
    const response = await client.post<{ newPoints: number }>(
      '/user/points/add',
      { amount },
    );
    const newPoints = response.data.newPoints;
    // 로컬에도 저장 (오프라인 대비)
    await AsyncStorage.setItem(POINT_KEY, newPoints.toString());
    return newPoints;
  } catch (error) {
    console.error('포인트 추가 실패, 로컬에서 처리:', error);
    // 서버 연결 실패 시 로컬에서 처리
    const currentPoints = await getPoints();
    const newPoints = currentPoints + amount;
    await AsyncStorage.setItem(POINT_KEY, newPoints.toString());
    return newPoints;
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
  // 더미 데이터 사용 모드에서는 로컬에서 바로 처리
  if (USE_MOCK_DATA) {
    const currentPoints = await getPoints();
    console.log(
      `[pointService] 포인트 차감 시도: ${currentPoints} - ${amount}`,
    );
    if (currentPoints < amount) {
      return { success: false, newPoints: currentPoints };
    }
    const newPoints = currentPoints - amount;
    await savePoints(newPoints);
    console.log(
      `[pointService] 포인트 차감 완료: ${currentPoints} - ${amount} = ${newPoints}`,
    );
    return { success: true, newPoints };
  }

  try {
    // 서버 API 호출
    const response = await client.post<{ newPoints: number }>(
      '/user/points/subtract',
      { amount },
    );
    const newPoints = response.data.newPoints;
    // 로컬에도 저장 (오프라인 대비)
    await AsyncStorage.setItem(POINT_KEY, newPoints.toString());
    return { success: true, newPoints };
  } catch (error: any) {
    console.error('포인트 차감 실패, 로컬에서 처리:', error);
    // 400 에러는 포인트 부족
    if (error.response?.status === 400) {
      const currentPoints = await getPoints();
      return { success: false, newPoints: currentPoints };
    }
    // 서버 연결 실패 시 로컬에서 처리
    const currentPoints = await getPoints();
    console.log(
      `[pointService] 포인트 차감 시도 (서버 실패 후 로컬): ${currentPoints} - ${amount}`,
    );
    if (currentPoints < amount) {
      return { success: false, newPoints: currentPoints };
    }
    const newPoints = currentPoints - amount;
    await savePoints(newPoints);
    console.log(
      `[pointService] 포인트 차감 완료 (로컬): ${currentPoints} - ${amount} = ${newPoints}`,
    );
    return { success: true, newPoints };
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
