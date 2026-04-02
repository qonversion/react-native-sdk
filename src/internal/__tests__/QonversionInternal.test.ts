import type { EntitlementsUpdateListener } from '../../dto/EntitlementsUpdateListener';
import type { DeferredPurchasesListener } from '../../dto/DeferredPurchasesListener';
import PurchaseResult from '../../dto/PurchaseResult';
import Entitlement from '../../dto/Entitlement';
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
    onDeferredPurchaseCompleted: jest.fn((handler: Function) => {
      eventHandlers['onDeferredPurchaseCompleted'] = handler;
    }),
    onPromoPurchaseReceived: jest.fn(),
    purchaseWithResult: jest.fn(),
  },
}));

const mockEntitlements = new Map<string, Entitlement>();
mockEntitlements.set('premium', { id: 'premium', productId: 'premium_product', isActive: true } as unknown as Entitlement);

const mockPurchaseResult = new PurchaseResult(
  PurchaseResultStatus.SUCCESS,
  mockEntitlements,
  null,
  false,
  PurchaseResultSource.API,
  null
);

const mockPurchaseResultNoEntitlements = new PurchaseResult(
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
import Mapper from '../Mapper';

function createConfig() {
  return new QonversionConfig(
    'test_key',
    LaunchMode.SUBSCRIPTION_MANAGEMENT,
    Environment.SANDBOX,
    EntitlementsCacheLifetime.MONTH,
    undefined,
    undefined,
    undefined,
    false,
  );
}

const samplePurchaseResult = {
  status: 'Success',
  entitlements: { premium: { id: 'premium', productId: 'premium_product', isActive: true } },
  error: null,
  isFallbackGenerated: false,
  source: 'Api',
  storeTransaction: null,
};

describe('QonversionInternal - DeferredPurchasesListener', () => {
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
});

describe('QonversionInternal - deprecated setEntitlementsUpdateListener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of Object.keys(eventHandlers)) {
      delete eventHandlers[key];
    }
  });

  it('subscribes to onDeferredPurchaseCompleted (same as native SDK)', () => {
    const instance = new QonversionInternal(createConfig());
    const oldListener: EntitlementsUpdateListener = { onEntitlementsUpdated: jest.fn() };

    instance.setEntitlementsUpdateListener(oldListener);

    expect(RNQonversion.onDeferredPurchaseCompleted).toHaveBeenCalled();
  });

  it('fires with entitlements extracted from PurchaseResult', () => {
    const instance = new QonversionInternal(createConfig());
    const oldListener: EntitlementsUpdateListener = { onEntitlementsUpdated: jest.fn() };

    instance.setEntitlementsUpdateListener(oldListener);
    fireEvent('onDeferredPurchaseCompleted', samplePurchaseResult);

    expect(oldListener.onEntitlementsUpdated).toHaveBeenCalledTimes(1);
    expect(oldListener.onEntitlementsUpdated).toHaveBeenCalledWith(mockEntitlements);
  });

  it('does not fire when PurchaseResult has no entitlements', () => {
    (Mapper.convertPurchaseResult as jest.Mock).mockReturnValueOnce(mockPurchaseResultNoEntitlements);

    const instance = new QonversionInternal(createConfig());
    const oldListener: EntitlementsUpdateListener = { onEntitlementsUpdated: jest.fn() };

    instance.setEntitlementsUpdateListener(oldListener);
    fireEvent('onDeferredPurchaseCompleted', samplePurchaseResult);

    expect(oldListener.onEntitlementsUpdated).not.toHaveBeenCalled();
  });
});

describe('QonversionInternal - setDeferredPurchasesListener replaces wrapped entitlementsUpdateListener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of Object.keys(eventHandlers)) {
      delete eventHandlers[key];
    }
  });

  it('deferredPurchasesListener replaces wrapped entitlementsUpdateListener', () => {
    const oldListener: EntitlementsUpdateListener = { onEntitlementsUpdated: jest.fn() };
    const newListener: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };

    const config = new QonversionConfig(
      'test_key',
      LaunchMode.SUBSCRIPTION_MANAGEMENT,
      Environment.SANDBOX,
      EntitlementsCacheLifetime.MONTH,
      oldListener,
      undefined,
      undefined,
      false,
    );

    const instance = new QonversionInternal(config);
    instance.setDeferredPurchasesListener(newListener);

    fireEvent('onDeferredPurchaseCompleted', samplePurchaseResult);

    expect(newListener.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
    expect(oldListener.onEntitlementsUpdated).not.toHaveBeenCalled();
  });

  it('subscribes to onDeferredPurchaseCompleted only once for both listeners', () => {
    const oldListener: EntitlementsUpdateListener = { onEntitlementsUpdated: jest.fn() };
    const newListener: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };

    const config = new QonversionConfig(
      'test_key',
      LaunchMode.SUBSCRIPTION_MANAGEMENT,
      Environment.SANDBOX,
      EntitlementsCacheLifetime.MONTH,
      oldListener,
      undefined,
      undefined,
      false,
    );

    const instance = new QonversionInternal(config);
    instance.setDeferredPurchasesListener(newListener);

    expect(RNQonversion.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
  });
});
