import {NativeEventEmitter, NativeModules} from "react-native";
import NoCodesApi from "../NoCodesApi";
import NoCodesConfig from "../NoCodesConfig";
import Mapper, { QNoCodesResult } from "./Mapper";

const {RNNoCodes} = NativeModules;

const sdkVersion = "1.0.0";

const EVENT_NOCODES = "NoCodesEvent";

export default class NoCodesInternal implements NoCodesApi {
  constructor(config: NoCodesConfig) {
    RNNoCodes.initialize(config.projectKey);
  }

  async setScreenPresentationConfig(configData: Record<string, any>, contextKey?: string): Promise<void> {
    const result: QNoCodesResult = await RNNoCodes.setScreenPresentationConfig(configData, contextKey);
    Mapper.convertResult(result);
  }

  async showScreen(contextKey: string): Promise<void> {
    const result: QNoCodesResult = await RNNoCodes.showScreen(contextKey);
    Mapper.convertResult(result);
  }

  async close(): Promise<void> {
    const result: QNoCodesResult = await RNNoCodes.close();
    Mapper.convertResult(result);
  }
} 