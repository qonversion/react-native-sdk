#import "RNQonversion.h"
#import "EntitiesConverter.h"

static NSString *const kEventPermissionsUpdated = @"permissions_updated";
static NSString *const kEventPromoPurchaseReceived = @"promo_purchase_received";

@interface RNQonversion () <QNPurchasesDelegate, QNPromoPurchasesDelegate>

@property (nonatomic, strong) NSMutableDictionary *promoPurchasesExecutionBlocks;

@end

@implementation RNQonversion

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(storeSDKInfo:(NSString *)sourceKey source:(NSString *)source versionKey:(NSString *)versionKey version:(NSString *)version) {
    [[NSUserDefaults standardUserDefaults] setValue:version forKey:versionKey];
    [[NSUserDefaults standardUserDefaults] setValue:source forKey:sourceKey];
}

RCT_EXPORT_METHOD(launchWithKey:(NSString *)key observerMode:(BOOL)observerMode completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [Qonversion launchWithKey:key completion:^(QNLaunchResult *result, NSError *error) {
        if (error) {
            NSString *errorCode = [@(error.code) stringValue];
            reject(errorCode, error.localizedDescription, error);

            return;
        }

        NSDictionary *launchResult = [EntitiesConverter convertLaunchResult:result];
        completion(@[launchResult]);
    }];
}

RCT_EXPORT_METHOD(setProperty:(NSString *)property value:(NSString *)value)
{
    NSNumber *propertyNumber = [EntitiesConverter propertyForString:property];

    if (propertyNumber) {
        [Qonversion setProperty:propertyNumber.integerValue value:value];
    }
}

RCT_EXPORT_METHOD(setUserProperty:(NSString *)property value:(NSString *)value)
{
    [Qonversion setUserProperty:property value:value];
}

RCT_EXPORT_METHOD(addAttributionData:(NSDictionary *)data provider:(NSInteger)provider)
{
    [Qonversion addAttributionData:data fromProvider:provider];
}

RCT_EXPORT_METHOD(checkPermissions:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [Qonversion checkPermissions:^(NSDictionary<NSString *,QNPermission *> *result, NSError *error) {
        if (error) {
            NSString *errorCode = [@(error.code) stringValue];
            reject(errorCode, error.localizedDescription, error);

            return;
        }

        NSDictionary *permissions = [EntitiesConverter convertPermissions:result.allValues];
        completion(@[permissions]);
    }];
}

RCT_EXPORT_METHOD(purchaseProduct:(NSString *)productId offeringId:(NSString *)offeringId completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [self purchaseWithId:productId offeringId:offeringId completion:completion rejecter:reject];
}

RCT_EXPORT_METHOD(purchase:(NSString *)productId completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [self purchaseWithId:productId offeringId:nil completion:completion rejecter: reject];
}

RCT_EXPORT_METHOD(products:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [Qonversion products:^(NSDictionary *result, NSError *error) {
        if (error) {
            NSString *errorCode = [@(error.code) stringValue];
            reject(errorCode, error.localizedDescription, error);

            return;
        }

        NSDictionary *products = [EntitiesConverter convertProducts:result.allValues];
        completion(@[products]);
    }];
}

RCT_EXPORT_METHOD(restore:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [Qonversion restoreWithCompletion:^(NSDictionary *result, NSError *error) {
        if (error) {
            NSString *errorCode = [@(error.code) stringValue];
            reject(errorCode, error.localizedDescription, error);

            return;
        }

        NSDictionary *permissions = [EntitiesConverter convertPermissions:result.allValues];
        completion(@[permissions]);
    }];
}

RCT_EXPORT_METHOD(setDebugMode) {
    [Qonversion setDebugMode];
}

RCT_EXPORT_METHOD(offerings:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [Qonversion offerings:^(QNOfferings * _Nullable offerings, NSError * _Nullable error) {
        if (error) {
            NSString *errorCode = [@(error.code) stringValue];
            reject(errorCode, error.localizedDescription, error);

            return;
        }

        NSDictionary *convertedOfferings = [EntitiesConverter convertOfferings:offerings];
        completion(@[convertedOfferings]);
    }];
}

RCT_EXPORT_METHOD(checkTrialIntroEligibilityForProductIds:(NSArray *)data completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [Qonversion checkTrialIntroEligibilityForProductIds:data completion:^(NSDictionary<NSString *,QNIntroEligibility *> * _Nonnull result, NSError * _Nullable error) {
        if (error) {
            NSString *errorCode = [@(error.code) stringValue];
            reject(errorCode, error.localizedDescription, error);

            return;
        }

        NSDictionary *convertedIntroEligibility = [EntitiesConverter convertIntroEligibility:result];
        completion(@[convertedIntroEligibility]);
    }];
}

RCT_EXPORT_METHOD(experiments:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [Qonversion experiments:^(NSDictionary<NSString *,QNExperimentInfo *> * _Nonnull result, NSError * _Nullable error) {
        if (error) {
            NSString *errorCode = [@(error.code) stringValue];
            reject(errorCode, error.localizedDescription, error);

            return;
        }

        NSArray *experiments = [EntitiesConverter convertExperiments:result];
        completion(@[experiments]);
    }];
}

RCT_EXPORT_METHOD(identify:(NSString *)userId)
{
    [Qonversion identify:userId];
}

RCT_EXPORT_METHOD(logout)
{
    [Qonversion logout];
}

RCT_EXPORT_METHOD(resetUser)
{
    [Qonversion resetUser];
}

RCT_EXPORT_METHOD(setAdvertisingID) {
    [Qonversion setAdvertisingID];
}

RCT_EXPORT_METHOD(setAppleSearchAdsAttributionEnabled:(BOOL)enabled) {
    [Qonversion setAppleSearchAdsAttributionEnabled:enabled];
}

RCT_EXPORT_METHOD(setNotificationsToken:(NSString *)token) {
    NSData *tokenData = [self convertHexToData:token];

    [Qonversion setNotificationsToken:tokenData];
}

RCT_EXPORT_METHOD(handleNotification:(NSDictionary *)notificationData
                  completion:(RCTResponseSenderBlock)completion
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if (![notificationData isKindOfClass:[NSDictionary class]]) {
        completion(@[@(NO)]);
        return;
    }

    BOOL isQonversionNotification = [Qonversion handleNotification:notificationData];
    completion(@[@(isQonversionNotification)]);
}

RCT_EXPORT_METHOD(subscribeOnUpdatedPurchases) {
    [Qonversion setPurchasesDelegate:self];
}

RCT_EXPORT_METHOD(subscribeOnPromoPurchases) {
    [Qonversion setPromoPurchasesDelegate:self];
}

RCT_EXPORT_METHOD(promoPurchase:(NSString *)storeProductId completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject) {
    QNPromoPurchaseCompletionHandler executionBlock = _promoPurchasesExecutionBlocks[storeProductId];
    if (executionBlock) {
        _promoPurchasesExecutionBlocks[storeProductId] = nil;
        QNPurchaseCompletionHandler completionWrapper = ^(NSDictionary<NSString *, QNPermission*> *result, NSError  *_Nullable error, BOOL cancelled) {
            if (error) {
                NSString *errorCode = [@(error.code) stringValue];
                reject(errorCode, error.localizedDescription, error);
            } else {
                NSDictionary *convertedPermissions = [EntitiesConverter convertPermissions:result.allValues];
                completion(@[convertedPermissions]);
            }
        };

        executionBlock(completionWrapper);
    } else {
        NSError *error = [NSError errorWithDomain:keyQNErrorDomain code:QNErrorProductNotFound userInfo:nil];
        NSString *errorCode = [@(error.code) stringValue];
        reject(errorCode, error.localizedDescription, error);
    }
}

RCT_EXPORT_METHOD(setPermissionsCacheLifetime:(NSString *)lifetime)
{
    NSNumber *lifetimeNumber = [EntitiesConverter permissionsCacheLifetimeForString:lifetime];

    if (lifetimeNumber) {
        [Qonversion setPermissionsCacheLifetime:lifetimeNumber.integerValue];
    }
}

#pragma mark - Private

- (void)purchaseWithId:(NSString *)productId offeringId:(NSString *)offeringId completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject {
    if (offeringId.length > 0) {
        [Qonversion offerings:^(QNOfferings * _Nullable offerings, NSError * _Nullable error) {
            QNOffering *offering = [offerings offeringForIdentifier:offeringId];
            QNProduct *product = [offering productForIdentifier:productId];

            if (product) {
                [Qonversion purchaseProduct:product completion:^(NSDictionary<NSString *,QNPermission *> * _Nonnull result, NSError * _Nullable error, BOOL cancelled) {
                    [self handlePurchasesResult:result error:error cancelled:cancelled completion:completion rejecter:reject];
                }];
            } else {
                [self processPurchase:productId completion:completion rejecter:reject];
            }
        }];
    } else {
        [self processPurchase:productId completion:completion rejecter:reject];
    }
}

- (void)processPurchase:(NSString *)productId completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject {
    [Qonversion purchase:productId completion:^(NSDictionary *result, NSError *error, BOOL cancelled) {
        [self handlePurchasesResult:result error:error cancelled:cancelled completion:completion rejecter:reject];
    }];
}

- (void)handlePurchasesResult:(NSDictionary *)result
                        error:(NSError *)error
                    cancelled:(BOOL)cancelled
                   completion:(RCTResponseSenderBlock)completion
                     rejecter:(RCTPromiseRejectBlock)reject {
    if (error) {
        NSString *errorCode = [@(error.code) stringValue];
        reject(errorCode, error.localizedDescription, error);

        return;
    }

    NSDictionary *permissions = [EntitiesConverter convertPermissions:result.allValues];
    completion(@[permissions]);
}

- (NSData *)convertHexToData:(NSString *)hex {
    NSString *token = [hex stringByReplacingOccurrencesOfString:@" " withString:@""];
    NSMutableData *data = [[NSMutableData alloc] init];
    unsigned char whole_byte;
    char byte_chars[3] = {'\0','\0','\0'};
    int i;
    for (i=0; i < [token length] / 2; i++) {
        byte_chars[0] = [token characterAtIndex:i * 2];
        byte_chars[1] = [token characterAtIndex:i * 2 + 1];
        whole_byte = strtol(byte_chars, NULL, 16);
        [data appendBytes:&whole_byte length:1];
    }

    return [data copy];
}

- (void)qonversionDidReceiveUpdatedPermissions:(NSDictionary<NSString *, QNPermission *>  * _Nonnull)permissions {
    NSDictionary *payload = [EntitiesConverter convertPermissions:permissions.allValues];
    [self sendEventWithName:kEventPermissionsUpdated body:payload];
}

- (void)shouldPurchasePromoProductWithIdentifier:(NSString *)productID executionBlock:(QNPromoPurchaseCompletionHandler)executionBlock {
    if (!_promoPurchasesExecutionBlocks) {
        _promoPurchasesExecutionBlocks = [NSMutableDictionary new];
    }
    _promoPurchasesExecutionBlocks[productID] = executionBlock;

    [self sendEventWithName:kEventPromoPurchaseReceived body:productID];
}

#pragma mark - Emitter

- (NSArray<NSString *> *)supportedEvents {
    return @[kEventPermissionsUpdated, kEventPromoPurchaseReceived];
}

@end
