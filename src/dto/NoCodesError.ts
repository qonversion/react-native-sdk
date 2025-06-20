import {NoCodesErrorCode} from './enums';

class NoCodesError {
  code: NoCodesErrorCode;
  description: string;
  additionalMessage: string;
  domain?: string;

  constructor(
    code: NoCodesErrorCode,
    description: string,
    additionalMessage: string,
    domain?: string,
  ) {
    this.code = code;
    this.domain = domain;
    this.description = description;
    this.additionalMessage = additionalMessage;
  }
}

export default NoCodesError;
