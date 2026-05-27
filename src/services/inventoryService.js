const SeedData = require("../seedData/seedData");
const ValidationError = require("../domain/errors/validationError");
const NotFoundError = require("../domain/errors/notFoundError");

const inventoryService = {
  getStoreInventoryHealth(storeId) {
    if (!storeId) {
      throw new ValidationError("storeId is required");
    }

    const store = SeedData.stores.find((s) => s.outletId === storeId);
    if (!store) {
      throw new NotFoundError(`Store '${storeId}' not found`);
    }

    const products = SeedData.groceryProducts.filter(
      (product) => product.store && product.store.outletId === storeId,
    );

    const lowStock = [];
    const outOfStock = [];
    let healthyCount = 0;

    products.forEach((product) => {
      const summary = {
        productId: product.productId,
        productName: product.productName,
        availableStock: product.availableStock,
        threshold: product.threshold,
      };

      if (product.availableStock === 0) {
        outOfStock.push(summary);
      } else if (product.availableStock <= product.threshold) {
        lowStock.push(summary);
      } else {
        healthyCount += 1;
      }
    });

    return {
      storeId: store.outletId,
      storeName: store.name,
      totalProducts: products.length,
      healthyCount,
      lowStock,
      outOfStock,
    };
  },
};

module.exports = inventoryService;
