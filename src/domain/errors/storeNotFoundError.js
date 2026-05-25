class StoreNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "StoreNotFoundError";
    this.statusCode = 404;
  }
}

module.exports = StoreNotFoundError;
