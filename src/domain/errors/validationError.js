class ValidationError extends Error {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

module.exports = ValidationError;
