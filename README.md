<p align="center">
 <a href="https://qonversion.io" target="_blank"><img width="460" height="150" src="https://qonversion.io/img/q_brand.svg"></a>
</p>

<p align="center">
     <a href="https://qonversion.io"><img width="660" src="https://qonversion.io/img/illustrations/charts.svg"></a></p>

Get access to the powerful yet simple subscription analytics:
* Conversion from install to paying user, MRR, LTV, churn and other metrics.
* Feed the advertising and analytics tools you are already using with the data on high-value users to improve your ads targeting and marketing ROAS.

## Getting started

`$ npm install react-native-qonversion --save`

### Mostly automatic installation

`$ react-native link react-native-qonversion`

## Usage
You need to configure Qonversion once at a starting point of your app.

For example, launch Qonversion in `initState` of your top level widget:

```javascript
import { NativeModules } from 'react-native';

const { Qonversion } = NativeModules.RNQonversion;

Qonversion.launchWithKey(YOUR_API_KEY, (uid) => {
    console.log(uid);
});
```

Usually Qonversion will track purchases automatically.

Still, there are few ways to launch Qonversion:

1. `launchWithKey(String key, Callback callback)` launches Qonversion SDK with the given API key.
`callback` will return `uid` for Ads integrations.

2. `launchWithKeyUserID(String key, String userID)` is the same as previous but allows you to specify client side `userID` (instead of Qonversion user ID) that will be used for matching data in the third party data:

3. **Under development** `launchWithKeyAutotrackPurchases(String key, bool autoTrackPurchases, Callback callback)` is the same as previous but allows you to turn off auto tracking purchases and track it manually.

#### There are also 2 iOS-specific methods for now:
1. `addAttributionData(Object data, Number provider, String userID)` will add custom attribution data, where `provider == 0` is AppsFlyer and `provider == 1` is Branch.
2. `setDebugMode(Bool)` sets debug mode.

## License

Qonversion SDK is available under the MIT license.
