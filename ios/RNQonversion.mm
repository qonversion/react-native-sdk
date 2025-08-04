#import "RNQonversion.h"

@interface RNQonversion () <QonversionEventListener>

@property (nonatomic, strong) NSMutableDictionary *promoPurchasesExecutionBlocks;
@property (nonatomic, strong) QonversionSandwich *qonversionSandwich;

@end

@implementation RNQonversion
RCT_EXPORT_MODULE()

- (instancetype)init {
  self = [super init];

  if (self) {
    _qonversionSandwich = [[QonversionSandwich alloc] initWithQonversionEventListener:self];
  }

  return self;
}

- (void)storeSDKInfo:(NSString *)source version:(NSString *)version) {
    [_qonversionSandwich storeSdkInfoWithSource:source version:version];
}

- (void)initializeSdk:(NSString *)key launchMode:(NSString *)launchModeKey environment:(NSString *)environmentKey cacheLifetime:(NSString *)cacheLifetimeKey proxyUrl:(NSString *)proxyUrl kidsMode:(BOOL)kidsMode) {
    [_qonversionSandwich initializeWithProjectKey:key launchModeKey:launchModeKey environmentKey:environmentKey entitlementsCacheLifetimeKey:cacheLifetimeKey proxyUrl:proxyUrl];
}

- (void)syncHistoricalData) {
    [_qonversionSandwich syncHistoricalData];
}

- (void)syncStoreKit2Purchases) {
    [_qonversionSandwich syncStoreKit2Purchases];
}

- (void)getPromotionalOffer:(NSString *)productId discountId:(NSString *)discountId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich getPromotionalOffer:productId productDiscountId:discountId resolve:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error resolve:resolve reject:reject];
    }];
}

- (void)purchase:(NSString *)productId quantity:(NSInteger)quantity contextKeys:(NSArray *)contextKeys promoOffer:(NSDictionary *)promoOffer resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich purchase:productId quantity:quantity contextKeys:contextKeys promoOffer:promoOffer resolve:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error resolve:resolve reject:reject];
    }];
}

- (void)setDefinedProperty:(NSString *)property value:(NSString *)value) {
    [_qonversionSandwich setDefinedProperty:property value:value];
}

- (void)setCustomProperty:(NSString *)property value:(NSString *)value) {
    [_qonversionSandwich setCustomProperty:property value:value];
}

- (void)userProperties:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich userProperties:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error resolve:resolve reject:reject];
    }];
}

- (void)addAttributionData:(NSDictionary *)data provider:(NSString *)provider) {
    [_qonversionSandwich attributionWithProviderKey:provider value:data];
}

- (void)checkEntitlements:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich checkEntitlements:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error resolve:resolve reject:reject];
    }];
}

- (void)products:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich products:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error resolve:resolve reject:reject];
    }];
}

- (void)offerings:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich offerings:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error resolve:resolve reject:reject];
    }];
}

- (void)checkTrialIntroEligibilityForProductIds:(NSArray *)data resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich checkTrialIntroEligibility:data completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error resolve:resolve reject:reject];
    }];
}

- (void)restore:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich restore:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error resolve:resolve reject:reject];
    }];
}

- (void)identify:(NSString *)userId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich identify:userId :^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error resolve:resolve reject:reject];
    }];
}

- (void)logout) {
    [_qonversionSandwich logout];
}

- (void)userInfo:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich userInfo:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error resolve:resolve reject:reject];
    }];
}

- (void)remoteConfig:(NSString *)contextKey resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich remoteConfig:contextKey :^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error resolve:resolve reject:reject];
    }];
}

- (void)remoteConfigList:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  [_qonversionSandwich remoteConfigList:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
    [self handleResult:result error:error resolve:resolve reject:reject];
  }];
}

- (void)remoteConfigListForContextKeys:(NSArray<NSString *> *)contextKeys includeEmptyContextKey:(BOOL)includeEmptyContextKey resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  [_qonversionSandwich remoteConfigList:contextKeys includeEmptyContextKey:includeEmptyContextKey :^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
    [self handleResult:result error:error resolve:resolve reject:reject];
  }];
}

- (void)attachUserToExperiment:(NSString *)experimentId groupId:(NSString *)groupId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich attachUserToExperimentWith:experimentId groupId:groupId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error resolve:resolve reject:reject];
    }];
}

- (void)detachUserFromExperiment:(NSString *)experimentId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich detachUserFromExperimentWith:experimentId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error resolve:resolve reject:reject];
    }];
}

- (void)attachUserToRemoteConfiguration:(NSString *)remoteConfigurationId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich attachUserToRemoteConfigurationWith:remoteConfigurationId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error resolve:resolve reject:reject];
    }];
}

- (void)detachUserFromRemoteConfiguration:(NSString *)remoteConfigurationId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich detachUserFromRemoteConfigurationWith:remoteConfigurationId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error resolve:resolve reject:reject];
    }];
}

- (void)isFallbackFileAccessible:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich isFallbackFileAccessibleWithCompletion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error resolve:resolve reject:reject];
    }];
}

- (void)collectAdvertisingID) {
    [_qonversionSandwich collectAdvertisingId];
}

- (void)collectAppleSearchAdsAttribution) {
    [_qonversionSandwich collectAppleSearchAdsAttribution];
}

- (void)promoPurchase:(NSString *)storeProductId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich promoPurchase:storeProductId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error resolve:resolve reject:reject];
    }];
}

- (void)presentCodeRedemptionSheet) {
    if (@available(iOS 14.0, *)) {
        [_qonversionSandwich presentCodeRedemptionSheet];
    }
}

#pragma mark - QonversionEventListener

- (void)shouldPurchasePromoProductWith:(NSString * _Nonnull)productId {
    [self emitOnPromoPurchaseReceived:productId];
}

- (void)qonversionDidReceiveUpdatedEntitlements:(NSDictionary<NSString *,id> * _Nonnull)entitlements {
    [self emitOnEntitlementsUpdated:entitlements];
}

#pragma mark - TurboModule

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeQonversionModuleSpecJSI>(params);
}

#pragma mark - Private

- (void)handleResult:(NSDictionary *)result
               error:(SandwichError *)error
             resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
    if (error) {
        reject(error.code, error.details, nil);

        return;
    }

    if (result) {
        resolve(result);
    } else {
        resolve(@{});
    }
}

@end
