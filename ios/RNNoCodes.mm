#import "RNNoCodes.h"
#if __has_include(<qonversion_react_native_sdk/qonversion_react_native_sdk-Swift.h>)
#import <qonversion_react_native_sdk/qonversion_react_native_sdk-Swift.h>
#else
#import "qonversion_react_native_sdk-Swift.h"
#endif

@interface RNNoCodes () <NoCodesEventDelegate>

@property (nonatomic, strong) RNNoCodesImpl *impl;

@end

@implementation RNNoCodes RCT_EXPORT_MODULE()

- (instancetype)init {
    self = [super init];
    if (self) {
        _impl = [[RNNoCodesImpl alloc] init];
        [_impl setDelegate:self];
    }
    return self;
}

- (void)initialize:(NSString *)projectKey
            source:(NSString *)source
           version:(NSString *)version
          proxyUrl:(NSString *)proxyUrl {
    [self.impl initializeWithProjectKey:projectKey source:source version:version proxyUrl:proxyUrl];
}

- (void)setScreenPresentationConfig:(NSDictionary *)configData
                        contextKey:(NSString *)contextKey
                           resolve:(RCTPromiseResolveBlock)resolve
                            reject:(RCTPromiseRejectBlock)reject {
    [self.impl setScreenPresentationConfig:configData contextKey:contextKey];
}

- (void)showScreen:(NSString *)contextKey
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.impl showScreenWithContextKey:contextKey];
    });
}

- (void)close:(RCTPromiseResolveBlock)resolve
      reject:(RCTPromiseRejectBlock)reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.impl close];
    });
}

- (void)noCodesDidTriggerWithEvent:(NSString * _Nonnull)event payload:(NSDictionary<NSString *,id> * _Nullable)payload {
  [self emitOnNoCodeEvent:@{@"name": event, @"payload": payload ?: [NSNull null]}];
}

#pragma mark - TurboModule

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeNoCodesModuleSpecJSI>(params);
}

@end
