const inventoryService = require("../services/inventoryService");
const ValidationError = require("../domain/errors/validationError");
const sendError = require("./sendError");

const inventoryController = {
  fetchStoreInventoryHealth(req, res) {
    try {
      const { storeId } = req.query;
      if (!storeId) {
        throw new ValidationError("storeId query parameter is required");
      }
      const health = inventoryService.fetchStoreInventoryHealth(storeId);
      res.status(200).json(health);
    } catch (error) {
      sendError(res, error);
    }
  },
};

module.exports = inventoryController;
