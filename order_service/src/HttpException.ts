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
  public message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
    this.status = 404;
    this.success = false;
  }
}

export class ForbiddenException extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 403; // Set the status code for Forbidden
  }
}

export class NotAcceptableException extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 406; // Set the status code for Not Acceptable
  }
}

export class RequestTimeoutException extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 408; // Set the status code for Request Timeout
  }
}

export class ConflictException extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 409; // Set the status code for Conflict
  }
}
