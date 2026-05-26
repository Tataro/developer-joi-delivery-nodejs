const StoreNotFoundError = require("../domain/errors/storeNotFoundError");
const ValidationError = require("../domain/errors/validationError");
const NotFoundError = require("../domain/errors/notFoundError");
const InsufficientStockError = require("../domain/errors/insufficientStockError");
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

  /**
   * Validates and decrements stock for a list of order items.
   * All-or-nothing: stock is only decremented if every item passes validation,
   * so a single failing line never leaves a partial decrement behind.
   *
   * @param {Array<{productId: string, outletId: string, quantity: number}>} items
   * @returns {Array<{product: object, quantity: number}>} the reserved lines
   */
  reserveStock(items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError("items must be a non-empty array");
    }

    // Pass 1 — validate everything, mutate nothing.
    const reserved = items.map((item) => {
      const quantity = item && item.quantity;
      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new ValidationError(
          `quantity for product ${item && item.productId} must be a positive integer`,
        );
      }

      const product = SeedData.groceryProducts.find(
        (p) =>
          p.productId === item.productId &&
          p.store &&
          p.store.outletId === item.outletId,
      );
      if (!product) {
        throw new NotFoundError(
          `Product with id ${item.productId} not found in store with id ${item.outletId}`,
        );
      }

      if (product.availableStock < quantity) {
        throw new InsufficientStockError(
          `Insufficient stock for product ${item.productId}: requested ${quantity}, available ${product.availableStock}`,
        );
      }

      return { product, quantity };
    });

    // Pass 2 — all lines valid, commit the decrement.
    reserved.forEach(({ product, quantity }) => {
      product.availableStock -= quantity;
    });

    return reserved;
  },
};

module.exports = inventoryService;
