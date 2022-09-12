#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
@import QonversionSandwich;

@interface RNQonversion : RCTEventEmitter <RCTBridgeModule>

- (void)handleResult:(NSDictionary *)result
               error:(SandwichError *)error
          completion:(RCTResponseSenderBlock)completion
            rejecter:(RCTPromiseRejectBlock)reject;

- (void)handlePurchaseResult:(NSDictionary *)result
                       error:(SandwichError *)error
                  completion:(RCTResponseSenderBlock)completion
                    rejecter:(RCTPromiseRejectBlock)reject;
@end
