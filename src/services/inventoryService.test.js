const StoreNotFoundError = require("../domain/errors/storeNotFoundError");
const ValidationError = require("../domain/errors/validationError");
const NotFoundError = require("../domain/errors/notFoundError");
const InsufficientStockError = require("../domain/errors/insufficientStockError");
const SeedData = require("../seedData/seedData");
const inventoryService = require("./inventoryService");

jest.mock("../seedData/seedData", () => ({
  stores: [{ outletId: "store-1" }],
  groceryProducts: [
    { productId: "p-out", store: { outletId: "store-1" }, availableStock: 0, threshold: 10 }, // out of stock
    { productId: "p-low", store: { outletId: "store-1" }, availableStock: 5, threshold: 10 }, // low stock
    { productId: "p-ok", store: { outletId: "store-1" }, availableStock: 50, threshold: 10 }, // healthy
  ],
}));

// reserveStock mutates availableStock, so reset the mocked seed before each test.
beforeEach(() => {
  SeedData.groceryProducts[0].availableStock = 0;
  SeedData.groceryProducts[1].availableStock = 5;
  SeedData.groceryProducts[2].availableStock = 50;
});

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

  describe("reserveStock", () => {
    it("shouldDecrementStockAndReturnReservedLinesOnSuccess", () => {
      const reserved = inventoryService.reserveStock([
        { productId: "p-ok", outletId: "store-1", quantity: 3 },
      ]);

      expect(reserved).toEqual([
        { product: SeedData.groceryProducts[2], quantity: 3 },
      ]);
      expect(SeedData.groceryProducts[2].availableStock).toBe(47);
    });

    it("shouldThrowValidationErrorIfItemsIsEmpty", () => {
      expect(() => inventoryService.reserveStock([])).toThrow(ValidationError);
    });

    it("shouldThrowValidationErrorIfQuantityIsNotPositive", () => {
      expect(() =>
        inventoryService.reserveStock([
          { productId: "p-ok", outletId: "store-1", quantity: 0 },
        ]),
      ).toThrow(ValidationError);
    });

    it("shouldThrowNotFoundErrorIfProductNotInStore", () => {
      expect(() =>
        inventoryService.reserveStock([
          { productId: "p-ok", outletId: "store-2", quantity: 1 },
        ]),
      ).toThrow(NotFoundError);
    });

    it("shouldThrowInsufficientStockErrorWhenRequestExceedsStock", () => {
      expect(() =>
        inventoryService.reserveStock([
          { productId: "p-low", outletId: "store-1", quantity: 10 },
        ]),
      ).toThrow(InsufficientStockError);
      expect(SeedData.groceryProducts[1].availableStock).toBe(5); // unchanged
    });

    it("shouldNotDecrementAnyLineIfOneFails (all-or-nothing)", () => {
      expect(() =>
        inventoryService.reserveStock([
          { productId: "p-ok", outletId: "store-1", quantity: 1 },
          { productId: "p-low", outletId: "store-1", quantity: 99 },
        ]),
      ).toThrow(InsufficientStockError);
      expect(SeedData.groceryProducts[2].availableStock).toBe(50); // not decremented
      expect(SeedData.groceryProducts[1].availableStock).toBe(5);
    });
  });
});
