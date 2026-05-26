class RestaurantNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "RestaurantNotFoundError";
    this.statusCode = 404;
  }
}

module.exports = RestaurantNotFoundError;
