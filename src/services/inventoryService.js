const StoreNotFoundError = require("../domain/errors/storeNotFoundError");
const ValidationError = require("../domain/errors/validationError");
const SeedData = require("../seedData/seedData");

const inventoryService = {
  getStoreInventoryHealth(storeId) {
    if (!storeId) {
      throw new ValidationError("storeId is required");
    }
    const store = SeedData.stores.find((store) => store.outletId === storeId);
    if (!store) {
      throw new StoreNotFoundError(`Store with id ${storeId} not found`);
    }

    const products = SeedData.groceryProducts.filter(
      (product) => product.store && product.store.outletId === storeId,
    );

    let lowStockCount = 0,
      outOfStockCount = 0;
    for (const p of products) {
      if (p.availableStock === 0) outOfStockCount++;
      else if (p.availableStock <= p.threshold) lowStockCount++;
    }
    return {
      storeId,
      totalProducts: products.length,
      lowStockCount,
      outOfStockCount,
    };
  },
};

module.exports = inventoryService;
