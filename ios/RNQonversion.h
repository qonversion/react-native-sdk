#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
@import QonversionSandwich;

@interface RNQonversion : RCTEventEmitter <RCTBridgeModule>

- (void)handleResult:(NSDictionary *)result
               error:(SandwichError *)error
          completion:(RCTPromiseResolveBlock)completion
            rejecter:(RCTPromiseRejectBlock)reject;

@end
