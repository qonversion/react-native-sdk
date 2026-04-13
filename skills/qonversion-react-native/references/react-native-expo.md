# Qonversion + React Native + Expo Reference

## 1) Install and bootstrap

Primary package (current docs):

```bash
npm install @qonversion/react-native-sdk
```

Initialize once at app startup:

```ts
import Qonversion, { QonversionConfigBuilder, LaunchMode } from '@qonversion/react-native-sdk';

const config = new QonversionConfigBuilder(
  process.env.EXPO_PUBLIC_QONVERSION_PROJECT_KEY ?? '',
  LaunchMode.SUBSCRIPTION_MANAGEMENT
).build();

Qonversion.initialize(config);
```

If using custom networking route:

```ts
const config = new QonversionConfigBuilder(
  process.env.EXPO_PUBLIC_QONVERSION_PROJECT_KEY ?? '',
  LaunchMode.SUBSCRIPTION_MANAGEMENT
)
  .setProxyURL('https://your-proxy.example.com')
  .build();
```

## 2) Expo integration notes

- Qonversion React Native SDK is a native module; do not rely on Expo Go for full purchase testing.
- Use Expo prebuild + dev client or EAS builds for iOS/Android purchase validation.
- Re-run native build after dependency or native config changes.

Practical commands:

```bash
npx expo prebuild
npx expo run:ios
npx expo run:android
```

or EAS:

```bash
eas build --platform ios --profile development
eas build --platform android --profile development
```

## 3) Identity lifecycle

Call after login:

```ts
await Qonversion.getSharedInstance().identify(userSub);
```

Call at logout/account switch:

```ts
await Qonversion.getSharedInstance().logout();
```

Optionally map Qonversion id for backend correlation:

```ts
const userInfo = await Qonversion.getSharedInstance().userInfo();
const qonversionId = userInfo.qonversionId;
```

## 4) Offerings, products, purchases, restore

Load offerings/products:

```ts
const offerings = await Qonversion.getSharedInstance().offerings();
const products = await Qonversion.getSharedInstance().products();
```

Purchase:

```ts
try {
  const entitlements = await Qonversion.getSharedInstance().purchaseProduct(product);
} catch (e: any) {
  if (e?.userCanceled) {
    // user canceled
  } else {
    // real error
  }
}
```

Restore:

```ts
const entitlements = await Qonversion.getSharedInstance().restore();
```

## 5) Entitlement checks

Client-side gate:

```ts
const entitlements = await Qonversion.getSharedInstance().checkEntitlements();
```

Use entitlement renew-state data when available to branch UX for:
- will renew
- canceled but still active
- billing issue / grace period

## 6) Version and migration cautions

Qonversion docs include multiple React Native migration guides (4+, 6+, 6->7, 7->8 and later). Validate API names against installed major version before editing code.

Examples of migration-sensitive areas:
- `purchaseProduct(...)` vs newer `purchase(purchaseModel)` patterns
- `updatePurchase(...)` signatures
- permission naming transitions to entitlement naming
- user property API renames

When code and package major are mismatched:
1. Pin target major version.
2. Refactor to that API shape.
3. Smoke-test purchase, restore, and entitlement-check flows.

## 7) Recommended production checks

- iOS and Android sandbox tester flows pass.
- Cancel path does not show fatal error UX.
- Restore path reactivates access.
- Entitlement-based UI unlocks immediately after purchase.
- Backend protected routes still enforce server truth.
- Logs include purchase lifecycle events.

## 8) Sources

- Qonversion React Native SDK docs: https://documentation.qonversion.io/docs/docs/react-native-sdk
- Purchase and restore patterns: https://documentation.qonversion.io/docs/docs/making-purchases
- React Native migration guides: https://documentation.qonversion.io/docs/docs/react-native-8-migration-guide
- Entitlement checks: https://documentation.qonversion.io/docs/docs/check-permissions
- User identifiers: https://documentation.qonversion.io/docs/user-identifiers
- Offline mode: https://documentation.qonversion.io/docs/offline-sdk-mode
