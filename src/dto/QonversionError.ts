import {QonversionErrorCode} from './enums';

class QonversionError {
  code: QonversionErrorCode;
  domain?: string;
  description: string;
  additionalMessage: string;

  constructor(
    code: QonversionErrorCode,
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

export default QonversionError;
