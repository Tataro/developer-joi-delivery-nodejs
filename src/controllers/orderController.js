const orderService = require("../services/orderService");

const orderController = {
  checkout(req, res) {
    try {
      const order = orderService.checkout(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },

  getOrder(req, res) {
    try {
      const order = orderService.getOrderById(req.params.orderId);
      res.status(200).json(order);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },
};

module.exports = orderController;
