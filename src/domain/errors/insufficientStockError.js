class InsufficientStockError extends Error {
  constructor(message) {
    super(message);
    this.name = "InsufficientStockError";
    this.statusCode = 409;
  }
}

module.exports = InsufficientStockError;
