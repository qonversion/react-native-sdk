import {ActionType} from "./enums";
import NoCodesError from './NoCodesError';

class NoCodesAction {

  type: ActionType;
  value: Map<string, string | undefined> | undefined;
  error: NoCodesError | undefined;

  constructor(
    type: ActionType,
    value: Map<string, string | undefined> | undefined,
    error: NoCodesError | undefined,
  ) {
    this.type = type;
    this.value = value;
    this.error = error;
  }
}

export default NoCodesAction;
