const cartService = require("../services/cartService");

const cartController = {
  addProductToCart(req, res) {
    try {
      const result = cartService.addProductToCartForUser(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },

  viewCart(req, res) {
    try {
      const cart = cartService.getCartForUser(req.query.userId);
      res.status(200).json(cart);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },
};

module.exports = cartController;
