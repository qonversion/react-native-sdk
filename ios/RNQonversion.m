#import "RNQonversion.h"

static NSString *const kEventPermissionsUpdated = @"permissions_updated";
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

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(storeSDKInfo:(NSString *)source version:(NSString *)version) {
    [_qonversionSandwich storeSdkInfoWithSource:source version:version];
}

RCT_EXPORT_METHOD(launch:(NSString *)key observerMode:(BOOL)observerMode completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich launchWithProjectKey:key completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(setDefinedProperty:(NSString *)property value:(NSString *)value) {
    [_qonversionSandwich setDefinedProperty:property value:value];
}

RCT_EXPORT_METHOD(setCustomProperty:(NSString *)property value:(NSString *)value) {
    [_qonversionSandwich setCustomProperty:property value:value];
}

RCT_EXPORT_METHOD(addAttributionData:(NSDictionary *)data provider:(NSString *)provider) {
    [_qonversionSandwich addAttributionDataWithSourceKey:provider value:data];
}

RCT_EXPORT_METHOD(checkPermissions:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich checkPermissions:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(purchaseProduct:(NSString *)productId offeringId:(NSString *)offeringId completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich purchaseProduct:productId offeringId:offeringId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handlePurchaseResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(purchase:(NSString *)productId completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich purchase:productId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handlePurchaseResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(products:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich products:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(restore:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich restore:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(setDebugMode) {
    [_qonversionSandwich setDebugMode];
}

RCT_EXPORT_METHOD(offerings:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich offerings:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(checkTrialIntroEligibilityForProductIds:(NSArray *)data completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich checkTrialIntroEligibility:data completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(experiments:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich experiments:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handleResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(identify:(NSString *)userId) {
    [_qonversionSandwich identify:userId];
}

RCT_EXPORT_METHOD(logout) {
    [_qonversionSandwich logout];
}

RCT_EXPORT_METHOD(setAdvertisingID) {
    [_qonversionSandwich setAdvertisingId];
}

RCT_EXPORT_METHOD(setAppleSearchAdsAttributionEnabled:(BOOL)enabled) {
    [_qonversionSandwich setAppleSearchAdsAttributionEnabled:enabled];
}

RCT_EXPORT_METHOD(setNotificationsToken:(NSString *)token) {
    [_qonversionSandwich setNotificationToken:token];
}

RCT_EXPORT_METHOD(getNotificationCustomPayload:(NSDictionary *)notificationData
                  completion:(RCTResponseSenderBlock)completion
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if (![notificationData isKindOfClass:[NSDictionary class]]) {
        completion(nil);
        return;
    }

    NSDictionary *payload = [_qonversionSandwich getNotificationCustomPayload:notificationData];
    completion(@[payload]);
}

RCT_EXPORT_METHOD(handleNotification:(NSDictionary *)notificationData
                  completion:(RCTResponseSenderBlock)completion
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if (![notificationData isKindOfClass:[NSDictionary class]]) {
        completion(@[@(NO)]);
        return;
    }

    BOOL isQonversionNotification = [_qonversionSandwich handleNotification:notificationData];
    completion(@[@(isQonversionNotification)]);
}

RCT_EXPORT_METHOD(promoPurchase:(NSString *)storeProductId completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [_qonversionSandwich promoPurchase:storeProductId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        [self handlePurchaseResult:result error:error completion:completion rejecter:reject];
    }];
}

RCT_EXPORT_METHOD(presentCodeRedemptionSheet) {
    if (@available(iOS 14.0, *)) {
        [_qonversionSandwich presentCodeRedemptionSheet];
    }
}

RCT_EXPORT_METHOD(setPermissionsCacheLifetime:(NSString *)lifetime) {
    [_qonversionSandwich setPermissionsCacheLifetime:lifetime];
}

#pragma mark - Private

- (void)handleResult:(NSDictionary *)result
               error:(SandwichError *)error
          completion:(RCTResponseSenderBlock)completion
            rejecter:(RCTPromiseRejectBlock)reject {
    if (error) {
        reject(error.code, error.details, nil);

        return;
    }

    completion(@[result]);
}

- (void)handlePurchaseResult:(NSDictionary *)result
                       error:(SandwichError *)error
                  completion:(RCTResponseSenderBlock)completion
                    rejecter:(RCTPromiseRejectBlock)reject {
    if (error) {
        NSNumber *isCancelled = error.additionalInfo[@"isCancelled"];
        if (isCancelled.boolValue == true) {
          reject(errorCodePurchaseCancelledByUser, error.details, nil);
        } else {
          reject(error.code, error.details, nil);
        }
        return;
    }

    completion(@[result]);
}

#pragma mark - QonversionEventListener

- (void)qonversionDidReceiveUpdatedPermissions:(NSDictionary<NSString *, id> * _Nonnull)permissions {
    [self sendEventWithName:kEventPermissionsUpdated body:permissions];
}

- (void)shouldPurchasePromoProductWith:(NSString * _Nonnull)productId {
    [self sendEventWithName:kEventPromoPurchaseReceived body:productId];
}

#pragma mark - Emitter

- (NSArray<NSString *> *)supportedEvents {
    return @[kEventPermissionsUpdated, kEventPromoPurchaseReceived];
}

@end
