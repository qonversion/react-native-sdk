#import "RNQonversion.h"
#import "EntitiesConverter.h"
@import QonversionSandwich;

typedef void (^DefaultResultCompletion)(void);

static NSString *const kEventPermissionsUpdated = @"permissions_updated";
static NSString *const kEventPromoPurchaseReceived = @"promo_purchase_received";

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
    [self.qonversionSandwich storeSdkInfoWithSource:source version:version];
}

RCT_EXPORT_METHOD(launch:(NSString *)key observerMode:(BOOL)observerMode completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.qonversionSandwich launchWithProjectKey:key completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        if (error) {
            reject(error.code, error.details, error.originError);

            return;
        }

        completion(@[result]);
    }];
}

RCT_EXPORT_METHOD(setProperty:(NSString *)property value:(NSString *)value)
{
    [self.qonversionSandwich setDefinedProperty:property value:value];
}

RCT_EXPORT_METHOD(setUserProperty:(NSString *)property value:(NSString *)value)
{
    [self.qonversionSandwich setCustomProperty:property value:value];
}

RCT_EXPORT_METHOD(addAttributionData:(NSDictionary *)data provider:(NSString *)provider)
{
    [self.qonversionSandwich addAttributionDataWithSourceKey:provider value:data];
}

RCT_EXPORT_METHOD(checkPermissions:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.qonversionSandwich checkPermissions:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        if (error) {
            reject(error.code, error.details, error.originError);

            return;
        }

        completion(@[result]);
    }];
}

RCT_EXPORT_METHOD(purchaseProduct:(NSString *)productId offeringId:(NSString *)offeringId completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.qonversionSandwich purchaseProduct:productId offeringId:offeringId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        if (error) {
            reject(error.code, error.details, error.originError);

            return;
        }

        completion(@[result]);
    }];
}

RCT_EXPORT_METHOD(purchase:(NSString *)productId completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.qonversionSandwich purchase:productId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        if (error) {
            reject(error.code, error.details, error.originError);

            return;
        }

        completion(@[result]);
    }];
}

RCT_EXPORT_METHOD(products:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.qonversionSandwich products:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        if (error) {
            reject(error.code, error.details, error.originError);

            return;
        }

        completion(@[result]);
    }];
}

RCT_EXPORT_METHOD(restore:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.qonversionSandwich restore:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        if (error) {
            reject(error.code, error.details, error.originError);

            return;
        }

        completion(@[result]);
    }];
}

RCT_EXPORT_METHOD(setDebugMode) {
    [self.qonversionSandwich setDebugMode];
}

RCT_EXPORT_METHOD(offerings:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.qonversionSandwich offerings:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        if (error) {
            reject(error.code, error.details, error.originError);

            return;
        }

        completion(@[result]);
    }];
}

RCT_EXPORT_METHOD(checkTrialIntroEligibilityForProductIds:(NSArray *)data completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.qonversionSandwich checkTrialIntroEligibility:data completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        if (error) {
            reject(error.code, error.details, error.originError);

            return;
        }

        completion(@[result]);
    }];
}

RCT_EXPORT_METHOD(experiments:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.qonversionSandwich experiments:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        if (error) {
            reject(error.code, error.details, error.originError);

            return;
        }

        completion(@[result]);
    }];
}

RCT_EXPORT_METHOD(identify:(NSString *)userId)
{
    [self.qonversionSandwich identify:userId];
}

RCT_EXPORT_METHOD(logout)
{
    [self.qonversionSandwich logout];
}

RCT_EXPORT_METHOD(setAdvertisingID) {
    [self.qonversionSandwich setAdvertisingId];
}

RCT_EXPORT_METHOD(setAppleSearchAdsAttributionEnabled:(BOOL)enabled) {
    [self.qonversionSandwich setAppleSearchAdsAttributionEnabled:enabled];
}

RCT_EXPORT_METHOD(setNotificationsToken:(NSString *)token) {
    [self.qonversionSandwich setNotificationToken:token];
}

RCT_EXPORT_METHOD(handleNotification:(NSDictionary *)notificationData
                  completion:(RCTResponseSenderBlock)completion
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if (![notificationData isKindOfClass:[NSDictionary class]]) {
        completion(@[@(NO)]);
        return;
    }

    BOOL isQonversionNotification = [self.qonversionSandwich handleNotification:notificationData];
    completion(@[@(isQonversionNotification)]);
}

RCT_EXPORT_METHOD(promoPurchase:(NSString *)storeProductId completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    [self.qonversionSandwich promoPurchase:storeProductId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
        if (error) {
            reject(error.code, error.details, error.originError);
        } else {
            completion(@[result]);
        }
    }];
}

RCT_EXPORT_METHOD(setPermissionsCacheLifetime:(NSString *)lifetime)
{
    NSNumber *lifetimeNumber = [EntitiesConverter permissionsCacheLifetimeForString:lifetime];

    if (lifetimeNumber) {
        [Qonversion setPermissionsCacheLifetime:lifetimeNumber.integerValue];
    }
}

#pragma mark - Private

- (void)handleResult:(NSDictionary *)result
               error:(SandwichError *)error
                   completion:(RCTResponseSenderBlock)completion
                     rejecter:(RCTPromiseRejectBlock)reject {
    if (error) {
        reject(error.code, error.details, error.originError);

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

- (DefaultResultCompletion)configureResultCompletion:(RCTResponseSenderBlock)responseBlock
                                            rejecter:(RCTPromiseRejectBlock)reject
                                            response:(NSDictionary<NSString *, id> *)response
                                               error:(SandwichError *)error {
    DefaultResultCompletion completion = ^{
        if (error) {
            reject(error.code, error.details, error.originError);

            return;
        }

        responseBlock(@[response]);
    };

  return completion;
}

@end
