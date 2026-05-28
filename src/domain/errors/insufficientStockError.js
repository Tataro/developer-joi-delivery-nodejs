class InsufficientStockError extends Error {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = "InsufficientStockError";
    this.statusCode = 409;
  }
}

module.exports = InsufficientStockError;
