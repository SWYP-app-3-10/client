/**
 * API 설정
 * 서버 연결 여부를 제어하는 설정
 */

// 서버 API 사용 여부 (서버가 준비되면 true로 변경)
export const USE_SERVER_API = false; // TODO: 서버 준비되면 true로 변경

// 더미 데이터 사용 여부 (서버가 없을 때)
export const USE_MOCK_DATA = !USE_SERVER_API;
