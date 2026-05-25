const inventoryService = require("../services/inventoryService");

const inventoryController = {
  fetchStoreInventoryHealth(req, res) {
    const { storeId } = req.query;
    try {
      const result = inventoryService.getStoreInventoryHealth(storeId);
      return res.status(200).json(result);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  },
};

module.exports = inventoryController;
