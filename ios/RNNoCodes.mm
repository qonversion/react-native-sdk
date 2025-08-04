#import "RNNoCodes.h"

@interface RNNoCodes ()

@property (nonatomic, strong) NoCodesSandwich *noCodesSandwich;

@end

@implementation RNNoCodes
RCT_EXPORT_MODULE()

- (instancetype)init {
    self = [super init];
    if (self) {
        _noCodesSandwich = [[NoCodesSandwich alloc] initWithNoCodesEventListener:self];
    }
    return self;
}

- (void)initialize:(NSString *)projectKey
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject) {
    [self.noCodesSandwich initializeWithProjectKey:projectKey];
}

- (void)setScreenPresentationConfig:(NSDictionary *)configData
                         contextKey:(NSString *)contextKey
                            resolve:(RCTPromiseResolveBlock)resolve
                             reject:(RCTPromiseRejectBlock)reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.noCodesSandwich setScreenPresentationConfig:configData forContextKey:contextKey];
    });
}

- (void)showScreen:(NSString *)contextKey
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.noCodesSandwich showScreen:contextKey];
    });
}

- (void)close:(RCTPromiseResolveBlock)resolve
       reject:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.noCodesSandwich close];
    });
}


#pragma mark - NoCodesEventListener

- (void)noCodesDidTriggerWithEvent:(NSString * _Nonnull)event payload:(NSDictionary<NSString *,id> * _Nullable)payload {
    [self emitOnNoCodeEvent:@{@"name": event, @"payload": payload}];
}

#pragma mark - TurboModule

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeNoCodesModuleSpecJSI>(params);
}

@end
