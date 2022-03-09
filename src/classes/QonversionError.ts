class QonversionError {
  code: string;
  description: string;
  additionalMessage: string;

  constructor(
    code: string,
    description: string,
    additionalMessage: string,
  ) {
    this.code = code;
    this.description = description;
    this.additionalMessage = additionalMessage;
  }
}

export default QonversionError;
