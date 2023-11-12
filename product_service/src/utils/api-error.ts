export class ApiError extends Error {
  public success;
  public status;
  public message;
  constructor(success: boolean, status: number, message: string) {
    super();
    this.success = success;
    this.status = status;
    this.message = message;
  }
}
