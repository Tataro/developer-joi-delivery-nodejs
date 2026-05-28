const SeedData = require("../seedData/seedData");
const ValidationError = require("../domain/errors/validationError");
const NotFoundError = require("../domain/errors/notFoundError");

const inventoryService = {
  getStoreInventoryHealth(storeId) {
    if (!storeId) throw new ValidationError("storeId is required");

    const store = SeedData.stores.find((s) => s.outletId === storeId);
    if (!store) throw new NotFoundError("Store not found");

    const products = SeedData.groceryProducts.filter(
      (p) => p.store && p.store.outletId === storeId
    );

    const outOfStockCount = products.filter((p) => p.availableStock === 0).length;
    const lowStockCount = products.filter((p) => p.availableStock > 0 && p.availableStock <= p.threshold).length;
    const healthyCount = products.filter((p) => p.availableStock > p.threshold).length;

    return {
      storeId,
      storeName: store.name,
      totalProducts: products.length,
      healthyCount,
      lowStockCount,
      outOfStockCount,
    };
  },
};

module.exports = inventoryService;
