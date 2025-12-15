//
//  RNNoCodesImpl.swift
//  qonversion-react-native-sdk
//
//  Created by Kamo Spertsyan on 15.08.2025.
//

import Foundation
import QonversionSandwich
import React

@objc
public protocol NoCodesEventDelegate {
    func noCodesDidTrigger(event: String, payload: [String: Any]?)
}

class NoCodesEventHandler: NoCodesEventListener {
    weak var delegate: NoCodesEventDelegate?

    init(delegate: NoCodesEventDelegate?) {
        self.delegate = delegate
    }

    func noCodesDidTrigger(event: String, payload: [String : Any]?) {
        delegate?.noCodesDidTrigger(event: event, payload: payload)
    }
}

@objc
public protocol NoCodesPurchaseDelegateProxy {
    func purchase(_ product: [String: Any])
    func restore()
}

class NoCodesPurchaseDelegateHandler: NoCodesPurchaseDelegateBridge {
    private let delegate: NoCodesPurchaseDelegateProxy

    init(delegate: NoCodesPurchaseDelegateProxy) {
        self.delegate = delegate
    }

    func purchase(_ product: [String: Any]) {
        delegate.purchase(product)
    }

    func restore() {
        delegate.restore()
    }
}

@objc
public class RNNoCodesImpl: NSObject {

    var noCodesSandwich: NoCodesSandwich?
    var eventHandler: NoCodesEventHandler
    var purchaseDelegateHandler: NoCodesPurchaseDelegateHandler?

    @objc
    public override init() {
        eventHandler = NoCodesEventHandler(delegate: nil)
      
        super.init()
      
        noCodesSandwich = NoCodesSandwich(noCodesEventListener: eventHandler)
    }

    @objc
    public func initialize(projectKey: String, source: String, version: String, proxyUrl: String?) {
        // Ignore source and version, because it's taken from the Qonversion SDK.
        noCodesSandwich?.initialize(projectKey: projectKey, proxyUrl: proxyUrl)
    }

    @MainActor @objc
    public func setScreenPresentationConfig(_ configData: [String: Any], contextKey: String) {
        noCodesSandwich?.setScreenPresentationConfig(configData, forContextKey: contextKey)
    }

    @MainActor @objc
    public func showScreen(contextKey: String) {
        noCodesSandwich?.showScreen(contextKey)
    }

    @MainActor @objc
    public func close() {
        noCodesSandwich?.close()
    }

    @objc
    public func setDelegate(_ delegate: NoCodesEventDelegate) {
        eventHandler.delegate = delegate
    }

    @objc
    public func setPurchaseDelegate(_ delegate: NoCodesPurchaseDelegateProxy) {
        let delegate = NoCodesPurchaseDelegateHandler(delegate: delegate)
        purchaseDelegateHandler = delegate
        noCodesSandwich?.setPurchaseDelegate(delegate)
    }

    @objc
    public func delegatedPurchaseCompleted() {
        noCodesSandwich?.delegatedPurchaseCompleted()
    }

    @objc
    public func delegatedPurchaseFailed(_ errorMessage: String) {
        noCodesSandwich?.delegatedPurchaseFailed(errorMessage)
    }

    @objc
    public func delegatedRestoreCompleted() {
        noCodesSandwich?.delegatedRestoreCompleted()
    }

    @objc
    public func delegatedRestoreFailed(_ errorMessage: String) {
        noCodesSandwich?.delegatedRestoreFailed(errorMessage)
    }
}
