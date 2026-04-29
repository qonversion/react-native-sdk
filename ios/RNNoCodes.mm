#import "RNNoCodes.h"
#if __has_include(<qonversion_react_native_sdk/qonversion_react_native_sdk-Swift.h>)
#import <qonversion_react_native_sdk/qonversion_react_native_sdk-Swift.h>
#else
#import "qonversion_react_native_sdk-Swift.h"
#endif

#define QNR_LOG_EXCEPTION(method, exception) \
    NSLog(@"[Qonversion] Caught NSException in %s: %@ — %@", method, exception.name, exception.reason)

@interface RNNoCodes () <NoCodesEventDelegate, NoCodesPurchaseDelegateProxy>

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

#pragma mark - Void Methods

- (void)initialize:(NSString *)projectKey
            source:(NSString *)source
           version:(NSString *)version
          proxyUrl:(NSString *)proxyUrl
            locale:(NSString *)locale
             theme:(NSString *)theme {
    @try {
        [self.impl initializeWithProjectKey:projectKey source:source version:version proxyUrl:proxyUrl locale:locale theme:theme];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("initialize", exception);
    }
}

- (void)setScreenPresentationConfig:(NSDictionary *)configData
                        contextKey:(NSString *)contextKey
                           resolve:(RCTPromiseResolveBlock)resolve
                            reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl setScreenPresentationConfig:configData contextKey:contextKey];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("setScreenPresentationConfig", exception);
    }
}

- (void)showScreen:(NSString *)contextKey
   customVariables:(NSDictionary *)customVariables
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
    NSDictionary<NSString *, NSString *> *typedVariables = nil;
    if ([customVariables isKindOfClass:[NSDictionary class]]) {
        NSMutableDictionary<NSString *, NSString *> *typed = [NSMutableDictionary dictionaryWithCapacity:customVariables.count];
        for (NSString *key in customVariables) {
            id value = customVariables[key];
            if ([key isKindOfClass:[NSString class]] && [value isKindOfClass:[NSString class]]) {
                typed[key] = value;
            }
        }
        typedVariables = typed;
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            [self.impl showScreenWithContextKey:contextKey customVariables:typedVariables];
        } @catch (NSException *exception) {
            QNR_LOG_EXCEPTION("showScreen", exception);
        }
    });
}

- (void)close:(RCTPromiseResolveBlock)resolve
      reject:(RCTPromiseRejectBlock)reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            [self.impl close];
        } @catch (NSException *exception) {
            QNR_LOG_EXCEPTION("close", exception);
        }
    });
}

- (void)setPurchaseDelegate {
    @try {
        [self.impl setPurchaseDelegate:self];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("setPurchaseDelegate", exception);
    }
}

- (void)delegatedPurchaseCompleted {
    @try {
        [self.impl delegatedPurchaseCompleted];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("delegatedPurchaseCompleted", exception);
    }
}

- (void)delegatedPurchaseFailed:(NSString *)errorMessage {
    @try {
        [self.impl delegatedPurchaseFailed:errorMessage];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("delegatedPurchaseFailed", exception);
    }
}

- (void)delegatedRestoreCompleted {
    @try {
        [self.impl delegatedRestoreCompleted];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("delegatedRestoreCompleted", exception);
    }
}

- (void)delegatedRestoreFailed:(NSString *)errorMessage {
    @try {
        [self.impl delegatedRestoreFailed:errorMessage];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("delegatedRestoreFailed", exception);
    }
}

- (void)setLocale:(NSString *)locale {
    @try {
        [self.impl setLocale:locale];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("setLocale", exception);
    }
}

- (void)setTheme:(NSString *)theme {
    @try {
        [self.impl setTheme:theme];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("setTheme", exception);
    }
}

#pragma mark - Delegate Callbacks

- (void)noCodesDidTriggerWithEvent:(NSString * _Nonnull)event payload:(NSDictionary<NSString *,id> * _Nullable)payload {
    @try {
        [self emitOnNoCodeEvent:@{@"name": event, @"payload": payload ?: [NSNull null]}];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("noCodesDidTriggerWithEvent", exception);
    }
}

- (void)purchase:(NSDictionary *)product {
    @try {
        [self emitOnNoCodePurchase:product];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("purchase (NoCodes delegate)", exception);
    }
}

- (void)restore {
    @try {
        [self emitOnNoCodeRestore];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("restore (NoCodes delegate)", exception);
    }
}

#pragma mark - TurboModule

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeNoCodesModuleSpecJSI>(params);
}

@end
