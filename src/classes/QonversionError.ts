class QonversionError {
  code: string;
  domain?: string;
  description: string;
  additionalMessage: string;

  constructor(
    code: string,
    domain?: string,
    description: string,
    additionalMessage: string,
  ) {
    this.code = code;
    this.domain = domain;
    this.description = description;
    this.additionalMessage = additionalMessage;
  }
}

export default QonversionError;
