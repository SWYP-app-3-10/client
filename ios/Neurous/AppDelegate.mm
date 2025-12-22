#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <KakaoSDKCommon/KakaoSDKCommon.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // 카카오 SDK 초기화
  NSString *kakaoAppKey = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"KAKAO_APP_KEY"];
  if (kakaoAppKey) {
    [KakaoSDKCommon initSDKWithAppKey:kakaoAppKey];
  }

  self.moduleName = @"Neurous";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  if ([KakaoSDKCommon isKakaoTalkLoginUrl:url]) {
    return [KakaoSDKCommon handleOpenUrl:url];
  }
  return [super application:app openURL:url options:options];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
