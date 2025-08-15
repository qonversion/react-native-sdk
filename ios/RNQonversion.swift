//
//  RNQonversion.swift
//  qonversion-react-native-sdk
//
//  Created by Kamo Spertsyan on 14.08.2025.
//

import Foundation
import QonversionSandwich
import React

@objc(RNQonversion)
class RNQonversion: NSObject, QonversionEventListener {
  
  var qonversionSandwich: QonversionSandwich?

  override init() {
    super.init()
    qonversionSandwich = QonversionSandwich(qonversionEventListener: self)
  }
  
  @objc
  func storeSDKInfo(source: String, version: String) {
    qonversionSandwich?.storeSdkInfo(source: source, version: version)
  }

  @objc
  func initializeSdk(key: String, launchModeKey: String, environmentKey: String, cacheLifetimeKey: String, proxyUrl: String, kidsMode: Bool) {
    qonversionSandwich?.initialize(projectKey: key, launchModeKey: launchModeKey, environmentKey: environmentKey, entitlementsCacheLifetimeKey: cacheLifetimeKey, proxyUrl: proxyUrl)
  }

  @objc
  func syncHistoricalData() {
    qonversionSandwich?.syncHistoricalData()
  }

  @objc
  func syncStoreKit2Purchases() {
    qonversionSandwich?.syncStoreKit2Purchases()
  }

  @objc
  func getPromotionalOffer(productId: String, discountId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.getPromotionalOffer(productId, productDiscountId: discountId, completion: { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    })
  }

  @objc
  func purchase(productId: String, quantity: Int, contextKeys: [String], promoOffer: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.purchase(productId, quantity: quantity, contextKeys: contextKeys, promoOffer: promoOffer, completion: { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    })
  }

  @objc
  func setDefinedProperty(property: String, value: String) {
    qonversionSandwich?.setDefinedProperty(property, value: value)
  }

  @objc
  func setCustomProperty(property: String, value: String) {
    qonversionSandwich?.setCustomProperty(property, value: value)
  }

  @objc
  func userProperties(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.userProperties { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  func addAttributionData(data: [String: Any], provider: String) {
    qonversionSandwich?.attribution(providerKey: provider, value: data)
  }

  @objc
  func checkEntitlements(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.checkEntitlements { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  func products(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.products { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  func offerings(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.offerings { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  func checkTrialIntroEligibility(forProductIds data: [String], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.checkTrialIntroEligibility(data) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  func restore(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.restore { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  func identify(userId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.identify(userId) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  func logout() {
    qonversionSandwich?.logout()
  }

  @objc
  func userInfo(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.userInfo { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  func remoteConfig(contextKey: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.remoteConfig(contextKey) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  func remoteConfigList(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.remoteConfigList { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  func remoteConfigList(forContextKeys contextKeys: [String], includeEmptyContextKey: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.remoteConfigList(contextKeys, includeEmptyContextKey: includeEmptyContextKey) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  func attachUserToExperiment(experimentId: String, groupId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.attachUserToExperiment(with: experimentId, groupId: groupId) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  func detachUserFromExperiment(experimentId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.detachUserFromExperiment(with: experimentId) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  func attachUserToRemoteConfiguration(remoteConfigurationId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.attachUserToRemoteConfiguration(with: remoteConfigurationId) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  func detachUserFromRemoteConfiguration(remoteConfigurationId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.detachUserFromRemoteConfiguration(with: remoteConfigurationId) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  func isFallbackFileAccessible(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.isFallbackFileAccessible { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  func collectAdvertisingID() {
    qonversionSandwich?.collectAdvertisingId()
  }

  @objc
  func collectAppleSearchAdsAttribution() {
    qonversionSandwich?.collectAppleSearchAdsAttribution()
  }

  @objc
  func promoPurchase(storeProductId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    qonversionSandwich?.promoPurchase(storeProductId) { result, error in
      self.handleResult(result: result, error: error, resolve: resolve, reject: reject)
    }
  }

  @objc
  func presentCodeRedemptionSheet() {
    if #available(iOS 14.0, *) {
      qonversionSandwich?.presentCodeRedemptionSheet()
    }
  }

  @objc
  func shouldPurchasePromoProduct(with productId: String) {
    emitOnPromoPurchaseReceived(productId)
  }

  @objc
  func qonversionDidReceiveUpdatedEntitlements(_ entitlements: [String: Any]) {
    emitOnEntitlementsUpdated(entitlements)
  }

  private func handleResult(result: [String: Any]?, error: SandwichError?, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    if let error = error {
      reject(error.code, error.details, nil)
      return
    }
    if let result = result {
      resolve(result)
    } else {
      resolve([:])
    }
  }
}
