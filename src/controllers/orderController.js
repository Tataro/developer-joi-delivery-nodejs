const orderService = require("../services/orderService");
const sendError = require("./sendError");

const orderController = {
  placeOrder: (req, res) => {
    try {
      const orderResponse = orderService.createOrder(req.body);
      res.status(200).json(orderResponse);
    } catch (error) {
      sendError(res, error);
    }
  },
};

module.exports = orderController;
