#import "RNNoCodes.h"

static NSString *const kNoCodesEventName = @"NoCodesEvent";

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
    return @[kNoCodesEventName];
}

RCT_EXPORT_METHOD(initialize:(NSString *)projectKey
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    [self.noCodesSandwich initializeWithProjectKey:projectKey];
    resolve(nil);
}

RCT_EXPORT_METHOD(setScreenPresentationConfig:(NSDictionary *)configData
                  contextKey:(NSString *)contextKey
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.noCodesSandwich setScreenPresentationConfig:configData forContextKey:contextKey];
        resolve(nil);
    });
}

RCT_EXPORT_METHOD(showScreen:(NSString *)contextKey
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.noCodesSandwich showScreen:contextKey];
        resolve(nil);
    });
}

RCT_EXPORT_METHOD(close:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.noCodesSandwich close];
        resolve(nil);
    });
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (void)noCodesDidTriggerWithEvent:(NSString * _Nonnull)event payload:(NSDictionary<NSString *,id> * _Nullable)payload {
    NSMutableDictionary *eventData = [NSMutableDictionary dictionary];
    eventData[@"event"] = event;
    if (payload) {
        eventData[@"payload"] = payload;
    }
    
    [self sendEventWithName:kNoCodesEventName body:eventData];
}

@end
