const inventoryService = require("./inventoryService");
const NotFoundError = require("../domain/errors/notFoundError");
const GroceryStore = require("../domain/groceryStore");
const GroceryProduct = require("../domain/groceryProduct");

function productWithStock(productId, availableStock, threshold) {
  return new GroceryProduct(
    productId,
    productId,
    10,
    9,
    0.5,
    7,
    threshold,
    availableStock,
    null
  );
}

describe("inventoryService", () => {
  describe("computeHealth", () => {
    it("shouldClassifyProductsAsOutOfStockLowStockAndHealthy", () => {
      const store = new GroceryStore("Test Store", "desc", "storeX");
      store.inventory.add(productWithStock("out", 0, 10));
      store.inventory.add(productWithStock("low", 5, 10));
      store.inventory.add(productWithStock("atThreshold", 10, 10));
      store.inventory.add(productWithStock("healthy", 30, 10));

      const health = inventoryService.computeHealth(store);

      expect(health).toEqual({
        storeId: "storeX",
        totalProducts: 4,
        outOfStock: 1,
        lowStock: 2,
        healthy: 1,
      });
    });
  });

  describe("fetchStoreInventoryHealth", () => {
    it("shouldReportHealthForASeededStore", () => {
      const health = inventoryService.fetchStoreInventoryHealth("store101");

      expect(health).toEqual({
        storeId: "store101",
        totalProducts: 3,
        outOfStock: 0,
        lowStock: 0,
        healthy: 3,
      });
    });

    it("shouldThrowNotFoundErrorWhenTheStoreDoesNotExist", () => {
      expect(() =>
        inventoryService.fetchStoreInventoryHealth("ghost")
      ).toThrow(NotFoundError);
    });
  });
});
