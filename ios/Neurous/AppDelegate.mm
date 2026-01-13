#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>

// ✅ 라이브러리 헤더 (이거 하나면 충분합니다)
#import <RNKakaoLogins.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"Neurous";
  self.dependencyProvider = [RCTAppDependencyProvider new];
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  if ([RNKakaoLogins isKakaoTalkLoginUrl:url]) {
      return [RNKakaoLogins handleOpenUrl:url];
  }
  return [super application:app openURL:url options:options];
}
- (NSURL *)bundleURL
{
#if DEBUG
  // 개발 모드: Metro Bundler(서버)에서 불러옴
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  // 배포 모드: 기기 내부에 저장된 파일에서 불러옴
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}
@end
