/**
 * 소셜 로그인 설정
 *
 * 보안 가이드:
 * - 공개 키 (Client ID, Consumer Key): 프론트엔드에 설정 가능
 * - 비밀 키 (Client Secret): 백엔드에서만 사용해야 함
 *
 * 실제 배포 시:
 * 1. 환경 변수나 별도 설정 파일 사용 권장
 * 2. 또는 빌드 시 주입 (CI/CD 파이프라인)
 */

// 구글 로그인 설정
export const GOOGLE_CONFIG = {
  // Google Cloud Console에서 발급받은 웹 클라이언트 ID
  // 공개 키이므로 프론트엔드에 노출 가능
  webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID',
};

// 카카오 로그인 설정
export const KAKAO_CONFIG = {
  // 카카오 디벨로퍼스에서 발급받은 네이티브 앱 키
  // 공개 키이므로 프론트엔드에 노출 가능
  // iOS: Info.plist의 KAKAO_APP_KEY에 설정
  // Android: AndroidManifest.xml에 설정
  appKey: 'YOUR_KAKAO_APP_KEY',
};

// 네이버 로그인 설정
export const NAVER_CONFIG = {
  // 네이버 개발자 센터에서 발급받은 Client ID
  // 공개 키이므로 프론트엔드에 노출 가능
  consumerKey: 'YOUR_NAVER_CONSUMER_KEY',

  // 주의: 네이버 SDK 초기화에 필요하지만, 실제 검증은 백엔드에서 해야 함
  // 앱 번들에 포함되므로 완전히 숨길 수는 없지만,
  // 백엔드에서 Access Token 검증을 반드시 수행해야 합니다.
  consumerSecret: 'YOUR_NAVER_CONSUMER_SECRET',

  appName: '뇌세포',
  serviceUrlScheme: 'com.client', // iOS URL Scheme (앱 번들 ID와 일치)
};

