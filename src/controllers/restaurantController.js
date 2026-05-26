const restaurantService = require("../services/restaurantService");

const restaurantController = {
  fetchMenu(req, res) {
    try {
      const menu = restaurantService.getMenu(req.query.restaurantId);
      res.status(200).json(menu);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },

  fetchMenuAvailability(req, res) {
    try {
      const result = restaurantService.getMenuAvailability(
        req.query.restaurantId,
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },
};

module.exports = restaurantController;
