#import "RNQonversion.h"
#import "qonversion_react_native_sdk-Swift.h"

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

- (void)storeSDKInfo:(nonnull NSString *)sdkName sdkVersion:(nonnull NSString *)sdkVersion {
    [self.impl storeSDKInfo:sdkName version:sdkVersion];
}

- (void)initializeSdk:(nonnull NSString *)projectKey launchMode:(nonnull NSString *)launchModeKey environment:(nonnull NSString *)environmentKey entitlementsCacheLifetime:(nonnull NSString *)cacheLifetimeKey proxyUrl:(NSString * _Nullable)proxyUrl kidsMode:(BOOL)kidsMode {
    [self.impl initializeSdk:projectKey launchModeKey:launchModeKey environmentKey:environmentKey cacheLifetimeKey:cacheLifetimeKey proxyUrl:proxyUrl kidsMode:kidsMode];
}

- (void)syncHistoricalData {
    [self.impl syncHistoricalData];
}

- (void)syncStoreKit2Purchases {
    [self.impl syncStoreKit2Purchases];
}

- (void)getPromotionalOffer:(nonnull NSString *)productId discount:(NSString * _Nullable)discountId resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
    [self.impl getPromotionalOffer:productId discountId:discountId resolve:resolve reject:reject];
}

- (void)purchase:(nonnull NSString *)productId quantity:(double)quantity contextKeys:(NSArray * _Nullable)contextKeys promoOffer:(JS::NativeQonversionModule::QPromoOfferDetails &)promoOffer offerId:(NSString * _Nullable)offerId applyOffer:(BOOL)applyOffer oldProductId:(NSString * _Nullable)oldProductId updatePolicyKey:(NSString * _Nullable)updatePolicyKey resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
    NSDictionary *promoOfferDict = convertPromoOfferDetailsToDictionary(promoOffer);
    [self.impl purchase:productId quantity:quantity contextKeys:contextKeys promoOffer:promoOfferDict resolve:resolve reject:reject];
}

- (void)setDefinedProperty:(NSString *)property value:(NSString *)value {
    [self.impl setDefinedProperty:property value:value];
}

- (void)setCustomProperty:(NSString *)property value:(NSString *)value {
    [self.impl setCustomProperty:property value:value];
}

- (void)userProperties:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.impl userProperties:resolve reject:reject];
}

- (void)addAttributionData:(NSDictionary *)data provider:(NSString *)provider {
    [self.impl addAttributionData:data provider:provider];
}

- (void)checkEntitlements:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.impl checkEntitlements:resolve reject:reject];
}

- (void)products:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.impl products:resolve reject:reject];
}

- (void)offerings:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.impl offerings:resolve reject:reject];
}

- (void)checkTrialIntroEligibilityForProductIds:(NSArray *)data resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.impl checkTrialIntroEligibilityForProductIds:data resolve:resolve reject:reject];
}

- (void)restore:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.impl restore:resolve reject:reject];
}

- (void)identify:(NSString *)userId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.impl identify:userId resolve:resolve reject:reject];
}

- (void)logout {
    [self.impl logout];
}

- (void)userInfo:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.impl userInfo:resolve reject:reject];
}

- (void)remoteConfig:(NSString *)contextKey resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.impl remoteConfig:contextKey resolve:resolve reject:reject];
}

- (void)remoteConfigList:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.impl remoteConfigList:resolve reject:reject];
}

- (void)remoteConfigListForContextKeys:(NSArray<NSString *> *)contextKeys includeEmptyContextKey:(BOOL)includeEmptyContextKey resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.impl remoteConfigListForContextKeys:contextKeys includeEmptyContextKey:includeEmptyContextKey resolve:resolve reject:reject];
}

- (void)attachUserToExperiment:(NSString *)experimentId groupId:(NSString *)groupId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.impl attachUserToExperiment:experimentId groupId:groupId resolve:resolve reject:reject];
}

- (void)detachUserFromExperiment:(NSString *)experimentId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.impl detachUserFromExperiment:experimentId resolve:resolve reject:reject];
}

- (void)attachUserToRemoteConfiguration:(NSString *)remoteConfigurationId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.impl attachUserToRemoteConfiguration:remoteConfigurationId resolve:resolve reject:reject];
}

- (void)detachUserFromRemoteConfiguration:(NSString *)remoteConfigurationId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.impl detachUserFromRemoteConfiguration:remoteConfigurationId resolve:resolve reject:reject];
}

- (void)isFallbackFileAccessible:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.impl isFallbackFileAccessible:resolve reject:reject];
}

- (void)collectAdvertisingId {
    [self.impl collectAdvertisingID];
}

- (void)collectAppleSearchAdsAttribution {
    [self.impl collectAppleSearchAdsAttribution];
}

- (void)promoPurchase:(NSString *)storeProductId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self.impl promoPurchase:storeProductId resolve:resolve reject:reject];
}

- (void)presentCodeRedemptionSheet {
    [self.impl presentCodeRedemptionSheet];
}

- (void)syncPurchases {
    // Android only.
}

- (void)updatePurchase:(nonnull NSString *)productId offerId:(NSString * _Nullable)offerId applyOffer:(BOOL)applyOffer oldProductId:(NSString * _Nullable)oldProductId updatePolicyKey:(NSString * _Nullable)updatePolicyKey resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
    // Android only
}


- (void)qonversionDidReceiveUpdatedEntitlements:(NSDictionary<NSString *,id> * _Nonnull)entitlements { 
    [self emitOnEntitlementsUpdated:entitlements];
}

- (void)shouldPurchasePromoProductWith:(NSString * _Nonnull)productId { 
    [self emitOnPromoPurchaseReceived:productId];
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
