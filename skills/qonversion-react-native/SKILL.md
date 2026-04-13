---
name: qonversion-react-native
description: Integrate, debug, or migrate Qonversion SDK in React Native and Expo apps, including setup, initialization, offerings/products fetch, purchase/restore flows, entitlement checks, user identify/logout mapping, and major-version API migration handling. Use when tasks mention @qonversion/react-native-sdk, react-native-qonversion, subscriptions, entitlements, paywalls, App Store/Google Play purchases, or Expo prebuild/dev-client requirements.
---

# Qonversion React Native

## Overview

Use this skill to implement or fix Qonversion subscription flows in React Native and Expo projects.

Read `references/react-native-expo.md` first, then apply only the sections required by the user request.

## Workflow

1. Detect project mode
- Confirm if app is Expo managed, Expo prebuild + dev client, or bare React Native.
- If Expo Go is being used for native purchase testing, move to dev client / native build path.

2. Confirm SDK and version
- Check `package.json` for `@qonversion/react-native-sdk` (or older `react-native-qonversion`).
- If API usage does not match installed major version, use migration guidance from the references file.

3. Initialize SDK early
- Initialize Qonversion once during app bootstrap.
- Use subscription-management launch mode.
- Keep project key outside hardcoded literals when possible.

4. Bind identity lifecycle
- On login: call `identify(userId)`.
- On logout/account switch: call `logout()`.
- Keep backend and Qonversion identity mapping consistent.

5. Implement commerce flow
- Fetch offerings/products.
- Trigger purchase with explicit product model/options.
- Handle user-cancel path separately from real errors.
- Support restore flow for reinstalls/device changes.

6. Resolve access by entitlements
- Use `checkEntitlements()` to gate premium features client-side.
- Treat server state as source of truth for protected backend access.

7. Validate on devices
- Test with sandbox testers on iOS/Android.
- Verify success, cancellation, restore, expired, billing issue, and offline fallback behaviors.

## Implementation Rules

- Prefer typed wrappers in `services/` instead of using SDK calls directly in UI screens.
- Centralize purchase/restore/error handling in a single service module.
- Keep entitlement keys and product IDs as constants.
- Add telemetry around purchase start/success/failure/cancel/restore.
- For Expo projects, document whether feature needs prebuild/dev client.

## Output Expectations

When completing a task with this skill, deliver:
- Exact files changed.
- Version assumptions and migration notes.
- Test checklist for iOS and Android sandbox.
- Any Expo-specific constraints (Expo Go vs dev client/prebuild).

## References

- Core guide: `references/react-native-expo.md`
