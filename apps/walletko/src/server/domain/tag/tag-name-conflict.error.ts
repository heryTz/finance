export class TagNameConflictError extends Error {
  constructor() {
    super("A tag with this name already exists.");
  }
}
