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
class RNNoCodesImpl: NSObject, NoCodesEventListener {

    var noCodesSandwich: NoCodesSandwich?

    override init() {
        super.init()
        noCodesSandwich = NoCodesSandwich(noCodesEventListener: self)
    }

    @objc
    func initialize(projectKey: String) {
        noCodesSandwich?.initialize(projectKey: projectKey)
    }

    @MainActor @objc
    func setScreenPresentationConfig(configData: [String: Any], contextKey: String) {
        noCodesSandwich?.setScreenPresentationConfig(configData, forContextKey: contextKey)
    }

    @MainActor @objc
    func showScreen(contextKey: String) {
        noCodesSandwich?.showScreen(contextKey)
    }

    @MainActor @objc
    func close() {
        noCodesSandwich?.close()
    }

    func noCodesDidTrigger(event: String, payload: [String : Any]?) {
        
    }
}
