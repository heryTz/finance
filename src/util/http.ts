export class UnauthorizedException extends Error {
  constructor() {
    super("Unauthorized");
  }
}
