class QonversionError {
  description: string;
  additionalMessage: string;

  constructor(
    description: string,
    additionalMessage: string,
  ) {
    this.description = description;
    this.additionalMessage = additionalMessage;
  }
}

export default QonversionError;
