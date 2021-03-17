export default class CustomError extends Error {
  public error_code: string;
  public lastError?: {} | null;
  public context?: {} | null;

  constructor(
    errorCode: string,
    message: string,
    lastError?: {} | null,
    context?: {} | null
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.error_code = errorCode;
    this.lastError = lastError;
    this.context = context;
  }
}