#import "RNQonversion.h"

static NSString *const kEventEntitlementsUpdated = @"entitlements_updated";
static NSString *const kEventPromoPurchaseReceived = @"promo_purchase_received";
static NSString *const errorCodePurchaseCancelledByUser = @"PURCHASE_CANCELLED_BY_USER";

@interface RNQonversion () <QonversionEventListener>

@property (nonatomic, strong) NSMutableDictionary *promoPurchasesExecutionBlocks;
@property (nonatomic, strong) QonversionSandwich *qonversionSandwich;

@end

@implementation RNQonversion

- (instancetype)init {
  self = [super init];

  if (self) {
    _qonversionSandwich = [[QonversionSandwich alloc] initWithQonversionEventListener:self];
  }

  return self;
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(storeSDKInfo:(NSString *)source version:(NSString *)version) {
    [_qonversionSandwich storeSdkInfoWithSource:source version:version];
}

RCT_EXPORT_METHOD(initializeSdk:(NSString *)key launchMode:(NSString *)launchModeKey environment:(NSString *)environmentKey cacheLifetime:(NSString *)cacheLifetimeKey proxyUrl:(NSString *)proxyUrl kidsMode:(BOOL)kidsMode) {
    [_qonversionSandwich initializeWithProjectKey:key launchModeKey:launchModeKey environmentKey:environmentKey entitlementsCacheLifetimeKey:cacheLifetimeKey proxyUrl:proxyUrl];
}

RCT_EXPORT_METHOD(syncHistoricalData) {
    [_qonversionSandwich syncHistoricalData];
}

RCT_EXPORT_METHOD(syncStoreKit2Purchases) {
    [_qonversionSandwich syncStoreKit2Purchases];
}

RCT_EXPORT_METHOD(getPromotionalOffer:(NSString *)productId discountId:(NSString *)discountId completion:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich getPromotionalOffer:productId productDiscountId:discountId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(purchase:(NSString *)productId quantity:(NSInteger)quantity contextKeys:(NSArray *)contextKeys promoOffer:(NSDictionary *)promoOffer completion:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich purchase:productId quantity:quantity contextKeys:contextKeys promoOffer:promoOffer completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(setDefinedProperty:(NSString *)property value:(NSString *)value) {
    [_qonversionSandwich setDefinedProperty:property value:value];
}

RCT_EXPORT_METHOD(setCustomProperty:(NSString *)property value:(NSString *)value) {
    [_qonversionSandwich setCustomProperty:property value:value];
}

RCT_EXPORT_METHOD(userProperties:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich userProperties:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(addAttributionData:(NSDictionary *)data provider:(NSString *)provider) {
    [_qonversionSandwich attributionWithProviderKey:provider value:data];
}

RCT_EXPORT_METHOD(checkEntitlements:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich checkEntitlements:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(products:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich products:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(offerings:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich offerings:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(checkTrialIntroEligibilityForProductIds:(NSArray *)data completion:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich checkTrialIntroEligibility:data completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(restore:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich restore:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(identify:(NSString *)userId completion:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich identify:userId :^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(logout) {
    [_qonversionSandwich logout];
}

RCT_EXPORT_METHOD(userInfo:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich userInfo:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(remoteConfig:(NSString *)contextKey completion:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich remoteConfig:contextKey :^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(remoteConfigList:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
  [_qonversionSandwich remoteConfigList:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
    [self handleResult:result error:error completion:completion rejecter:reject];
  }];
}

RCT_EXPORT_METHOD(remoteConfigListForContextKeys:(NSArray<NSString *> *)contextKeys includeEmptyContextKey:(BOOL)includeEmptyContextKey completion:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
  [_qonversionSandwich remoteConfigList:contextKeys includeEmptyContextKey:includeEmptyContextKey :^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
    [self handleResult:result error:error completion:completion rejecter:reject];
  }];
}

RCT_EXPORT_METHOD(attachUserToExperiment:(NSString *)experimentId groupId:(NSString *)groupId completion:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich attachUserToExperimentWith:experimentId groupId:groupId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(detachUserFromExperiment:(NSString *)experimentId completion:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich detachUserFromExperimentWith:experimentId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(attachUserToRemoteConfiguration:(NSString *)remoteConfigurationId completion:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich attachUserToRemoteConfigurationWith:remoteConfigurationId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(detachUserFromRemoteConfiguration:(NSString *)remoteConfigurationId completion:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich detachUserFromRemoteConfigurationWith:remoteConfigurationId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(isFallbackFileAccessible:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich isFallbackFileAccessibleWithCompletion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(collectAdvertisingID) {
    [_qonversionSandwich collectAdvertisingId];
}

RCT_EXPORT_METHOD(collectAppleSearchAdsAttribution) {
    [_qonversionSandwich collectAppleSearchAdsAttribution];
}

RCT_EXPORT_METHOD(promoPurchase:(NSString *)storeProductId completion:(RCTPromiseResolveBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich promoPurchase:storeProductId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(presentCodeRedemptionSheet) {
    if (@available(iOS 14.0, *)) {
        [_qonversionSandwich presentCodeRedemptionSheet];
    }
}

#pragma mark - Private

- (void)handleResult:(NSDictionary *)result
               error:(SandwichError *)error
          completion:(RCTPromiseResolveBlock)completion
            rejecter:(RCTPromiseRejectBlock)reject {
    if (error) {
        reject(error.code, error.details, nil);

        return;
    }

    if (result) {
        completion(result);
    } else {
        completion(@{});
    }
}

#pragma mark - QonversionEventListener

- (void)shouldPurchasePromoProductWith:(NSString * _Nonnull)productId {
    [self sendEventWithName:kEventPromoPurchaseReceived body:productId];
}

- (void)qonversionDidReceiveUpdatedEntitlements:(NSDictionary<NSString *,id> * _Nonnull)entitlements {
    [self sendEventWithName:kEventEntitlementsUpdated body:entitlements];
}

#pragma mark - Emitter

- (NSArray<NSString *> *)supportedEvents {
    return @[kEventEntitlementsUpdated, kEventPromoPurchaseReceived];
}

@end
