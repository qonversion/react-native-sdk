#import "RNQonversion.h"
#if __has_include(<qonversion_react_native_sdk/qonversion_react_native_sdk-Swift.h>)
#import <qonversion_react_native_sdk/qonversion_react_native_sdk-Swift.h>
#else
#import "qonversion_react_native_sdk-Swift.h"
#endif

#define QNR_LOG_EXCEPTION(method, exception) \
    NSLog(@"[Qonversion] Caught NSException in %s: %@ — %@", method, exception.name, exception.reason)

@interface RNQonversion () <QonversionEventDelegate>

@property (nonatomic, strong) RNQonversionImpl *impl;

@end

@implementation RNQonversion RCT_EXPORT_MODULE()

- (instancetype)init {
    self = [super init];
    if (self) {
        _impl = [[RNQonversionImpl alloc] init];
        [_impl setDelegate:self];
    }
    return self;
}

#pragma mark - Void Methods

- (void)storeSDKInfo:(nonnull NSString *)sdkName sdkVersion:(nonnull NSString *)sdkVersion {
    @try {
        [self.impl storeSDKInfo:sdkName version:sdkVersion];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("storeSDKInfo", exception);
    }
}

- (void)initializeSdk:(nonnull NSString *)projectKey launchMode:(nonnull NSString *)launchModeKey environment:(nonnull NSString *)environmentKey entitlementsCacheLifetime:(nonnull NSString *)cacheLifetimeKey proxyUrl:(NSString * _Nullable)proxyUrl kidsMode:(BOOL)kidsMode {
    @try {
        [self.impl initializeSdk:projectKey launchModeKey:launchModeKey environmentKey:environmentKey cacheLifetimeKey:cacheLifetimeKey proxyUrl:proxyUrl kidsMode:kidsMode];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("initializeSdk", exception);
    }
}

- (void)syncHistoricalData {
    @try {
        [self.impl syncHistoricalData];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("syncHistoricalData", exception);
    }
}

- (void)syncStoreKit2Purchases {
    @try {
        [self.impl syncStoreKit2Purchases];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("syncStoreKit2Purchases", exception);
    }
}

- (void)setDefinedProperty:(NSString *)property value:(NSString *)value {
    @try {
        [self.impl setDefinedProperty:property value:value];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("setDefinedProperty", exception);
    }
}

- (void)setCustomProperty:(NSString *)property value:(NSString *)value {
    @try {
        [self.impl setCustomProperty:property value:value];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("setCustomProperty", exception);
    }
}

- (void)addAttributionData:(NSDictionary *)data provider:(NSString *)provider {
    @try {
        [self.impl addAttributionData:data provider:provider];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("addAttributionData", exception);
    }
}

- (void)logout {
    @try {
        [self.impl logout];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("logout", exception);
    }
}

- (void)collectAdvertisingId {
    @try {
        [self.impl collectAdvertisingId];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("collectAdvertisingId", exception);
    }
}

- (void)collectAppleSearchAdsAttribution {
    @try {
        [self.impl collectAppleSearchAdsAttribution];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("collectAppleSearchAdsAttribution", exception);
    }
}

- (void)presentCodeRedemptionSheet {
    @try {
        [self.impl presentCodeRedemptionSheet];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("presentCodeRedemptionSheet", exception);
    }
}

- (void)syncPurchases {
    // Android only.
}

#pragma mark - Promise Methods

- (void)getPromotionalOffer:(nonnull NSString *)productId discount:(NSString * _Nullable)discountId resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
    @try {
        [self.impl getPromotionalOffer:productId discountId:discountId resolve:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("getPromotionalOffer", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)purchase:(nonnull NSString *)productId quantity:(double)quantity contextKeys:(NSArray * _Nullable)contextKeys promoOffer:(JS::NativeQonversionModule::QPromoOfferDetails &)promoOffer offerId:(NSString * _Nullable)offerId applyOffer:(BOOL)applyOffer oldProductId:(NSString * _Nullable)oldProductId updatePolicyKey:(NSString * _Nullable)updatePolicyKey resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
    @try {
        NSDictionary *promoOfferDict = convertPromoOfferDetailsToDictionary(promoOffer);
        [self.impl purchase:productId quantity:quantity contextKeys:contextKeys promoOffer:promoOfferDict resolve:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("purchase", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)purchaseWithResult:(nonnull NSString *)productId quantity:(double)quantity contextKeys:(NSArray * _Nullable)contextKeys promoOffer:(JS::NativeQonversionModule::QPromoOfferDetails &)promoOffer offerId:(NSString * _Nullable)offerId applyOffer:(BOOL)applyOffer oldProductId:(NSString * _Nullable)oldProductId updatePolicyKey:(NSString * _Nullable)updatePolicyKey resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
    @try {
        NSDictionary *promoOfferDict = convertPromoOfferDetailsToDictionary(promoOffer);
        [self.impl purchaseWithResult:productId quantity:quantity contextKeys:contextKeys promoOffer:promoOfferDict resolve:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("purchaseWithResult", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)userProperties:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl userProperties:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("userProperties", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)checkEntitlements:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl checkEntitlements:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("checkEntitlements", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)products:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl products:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("products", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)offerings:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl offerings:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("offerings", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)checkTrialIntroEligibilityForProductIds:(NSArray *)data resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl checkTrialIntroEligibilityForProductIds:data resolve:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("checkTrialIntroEligibility", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)restore:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl restore:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("restore", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)identify:(NSString *)userId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl identify:userId resolve:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("identify", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)userInfo:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl userInfo:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("userInfo", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)remoteConfig:(NSString * _Nullable)contextKey resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl remoteConfig:contextKey resolve:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("remoteConfig", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)remoteConfigList:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl remoteConfigList:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("remoteConfigList", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)remoteConfigListForContextKeys:(NSArray<NSString *> *)contextKeys includeEmptyContextKey:(BOOL)includeEmptyContextKey resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl remoteConfigListForContextKeys:contextKeys includeEmptyContextKey:includeEmptyContextKey resolve:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("remoteConfigListForContextKeys", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)attachUserToExperiment:(NSString *)experimentId groupId:(NSString *)groupId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl attachUserToExperiment:experimentId groupId:groupId resolve:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("attachUserToExperiment", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)detachUserFromExperiment:(NSString *)experimentId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl detachUserFromExperiment:experimentId resolve:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("detachUserFromExperiment", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)attachUserToRemoteConfiguration:(NSString *)remoteConfigurationId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl attachUserToRemoteConfiguration:remoteConfigurationId resolve:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("attachUserToRemoteConfiguration", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)detachUserFromRemoteConfiguration:(NSString *)remoteConfigurationId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl detachUserFromRemoteConfiguration:remoteConfigurationId resolve:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("detachUserFromRemoteConfiguration", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)isFallbackFileAccessible:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl isFallbackFileAccessible:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("isFallbackFileAccessible", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)promoPurchase:(NSString *)storeProductId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [self.impl promoPurchase:storeProductId resolve:resolve reject:reject];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("promoPurchase", exception);
        reject(@"QONBridgeException", exception.reason, nil);
    }
}

- (void)updatePurchase:(nonnull NSString *)productId offerId:(NSString * _Nullable)offerId applyOffer:(BOOL)applyOffer oldProductId:(NSString * _Nullable)oldProductId updatePolicyKey:(NSString * _Nullable)updatePolicyKey resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
    // Android only
}

#pragma mark - Delegate Callbacks

- (void)qonversionDidReceiveUpdatedEntitlements:(NSDictionary<NSString *,id> * _Nonnull)entitlements {
    @try {
        [self emitOnEntitlementsUpdated:entitlements];
        [self emitOnDeferredPurchaseCompleted:entitlements];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("qonversionDidReceiveUpdatedEntitlements", exception);
    }
}

- (void)shouldPurchasePromoProductWith:(NSString * _Nonnull)productId {
    @try {
        [self emitOnPromoPurchaseReceived:productId];
    } @catch (NSException *exception) {
        QNR_LOG_EXCEPTION("shouldPurchasePromoProductWith", exception);
    }
}

#pragma mark - Private

NSDictionary *convertPromoOfferDetailsToDictionary(JS::NativeQonversionModule::QPromoOfferDetails &promoOffer) {
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    if (promoOffer.productDiscountId()) {
        dict[@"productDiscountId"] = promoOffer.productDiscountId();
    }
    if (promoOffer.keyIdentifier()) {
        dict[@"keyIdentifier"] = promoOffer.keyIdentifier();
    }
    if (promoOffer.nonce()) {
        dict[@"nonce"] = promoOffer.nonce();
    }
    if (promoOffer.signature()) {
        dict[@"signature"] = promoOffer.signature();
    }
    if (promoOffer.timestamp()) {
        dict[@"timestamp"] = @(promoOffer.timestamp().value());
    }
    return [dict copy];
}

#pragma mark - TurboModule

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeQonversionModuleSpecJSI>(params);
}

@end
