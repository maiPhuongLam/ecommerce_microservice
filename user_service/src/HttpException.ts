export class InternalServerErrorException extends Error {
  public success: boolean;
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = 500;
    this.success = false;
  }
}

export class BadRequestException extends Error {
  public success: boolean;
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = 400;
    this.success = false;
  }
}

export class UnauthorizedException extends Error {
  public success: boolean;
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = 401;
    this.success = false;
  }
}

export class NotFoundException extends Error {
  public success: boolean;
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = 404;
    this.success = false;
  }
}

export class ForbiddenException extends Error {
  public success: boolean;
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = 403; // Set the status code for Forbidden
    this.success = false;
  }
}

export class NotAcceptableException extends Error {
  public success: boolean;
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = 406; // Set the status code for Not Acceptable
    this.success = false;
  }
}

export class RequestTimeoutException extends Error {
  public success: boolean;
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = 408; // Set the status code for Request Timeout
    this.success = false;
  }
}

export class ConflictException extends Error {
  public success: boolean;
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = 409; // Set the status code for Conflict
    this.success = false;
  }
}
