import {QonversionErrorCode} from './enums';

class QonversionError {
  code: QonversionErrorCode;
  domain?: string;
  description: string;
  additionalMessage: string;
  private _userCanceled: boolean = false;

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

  get userCanceled(): boolean {
    return this._userCanceled;
  }

  setUserCanceled(value: boolean): void {
    this._userCanceled = value;
  }
}

export default QonversionError;
