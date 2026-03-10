import type { EntitlementsUpdateListener } from '../../dto/EntitlementsUpdateListener';
import type { DeferredPurchasesListener } from '../../dto/DeferredPurchasesListener';
import type { QEntitlement } from '../Mapper';

// Capture event handlers registered on the native module mock
const eventHandlers: Record<string, Function> = {};

function fireEvent(name: string, payload: unknown) {
  const handler = eventHandlers[name];
  if (!handler) {
    throw new Error(`No handler registered for event "${name}"`);
  }
  handler(payload);
}

jest.mock('../specs/NativeQonversionModule', () => ({
  __esModule: true,
  default: {
    storeSDKInfo: jest.fn(),
    initializeSdk: jest.fn(),
    onEntitlementsUpdated: jest.fn((handler: Function) => {
      eventHandlers['onEntitlementsUpdated'] = handler;
    }),
    onDeferredPurchaseCompleted: jest.fn((handler: Function) => {
      eventHandlers['onDeferredPurchaseCompleted'] = handler;
    }),
    onPromoPurchaseReceived: jest.fn(),
  },
}));

jest.mock('../Mapper', () => ({
  __esModule: true,
  default: {
    convertEntitlements: jest.fn((payload: Record<string, QEntitlement>) => {
      const map = new Map<string, unknown>();
      for (const [key, value] of Object.entries(payload)) {
        map.set(key, value);
      }
      return map;
    }),
  },
}));

import QonversionInternal from '../QonversionInternal';
import QonversionConfig from '../../QonversionConfig';
import { Environment, EntitlementsCacheLifetime, LaunchMode } from '../../dto/enums';
import RNQonversion from '../specs/NativeQonversionModule';

function createConfig() {
  return new QonversionConfig(
    'test_key',
    LaunchMode.SUBSCRIPTION_MANAGEMENT,
    Environment.SANDBOX,
    EntitlementsCacheLifetime.MONTH,
    undefined, // entitlementsUpdateListener
    undefined, // proxyUrl
    false, // kidsMode
  );
}

const sampleEntitlements: Record<string, QEntitlement> = {
  premium: { id: 'premium', isActive: true } as unknown as QEntitlement,
};

describe('QonversionInternal – DeferredPurchasesListener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of Object.keys(eventHandlers)) {
      delete eventHandlers[key];
    }
  });

  it('setDeferredPurchasesListener registers for onDeferredPurchaseCompleted event', () => {
    const _instance = new QonversionInternal(createConfig());
    const listener: DeferredPurchasesListener = {
      onDeferredPurchaseCompleted: jest.fn(),
    };

    _instance.setDeferredPurchasesListener(listener);

    expect(RNQonversion.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
  });

  it('setDeferredPurchasesListener only subscribes to native event once', () => {
    const instance = new QonversionInternal(createConfig());
    const listener1: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };
    const listener2: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };

    instance.setDeferredPurchasesListener(listener1);
    instance.setDeferredPurchasesListener(listener2);

    expect(RNQonversion.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
  });

  it('calls new listener when onDeferredPurchaseCompleted event fires', () => {
    const instance = new QonversionInternal(createConfig());
    const listener: DeferredPurchasesListener = {
      onDeferredPurchaseCompleted: jest.fn(),
    };

    instance.setDeferredPurchasesListener(listener);
    fireEvent('onDeferredPurchaseCompleted', sampleEntitlements);

    expect(listener.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
    const entitlementsArg = (listener.onDeferredPurchaseCompleted as jest.Mock).mock.calls[0][0];
    expect(entitlementsArg.get('premium')).toBeDefined();
  });

  it('replaces previous listener when setting a new one', () => {
    const instance = new QonversionInternal(createConfig());
    const listener1: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };
    const listener2: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };

    instance.setDeferredPurchasesListener(listener1);
    instance.setDeferredPurchasesListener(listener2);
    fireEvent('onDeferredPurchaseCompleted', sampleEntitlements);

    expect(listener1.onDeferredPurchaseCompleted).not.toHaveBeenCalled();
    expect(listener2.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
  });
});

describe('QonversionInternal – deprecated setEntitlementsUpdateListener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of Object.keys(eventHandlers)) {
      delete eventHandlers[key];
    }
  });

  it('wraps old listener via adapter and subscribes to onDeferredPurchaseCompleted', () => {
    const instance = new QonversionInternal(createConfig());
    const oldListener: EntitlementsUpdateListener = {
      onEntitlementsUpdated: jest.fn(),
    };

    instance.setEntitlementsUpdateListener(oldListener);

    // Should subscribe to the new event (adapter pattern)
    expect(RNQonversion.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
  });

  it('old listener receives events via adapter when onDeferredPurchaseCompleted fires', () => {
    const instance = new QonversionInternal(createConfig());
    const oldListener: EntitlementsUpdateListener = {
      onEntitlementsUpdated: jest.fn(),
    };

    instance.setEntitlementsUpdateListener(oldListener);
    fireEvent('onDeferredPurchaseCompleted', sampleEntitlements);

    expect(oldListener.onEntitlementsUpdated).toHaveBeenCalledTimes(1);
    const entitlementsArg = (oldListener.onEntitlementsUpdated as jest.Mock).mock.calls[0][0];
    expect(entitlementsArg.get('premium')).toBeDefined();
  });

  it('old listener set via config still works', () => {
    const oldListener: EntitlementsUpdateListener = {
      onEntitlementsUpdated: jest.fn(),
    };

    const config = new QonversionConfig(
      'test_key',
      LaunchMode.SUBSCRIPTION_MANAGEMENT,
      Environment.SANDBOX,
      EntitlementsCacheLifetime.MONTH,
      oldListener,
      undefined,
      false,
    );

    void new QonversionInternal(config);
    fireEvent('onDeferredPurchaseCompleted', sampleEntitlements);

    expect(oldListener.onEntitlementsUpdated).toHaveBeenCalledTimes(1);
  });
});

describe('QonversionInternal – config with deferredPurchasesListener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of Object.keys(eventHandlers)) {
      delete eventHandlers[key];
    }
  });

  it('uses deferredPurchasesListener from config when provided', () => {
    const newListener: DeferredPurchasesListener = {
      onDeferredPurchaseCompleted: jest.fn(),
    };

    const config = new QonversionConfig(
      'test_key',
      LaunchMode.SUBSCRIPTION_MANAGEMENT,
      Environment.SANDBOX,
      EntitlementsCacheLifetime.MONTH,
      undefined, // old listener
      undefined, // proxyUrl
      false, // kidsMode
      newListener, // deferredPurchasesListener
    );

    void new QonversionInternal(config);
    fireEvent('onDeferredPurchaseCompleted', sampleEntitlements);

    expect(newListener.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
  });

  it('prefers deferredPurchasesListener over entitlementsUpdateListener in config', () => {
    const oldListener: EntitlementsUpdateListener = {
      onEntitlementsUpdated: jest.fn(),
    };
    const newListener: DeferredPurchasesListener = {
      onDeferredPurchaseCompleted: jest.fn(),
    };

    const config = new QonversionConfig(
      'test_key',
      LaunchMode.SUBSCRIPTION_MANAGEMENT,
      Environment.SANDBOX,
      EntitlementsCacheLifetime.MONTH,
      oldListener,
      undefined,
      false,
      newListener,
    );

    void new QonversionInternal(config);
    fireEvent('onDeferredPurchaseCompleted', sampleEntitlements);

    expect(newListener.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
    expect(oldListener.onEntitlementsUpdated).not.toHaveBeenCalled();
  });
});
