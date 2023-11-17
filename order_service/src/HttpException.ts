export class HttpException extends Error {
  public success: boolean;
  public status: number;
  public message: string;

  constructor(status: number, message: string, success: boolean) {
    super(message);
    this.success = success;
    this.status = status;
    this.message = message;
  }
}
