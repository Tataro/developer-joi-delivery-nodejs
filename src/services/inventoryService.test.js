const inventoryService = require("./inventoryService");

jest.mock("../seedData/seedData", () => ({
  stores: [
    { outletId: "store101", name: "Fresh Picks" },
    { outletId: "store102", name: "Natural Choice" },
  ],
  groceryProducts: [
    { productId: "p1", store: { outletId: "store101" }, availableStock: 20, threshold: 10 },
    { productId: "p2", store: { outletId: "store101" }, availableStock: 5, threshold: 10 },
    { productId: "p3", store: { outletId: "store101" }, availableStock: 0, threshold: 10 },
    { productId: "p4", store: { outletId: "store102" }, availableStock: 15, threshold: 10 },
  ],
}));

describe("inventoryService", () => {
  describe("getStoreInventoryHealth", () => {
    it("should throw ValidationError when storeId is missing", () => {
      expect(() => inventoryService.getStoreInventoryHealth(null)).toThrow("storeId is required");
    });

    it("should throw ValidationError when storeId is empty string", () => {
      expect(() => inventoryService.getStoreInventoryHealth("")).toThrow("storeId is required");
    });

    it("should throw NotFoundError when store does not exist", () => {
      expect(() => inventoryService.getStoreInventoryHealth("store999")).toThrow("Store not found");
    });

    it("should return storeId and storeName", () => {
      const result = inventoryService.getStoreInventoryHealth("store101");
      expect(result.storeId).toBe("store101");
      expect(result.storeName).toBe("Fresh Picks");
    });

    it("should return totalProducts count for the store", () => {
      const result = inventoryService.getStoreInventoryHealth("store101");
      expect(result.totalProducts).toBe(3);
    });

    it("should count healthy products (stock above threshold)", () => {
      const result = inventoryService.getStoreInventoryHealth("store101");
      expect(result.healthyCount).toBe(1);
    });

    it("should count low stock products (stock > 0 and <= threshold)", () => {
      const result = inventoryService.getStoreInventoryHealth("store101");
      expect(result.lowStockCount).toBe(1);
    });

    it("should count out of stock products (stock === 0)", () => {
      const result = inventoryService.getStoreInventoryHealth("store101");
      expect(result.outOfStockCount).toBe(1);
    });

    it("should only count products belonging to the requested store", () => {
      const result = inventoryService.getStoreInventoryHealth("store102");
      expect(result.totalProducts).toBe(1);
      expect(result.healthyCount).toBe(1);
    });
  });
});
