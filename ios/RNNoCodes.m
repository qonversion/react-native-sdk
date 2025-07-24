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

- (NSArray<NSString *> *)supportedEvents {
    return [_noCodesSandwich getAvailableEvents];
}

RCT_EXPORT_METHOD(initialize:(NSString *)projectKey
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    [self.noCodesSandwich initializeWithProjectKey:projectKey];
}

RCT_EXPORT_METHOD(setScreenPresentationConfig:(NSDictionary *)configData
                  contextKey:(NSString *)contextKey
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.noCodesSandwich setScreenPresentationConfig:configData forContextKey:contextKey];
    });
}

RCT_EXPORT_METHOD(showScreen:(NSString *)contextKey
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.noCodesSandwich showScreen:contextKey];
    });
}

RCT_EXPORT_METHOD(close:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.noCodesSandwich close];
    });
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (void)noCodesDidTriggerWithEvent:(NSString * _Nonnull)event payload:(NSDictionary<NSString *,id> * _Nullable)payload {
    [self sendEventWithName:event body:payload];
}

@end
