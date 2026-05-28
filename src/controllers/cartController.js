const cartService = require("../services/cartService");
const ValidationError = require("../domain/errors/validationError");

function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? "Internal server error" : error.message;
  res.status(statusCode).json({ error: message });
}

const cartController = {
  addProductToCart(req, res) {
    try {
      const result = cartService.addProductToCartForUser(req.body);
      res.status(200).json(result);
    } catch (error) {
      sendError(res, error);
    }
  },

  viewCart(req, res) {
    try {
      const { userId } = req.query;
      if (!userId) {
        throw new ValidationError("userId query parameter is required");
      }
      const cart = cartService.getCartForUser(userId);
      res.status(200).json(cart);
    } catch (error) {
      sendError(res, error);
    }
  },
};

module.exports = cartController;
