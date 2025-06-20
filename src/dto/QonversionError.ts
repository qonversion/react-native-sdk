import {QonversionErrorCode} from './enums';

class QonversionError {
  code: QonversionErrorCode;
  domain?: string | null;
  description?: string | null;
  additionalMessage?: string | null;
  userCanceled: boolean = false;

  constructor(
    code: QonversionErrorCode,
    description?: string | null,
    additionalMessage?: string | null,
    domain?: string | null,
  ) {
    this.code = code;
    this.domain = domain;
    this.description = description;
    this.additionalMessage = additionalMessage;
    this.userCanceled = code === QonversionErrorCode.PURCHASE_CANCELED;
  }
}

export default QonversionError;
