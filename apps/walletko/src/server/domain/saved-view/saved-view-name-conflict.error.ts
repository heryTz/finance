export class SavedViewNameConflictError extends Error {
  constructor() {
    super("A view with this name already exists.");
  }
}
