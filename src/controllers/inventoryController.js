const inventoryService = require("../services/inventoryService");

const inventoryController = {
  fetchStoreInventoryHealth(req, res) {
    try {
      const health = inventoryService.getStoreInventoryHealth(
        req.query.storeId,
      );
      res.status(200).json(health);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },
};

module.exports = inventoryController;
