//
//  RNQonversionImpl.swift
//  qonversion-react-native-sdk
//
//  Created by Kamo Spertsyan on 14.08.2025.
//

import Foundation
import QonversionSandwich
import React

@objc
public protocol QonversionEventDelegate {
    func shouldPurchasePromoProduct(with productId: String)
    func qonversionDidReceiveUpdatedEntitlements(_ entitlements: [String: Any])
}

class QonversionEventHandler: QonversionEventListener {
    weak var delegate: QonversionEventDelegate?

    func shouldPurchasePromoProduct(with productId: String) {
        delegate?.shouldPurchasePromoProduct(with: productId)
    }

    func qonversionDidReceiveUpdatedEntitlements(_ entitlements: [String: Any]) {
        delegate?.qonversionDidReceiveUpdatedEntitlements(entitlements)
    }
}

@objc
public class RNQonversionImpl: NSObject {
  
  var qonversionSandwich: QonversionSandwich?
  var eventHandler: QonversionEventHandler

  public override init() {
    eventHandler = QonversionEventHandler()
    
    super.init()
    
    qonversionSandwich = QonversionSandwich(qonversionEventListener: eventHandler)
  }
  
  @objc
  public func setDelegate(_ delegate: QonversionEventDelegate?) {
    eventHandler.delegate = delegate
  }

  @objc
  public func storeSDKInfo(_ source: String, version: String) {
    qonversionSandwich?.storeSdkInfo(source: source, version: version)
  }

  @objc
  public func initializeSdk(_ key: String, launchModeKey: String, environmentKey: String, cacheLifetimeKey: String, proxyUrl: String, kidsMode: Bool) {
    qonversionSandwich?.initialize(projectKey: key, launchModeKey: launchModeKey, environmentKey: environmentKey, entitlementsCacheLifetimeKey: cacheLifetimeKey, proxyUrl: proxyUrl)
  }

  @objc
  public func syncHistoricalData() {
    qonversionSandwich?.syncHistoricalData()
  }

  @objc
  public func syncStoreKit2Purchases() {
    qonversionSandwich?.syncStoreKit2Purchases()
  }

  @objc
  public func getPromotionalOffer(_ productId: String, discountId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.getPromotionalOffer(productId, productDiscountId: discountId, completion: { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    })
  }

  @objc
  public func purchase(_ productId: String, quantity: Int, contextKeys: [String], promoOffer: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.purchase(productId, quantity: quantity, contextKeys: contextKeys, promoOffer: promoOffer, completion: { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    })
  }

  @objc
  public func setDefinedProperty(_ property: String, value: String) {
    qonversionSandwich?.setDefinedProperty(property, value: value)
  }

  @objc
  public func setCustomProperty(_ property: String, value: String) {
    qonversionSandwich?.setCustomProperty(property, value: value)
  }

  @objc
  public func userProperties(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.userProperties { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  public func addAttributionData(_ data: [String: Any], provider: String) {
    qonversionSandwich?.attribution(providerKey: provider, value: data)
  }

  @objc
  public func checkEntitlements(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.checkEntitlements { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  public func products(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.products { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  public func offerings(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.offerings { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  public func checkTrialIntroEligibility(forProductIds data: [String], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.checkTrialIntroEligibility(data) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  public func restore(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.restore { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  public func identify(_ userId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.identify(userId) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  public func logout() {
    qonversionSandwich?.logout()
  }

  @objc
  public func userInfo(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.userInfo { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  public func remoteConfig(_ contextKey: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.remoteConfig(contextKey) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  public func remoteConfigList(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.remoteConfigList { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  public func remoteConfigList(forContextKeys contextKeys: [String], includeEmptyContextKey: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.remoteConfigList(contextKeys, includeEmptyContextKey: includeEmptyContextKey) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  public func attachUserToExperiment(_ experimentId: String, groupId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.attachUserToExperiment(with: experimentId, groupId: groupId) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  public func detachUserFromExperiment(_ experimentId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.detachUserFromExperiment(with: experimentId) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  public func attachUserToRemoteConfiguration(_ remoteConfigurationId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.attachUserToRemoteConfiguration(with: remoteConfigurationId) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  public func detachUserFromRemoteConfiguration(_ remoteConfigurationId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.detachUserFromRemoteConfiguration(with: remoteConfigurationId) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  public func isFallbackFileAccessible(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.isFallbackFileAccessible { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  public func collectAdvertisingId() {
    qonversionSandwich?.collectAdvertisingId()
  }

  @objc
  public func collectAppleSearchAdsAttribution() {
    qonversionSandwich?.collectAppleSearchAdsAttribution()
  }

  @objc
  public func promoPurchase(_ storeProductId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.promoPurchase(storeProductId) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  public func presentCodeRedemptionSheet() {
    if #available(iOS 14.0, *) {
      qonversionSandwich?.presentCodeRedemptionSheet()
    }
  }

  private func handleResult(result: [String: Any]?, error: SandwichError?, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    if let error {
      reject(error.code, error.details, nil)
      return
    }
    if let result {
      resolve(result)
    } else {
      resolve([:])
    }
  }
}
