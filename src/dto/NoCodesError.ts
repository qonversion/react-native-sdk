import {NoCodesErrorCode} from './enums';
import QonversionError from './QonversionError';

class NoCodesError {
  code: NoCodesErrorCode;
  description?: string | null;
  additionalMessage?: string | null;
  domain?: string | null;
  error?: QonversionError;

  constructor(
    code: NoCodesErrorCode,
    description?: string | null,
    additionalMessage?: string | null,
    domain?: string | null,
    error?: QonversionError,
  ) {
    this.code = code;
    this.domain = domain;
    this.description = description;
    this.additionalMessage = additionalMessage;
    this.error = error;
  }
}

export default NoCodesError;
