const orderService = require("../services/orderService");
const sendError = require("./sendError");

const orderController = {
  createOrder(req, res) {
    try {
      const order = orderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      sendError(res, error);
    }
  },
};

module.exports = orderController;
