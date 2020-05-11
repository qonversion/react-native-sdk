#import "RNQonversion.h"

@implementation RNQonversion

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(launchWithKey:(NSString *)key result:(RCTResponseSenderBlock)result)
{
    [Qonversion launchWithKey:key completion:^(NSString * _Nonnull uid) {
        result(@[uid]);
    }];
}

RCT_EXPORT_METHOD(launchWithKeyUserID:(NSString *)key userID:(NSString *)userID)
{
    [Qonversion launchWithKey:key userID:userID];
}

RCT_EXPORT_METHOD(launchWithKeyAutotrackPurchases:(NSString *)key autoTrackPurchases:(BOOL)autoTrackPurchases result:(RCTResponseSenderBlock)result)
{
    [Qonversion launchWithKey:key autoTrackPurchases:autoTrackPurchases completion:^(NSString * _Nonnull uid) {
        result(@[uid]);
    }];
}

RCT_EXPORT_METHOD(addAttributionData:(NSDictionary *)data provider:(NSInteger)provider userID:(NSString *)userID)
{
    [Qonversion addAttributionData:data fromProvider:provider userID:userID];
}

RCT_EXPORT_METHOD(setDebugMode:(BOOL)value)
{
    [Qonversion setDebugMode:value];
}

@end
