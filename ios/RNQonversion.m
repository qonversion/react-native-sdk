#import "RNQonversion.h"
#import "EntitiesConverter.h"

@implementation RNQonversion

RCT_EXPORT_MODULE();

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

RCT_EXPORT_METHOD(setProperty:(NSInteger)property value:(NSString *)value)
{
    [Qonversion setProperty:property value:value];
}

RCT_EXPORT_METHOD(setUserProperty:(NSString *)property value:(NSString *)value)
{
    [Qonversion setUserProperty:property value:value];
}

RCT_EXPORT_METHOD(setUserId:(NSString *)userId)
{
    [Qonversion setUserID:userId];
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

RCT_EXPORT_METHOD(purchase:(NSString *)productId completion:(RCTResponseSenderBlock)completion rejecter:(RCTPromiseRejectBlock)reject)
{
    [Qonversion purchase:productId completion:^(NSDictionary *result, NSError *error, BOOL cancelled) {
        if (error) {
            NSString *errorCode = [@(error.code) stringValue];
            reject(errorCode, error.localizedDescription, error);
            
            return;
        }
        
        NSDictionary *permissions = [EntitiesConverter convertPermissions:result.allValues];
        completion(@[permissions]);
    }];
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

RCT_EXPORT_METHOD(setAdvertisingID) {
    [Qonversion setAdvertisingID];
}

@end
