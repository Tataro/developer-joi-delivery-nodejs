const storeService = require("./storeService");
const NotFoundError = require("../domain/errors/notFoundError");

const inventoryService = {
  fetchStoreInventoryHealth(storeId) {
    const store = storeService.fetchStoreById(storeId);
    if (!store) {
      throw new NotFoundError(`Store '${storeId}' not found`);
    }
    return this.computeHealth(store);
  },

  computeHealth(store) {
    let outOfStock = 0;
    let lowStock = 0;
    let healthy = 0;

    store.inventory.forEach((product) => {
      if (product.availableStock === 0) {
        outOfStock += 1;
      } else if (product.availableStock <= product.threshold) {
        lowStock += 1;
      } else {
        healthy += 1;
      }
    });

    return {
      storeId: store.outletId,
      totalProducts: store.inventory.size,
      outOfStock,
      lowStock,
      healthy,
    };
  },
};

module.exports = inventoryService;
