#import "RNNoCodes.h"
#import "qonversion_react_native_sdk-Swift.h"

@interface RNNoCodes ()

@property (nonatomic, strong) RNNoCodesImpl *impl;

@end

@implementation RNNoCodes
RCT_EXPORT_MODULE()

- (instancetype)init {
   self = [super init];
   if (self) {
       _impl = [[SwiftNoCodes alloc] init];
   }
   return self;
}

- (void)initialize:(NSString *)projectKey
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
    [self.impl initialize:projectKey];
}

- (void)setScreenPresentationConfig:(NSDictionary *)configData
                        contextKey:(NSString *)contextKey
                           resolve:(RCcdTPromiseResolveBlock)resolve
                            reject:(RCTPromiseRejectBlock)reject {
    [self.impl setScreenPresentationConfig:configData forContextKey:contextKey];
}

- (void)showScreen:(NSString *)contextKey
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
    [self.impl showScreen:contextKey];
}

- (void)close:(RCTPromiseResolveBlock)resolve
      reject:(RCTPromiseRejectBlock)reject {
   dispatch_async(dispatch_get_main_queue(), ^{
       [self.impl close];
   });
}
//
//
//#pragma mark - NoCodesEventListener
//
//- (void)noCodesDidTriggerWithEvent:(NSString * _Nonnull)event payload:(NSDictionary<NSString *,id> * _Nullable)payload {
//    [self emitOnNoCodeEvent:@{@"name": event, @"payload": payload}];
//}
//
//#pragma mark - TurboModule
//
//- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
//    (const facebook::react::ObjCTurboModule::InitParams &)params
//{
//    return std::make_shared<facebook::react::NativeNoCodesModuleSpecJSI>(params);
//}

@end
