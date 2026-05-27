class NotFoundError extends Error {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
