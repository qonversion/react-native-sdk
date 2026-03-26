import type { EntitlementsUpdateListener } from '../../dto/EntitlementsUpdateListener';
import type { DeferredPurchasesListener } from '../../dto/DeferredPurchasesListener';
import type { QEntitlement } from '../Mapper';
import PurchaseResult from '../../dto/PurchaseResult';
import { PurchaseResultStatus, PurchaseResultSource } from '../../dto/enums';

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
    purchaseWithResult: jest.fn(),
  },
}));

const mockPurchaseResult = new PurchaseResult(
  PurchaseResultStatus.SUCCESS,
  null,
  null,
  false,
  PurchaseResultSource.API,
  null
);

jest.mock('../Mapper', () => {
  return {
    __esModule: true,
    default: {
      convertEntitlements: jest.fn((payload: Record<string, any>) => {
        const map = new Map<string, unknown>();
        for (const [key, value] of Object.entries(payload)) {
          map.set(key, value);
        }
        return map;
      }),
      convertPurchaseResult: jest.fn(() => mockPurchaseResult),
    },
  };
});

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
    undefined,
    undefined,
    false,
  );
}

const samplePurchaseResult = {
  status: 'Success',
  entitlements: null,
  error: null,
  isFallbackGenerated: false,
  source: 'Api',
  storeTransaction: null,
};

const entitlementsPayload: Record<string, QEntitlement> = {
  premium: { id: 'premium', productId: 'premium_product', isActive: true } as unknown as QEntitlement,
};

describe('QonversionInternal - DeferredPurchasesListener (native event)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of Object.keys(eventHandlers)) {
      delete eventHandlers[key];
    }
  });

  it('subscribes to native onDeferredPurchaseCompleted event', () => {
    const instance = new QonversionInternal(createConfig());
    const listener: DeferredPurchasesListener = {
      onDeferredPurchaseCompleted: jest.fn(),
    };

    instance.setDeferredPurchasesListener(listener);

    expect(RNQonversion.onDeferredPurchaseCompleted).toHaveBeenCalled();
  });

  it('fires listener with PurchaseResult when native event received', () => {
    const instance = new QonversionInternal(createConfig());
    const listener: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };

    instance.setDeferredPurchasesListener(listener);
    fireEvent('onDeferredPurchaseCompleted', samplePurchaseResult);

    expect(listener.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
    const arg = (listener.onDeferredPurchaseCompleted as jest.Mock).mock.calls[0][0];
    expect(arg).toBeInstanceOf(PurchaseResult);
    expect(arg.isSuccess).toBe(true);
  });

  it('does not fire listener when no listener is set', () => {
    void new QonversionInternal(createConfig());

    // No listener set, event handler not registered
    expect(eventHandlers['onDeferredPurchaseCompleted']).toBeUndefined();
  });

  it('replaces previous listener when setting a new one', () => {
    const instance = new QonversionInternal(createConfig());
    const listener1: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };
    const listener2: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };

    instance.setDeferredPurchasesListener(listener1);
    instance.setDeferredPurchasesListener(listener2);

    fireEvent('onDeferredPurchaseCompleted', samplePurchaseResult);

    expect(listener1.onDeferredPurchaseCompleted).not.toHaveBeenCalled();
    expect(listener2.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
  });

  it('subscribes to onDeferredPurchaseCompleted only once', () => {
    const instance = new QonversionInternal(createConfig());
    const listener1: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };
    const listener2: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };

    instance.setDeferredPurchasesListener(listener1);
    instance.setDeferredPurchasesListener(listener2);

    expect(RNQonversion.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
  });

  it('deferred listener does NOT subscribe to onEntitlementsUpdated', () => {
    const instance = new QonversionInternal(createConfig());
    const listener: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };

    instance.setDeferredPurchasesListener(listener);

    expect(RNQonversion.onEntitlementsUpdated).not.toHaveBeenCalled();
  });
});

describe('QonversionInternal - deprecated setEntitlementsUpdateListener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of Object.keys(eventHandlers)) {
      delete eventHandlers[key];
    }
  });

  it('subscribes to onEntitlementsUpdated', () => {
    const instance = new QonversionInternal(createConfig());
    const oldListener: EntitlementsUpdateListener = { onEntitlementsUpdated: jest.fn() };

    instance.setEntitlementsUpdateListener(oldListener);

    expect(RNQonversion.onEntitlementsUpdated).toHaveBeenCalled();
  });

  it('fires for ALL entitlement updates', () => {
    const instance = new QonversionInternal(createConfig());
    const oldListener: EntitlementsUpdateListener = { onEntitlementsUpdated: jest.fn() };

    instance.setEntitlementsUpdateListener(oldListener);
    fireEvent('onEntitlementsUpdated', entitlementsPayload);

    expect(oldListener.onEntitlementsUpdated).toHaveBeenCalledTimes(1);
  });
});

describe('QonversionInternal - both listeners coexist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of Object.keys(eventHandlers)) {
      delete eventHandlers[key];
    }
  });

  it('both listeners fire independently from their own native events', () => {
    const oldListener: EntitlementsUpdateListener = { onEntitlementsUpdated: jest.fn() };
    const newListener: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };

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

    // Entitlements update fires old listener only
    fireEvent('onEntitlementsUpdated', entitlementsPayload);
    expect(oldListener.onEntitlementsUpdated).toHaveBeenCalledTimes(1);
    expect(newListener.onDeferredPurchaseCompleted).not.toHaveBeenCalled();

    // Deferred purchase fires new listener only
    fireEvent('onDeferredPurchaseCompleted', samplePurchaseResult);
    expect(oldListener.onEntitlementsUpdated).toHaveBeenCalledTimes(1); // still 1
    expect(newListener.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
  });

  it('subscribes to both native events independently', () => {
    const oldListener: EntitlementsUpdateListener = { onEntitlementsUpdated: jest.fn() };
    const newListener: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };

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

    expect(RNQonversion.onEntitlementsUpdated).toHaveBeenCalledTimes(1);
    expect(RNQonversion.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
  });
});
