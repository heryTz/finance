export class UnauthorizedException extends Error {
  constructor() {
    super("Unauthorized");
  }
}

export class NotFoundException extends Error {
  constructor() {
    super("Not found");
  }
}
