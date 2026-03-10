import type { EntitlementsUpdateListener } from '../../dto/EntitlementsUpdateListener';
import type { DeferredPurchasesListener } from '../../dto/DeferredPurchasesListener';
import type { QEntitlement } from '../Mapper';
import { PurchaseResultStatus, PurchaseResultSource } from '../../dto/enums';
import PurchaseResult from '../../dto/PurchaseResult';

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
    convertPurchaseResult: jest.fn(),
  },
}));

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
    false,
  );
}

// Entitlements payload where product "premium_product" is active
const entitlementsWithActiveProduct: Record<string, QEntitlement> = {
  premium: { id: 'premium', productId: 'premium_product', isActive: true } as unknown as QEntitlement,
};

// Entitlements payload with no matching pending product
const entitlementsUnrelated: Record<string, QEntitlement> = {
  basic: { id: 'basic', productId: 'basic_product', isActive: true } as unknown as QEntitlement,
};

// Minimal Product-like object for purchaseWithResult
const mockProduct = { qonversionId: 'premium_product' } as any;

function mockPendingPurchaseResult() {
  (RNQonversion.purchaseWithResult as jest.Mock).mockResolvedValue({});
  (Mapper.convertPurchaseResult as jest.Mock).mockReturnValue(
    new PurchaseResult(PurchaseResultStatus.PENDING, null, null, false, PurchaseResultSource.API, null),
  );
}

function mockSuccessPurchaseResult() {
  (RNQonversion.purchaseWithResult as jest.Mock).mockResolvedValue({});
  (Mapper.convertPurchaseResult as jest.Mock).mockReturnValue(
    new PurchaseResult(PurchaseResultStatus.SUCCESS, new Map(), null, false, PurchaseResultSource.API, null),
  );
}

describe('QonversionInternal – DeferredPurchasesListener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of Object.keys(eventHandlers)) {
      delete eventHandlers[key];
    }
  });

  it('setDeferredPurchasesListener subscribes to onEntitlementsUpdated', () => {
    const instance = new QonversionInternal(createConfig());
    const listener: DeferredPurchasesListener = {
      onDeferredPurchaseCompleted: jest.fn(),
    };

    instance.setDeferredPurchasesListener(listener);

    expect(RNQonversion.onEntitlementsUpdated).toHaveBeenCalled();
  });

  it('does NOT fire new listener when no pending purchases tracked', () => {
    const instance = new QonversionInternal(createConfig());
    const listener: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };

    instance.setDeferredPurchasesListener(listener);
    fireEvent('onEntitlementsUpdated', entitlementsUnrelated);

    expect(listener.onDeferredPurchaseCompleted).not.toHaveBeenCalled();
  });

  it('fires new listener when pending purchase product is active in entitlements update', async () => {
    const instance = new QonversionInternal(createConfig());
    const listener: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };

    instance.setDeferredPurchasesListener(listener);

    // Simulate a pending purchase
    mockPendingPurchaseResult();
    await instance.purchaseWithResult(mockProduct, undefined);

    // Fire entitlements update with the pending product now active
    fireEvent('onEntitlementsUpdated', entitlementsWithActiveProduct);

    expect(listener.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);
  });

  it('does NOT fire new listener for unrelated entitlement update after pending purchase', async () => {
    const instance = new QonversionInternal(createConfig());
    const listener: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };

    instance.setDeferredPurchasesListener(listener);

    // Simulate a pending purchase for "premium_product"
    mockPendingPurchaseResult();
    await instance.purchaseWithResult(mockProduct, undefined);

    // Fire entitlements update with a DIFFERENT product (not the pending one)
    fireEvent('onEntitlementsUpdated', entitlementsUnrelated);

    expect(listener.onDeferredPurchaseCompleted).not.toHaveBeenCalled();
  });

  it('removes product from tracking after deferred purchase completes (no double-fire)', async () => {
    const instance = new QonversionInternal(createConfig());
    const listener: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };

    instance.setDeferredPurchasesListener(listener);

    mockPendingPurchaseResult();
    await instance.purchaseWithResult(mockProduct, undefined);

    // First update: deferred purchase completes
    fireEvent('onEntitlementsUpdated', entitlementsWithActiveProduct);
    expect(listener.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1);

    // Second update: same entitlements, but product already cleared from tracking
    fireEvent('onEntitlementsUpdated', entitlementsWithActiveProduct);
    expect(listener.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1); // still 1
  });

  it('does NOT track product when purchaseWithResult returns success', async () => {
    const instance = new QonversionInternal(createConfig());
    const listener: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };

    instance.setDeferredPurchasesListener(listener);

    mockSuccessPurchaseResult();
    await instance.purchaseWithResult(mockProduct, undefined);

    fireEvent('onEntitlementsUpdated', entitlementsWithActiveProduct);

    expect(listener.onDeferredPurchaseCompleted).not.toHaveBeenCalled();
  });

  it('replaces previous listener when setting a new one', async () => {
    const instance = new QonversionInternal(createConfig());
    const listener1: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };
    const listener2: DeferredPurchasesListener = { onDeferredPurchaseCompleted: jest.fn() };

    instance.setDeferredPurchasesListener(listener1);
    instance.setDeferredPurchasesListener(listener2);

    mockPendingPurchaseResult();
    await instance.purchaseWithResult(mockProduct, undefined);
    fireEvent('onEntitlementsUpdated', entitlementsWithActiveProduct);

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

  it('subscribes to onEntitlementsUpdated', () => {
    const instance = new QonversionInternal(createConfig());
    const oldListener: EntitlementsUpdateListener = { onEntitlementsUpdated: jest.fn() };

    instance.setEntitlementsUpdateListener(oldListener);

    expect(RNQonversion.onEntitlementsUpdated).toHaveBeenCalled();
  });

  it('always fires for ALL entitlement updates (no filtering)', () => {
    const instance = new QonversionInternal(createConfig());
    const oldListener: EntitlementsUpdateListener = { onEntitlementsUpdated: jest.fn() };

    instance.setEntitlementsUpdateListener(oldListener);
    fireEvent('onEntitlementsUpdated', entitlementsUnrelated);

    expect(oldListener.onEntitlementsUpdated).toHaveBeenCalledTimes(1);
  });

  it('old listener set via config still works', () => {
    const oldListener: EntitlementsUpdateListener = { onEntitlementsUpdated: jest.fn() };

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
    fireEvent('onEntitlementsUpdated', entitlementsUnrelated);

    expect(oldListener.onEntitlementsUpdated).toHaveBeenCalledTimes(1);
  });
});

describe('QonversionInternal – both listeners coexist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of Object.keys(eventHandlers)) {
      delete eventHandlers[key];
    }
  });

  it('old listener fires for all updates, new listener only for deferred', async () => {
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

    const instance = new QonversionInternal(config);

    // Unrelated update — old fires, new does NOT
    fireEvent('onEntitlementsUpdated', entitlementsUnrelated);
    expect(oldListener.onEntitlementsUpdated).toHaveBeenCalledTimes(1);
    expect(newListener.onDeferredPurchaseCompleted).not.toHaveBeenCalled();

    // Now make a pending purchase and fire matching update
    mockPendingPurchaseResult();
    await instance.purchaseWithResult(mockProduct, undefined);
    fireEvent('onEntitlementsUpdated', entitlementsWithActiveProduct);

    expect(oldListener.onEntitlementsUpdated).toHaveBeenCalledTimes(2); // fires for all
    expect(newListener.onDeferredPurchaseCompleted).toHaveBeenCalledTimes(1); // only deferred
  });

  it('subscribes to onEntitlementsUpdated only once when both listeners set', () => {
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
  });
});
