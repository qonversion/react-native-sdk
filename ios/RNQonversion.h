#import <ReactNativeSdkSpec/ReactNativeSdkSpec.h>
@import QonversionSandwich;

@interface RNQonversion : NativeQonversionModuleSpecBase <NativeQonversionModuleSpec>

- (void)handleResult:(NSDictionary *)result
               error:(SandwichError *)error
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject;

@end
