const StoreNotFoundError = require("../domain/errors/storeNotFoundError");
const ValidationError = require("../domain/errors/validationError");
const inventoryService = require("./inventoryService");

jest.mock("../seedData/seedData", () => ({
  stores: [{ outletId: "store-1" }],
  groceryProducts: [
    { store: { outletId: "store-1" }, availableStock: 0, threshold: 10 }, // out of stock
    { store: { outletId: "store-1" }, availableStock: 5, threshold: 10 }, // low stock
    { store: { outletId: "store-1" }, availableStock: 50, threshold: 10 }, // healthy
  ],
}));

describe("InventoryService", () => {
  describe("getStoreInventoryHealth", () => {
    it("shouldReturnTheHealthOfTheStore", () => {
      const storeId = "store-1";
      const result = inventoryService.getStoreInventoryHealth(storeId);
      expect(result).toEqual({
        storeId,
        totalProducts: 3,
        lowStockCount: 1,
        outOfStockCount: 1,
      });
    });

    it("shouldThrowValidationErrorIfStoreIdIsMissing", () => {
      expect(() => inventoryService.getStoreInventoryHealth()).toThrow(
        ValidationError,
      );
    });

    it("shouldThrowErrorIfStoreNotFound", () => {
      const storeId = "store-2";

      expect(() => inventoryService.getStoreInventoryHealth(storeId)).toThrow(
        StoreNotFoundError,
      );
    });
  });
});
