import type { EntitlementsUpdateListener } from '../../dto/EntitlementsUpdateListener';
import type { DeferredPurchasesListener } from '../../dto/DeferredPurchasesListener';
import type { QEntitlement } from '../Mapper';
import DeferredTransaction from '../../dto/DeferredTransaction';

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

jest.mock('../Mapper', () => {
  const MockDeferredTransaction = require('../../dto/DeferredTransaction').default;
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
      convertDeferredTransaction: jest.fn((payload: Record<string, any>) => {
        if (!payload) return null;
        return new MockDeferredTransaction(
          payload.productId ?? '',
          payload.transactionId ?? null,
          payload.originalTransactionId ?? null,
          payload.type ?? 'Unknown',
          payload.value ?? 0,
          payload.currency ?? null
        );
      }),
      convertPurchaseResult: jest.fn(),
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

const sampleTransaction = {
  productId: 'premium_product',
  transactionId: 'txn_123',
  originalTransactionId: 'txn_001',
  type: 'Subscription',
  value: 9.99,
  currency: 'USD',
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

  it('fires listener with DeferredTransaction when native event received', () => {
    const instance = new QonversionInternal(createConfig());
    const listener: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };

    instance.setDeferredPurchasesListener(listener);
    fireEvent('onDeferredPurchaseCompleted', sampleTransaction);

    expect(listener.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
    const arg = (listener.onDeferredPurchaseCompleted as jest.Mock).mock.calls[0][0];
    expect(arg).toBeInstanceOf(DeferredTransaction);
    expect(arg.productId).toBe('premium_product');
    expect(arg.transactionId).toBe('txn_123');
    expect(arg.type).toBe('Subscription');
    expect(arg.value).toBe(9.99);
    expect(arg.currency).toBe('USD');
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

    fireEvent('onDeferredPurchaseCompleted', sampleTransaction);

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
    fireEvent('onDeferredPurchaseCompleted', sampleTransaction);
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
