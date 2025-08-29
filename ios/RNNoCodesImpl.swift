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
public class RNNoCodesImpl: NSObject {

    var noCodesSandwich: NoCodesSandwich?
    var eventHandler: NoCodesEventHandler

    @objc
    public override init() {
        eventHandler = NoCodesEventHandler(delegate: nil)
      
        super.init()
      
        noCodesSandwich = NoCodesSandwich(noCodesEventListener: eventHandler)
    }

    @objc
    public func initialize(projectKey: String) {
        noCodesSandwich?.initialize(projectKey: projectKey)
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
    public func setDelegate(_ delegate: NoCodesEventDelegate?) {
        eventHandler.delegate = delegate
    }
}
