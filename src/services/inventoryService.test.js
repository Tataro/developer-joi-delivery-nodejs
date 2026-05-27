const inventoryService = require("./inventoryService");
const SeedData = require("../seedData/seedData");
const ValidationError = require("../domain/errors/validationError");
const NotFoundError = require("../domain/errors/notFoundError");

jest.mock("../seedData/seedData", () => ({
  stores: [],
  groceryProducts: [],
}));

const store101 = { outletId: "store101", name: "Fresh Picks" };
const store102 = { outletId: "store102", name: "Natural Choice" };

const healthy = {
  productId: "p1",
  productName: "Wheat Bread",
  availableStock: 30,
  threshold: 10,
  store: store101,
};
const low = {
  productId: "p2",
  productName: "Spinach",
  availableStock: 5,
  threshold: 10,
  store: store101,
};
const out = {
  productId: "p3",
  productName: "Crackers",
  availableStock: 0,
  threshold: 10,
  store: store101,
};
const otherStore = {
  productId: "p4",
  productName: "Soap",
  availableStock: 20,
  threshold: 5,
  store: store102,
};
const orphan = {
  productId: "p5",
  productName: "Orphan",
  availableStock: 20,
  threshold: 5,
  store: null,
};

beforeEach(() => {
  SeedData.stores = [store101, store102];
  SeedData.groceryProducts = [];
});

describe("InventoryService", () => {
  describe("getStoreInventoryHealth", () => {
    it("shouldThrowValidationErrorIfStoreIdIsMissing", () => {
      expect(() => inventoryService.getStoreInventoryHealth()).toThrow(
        ValidationError
      );
    });

    it("shouldThrowNotFoundErrorIfStoreDoesNotExist", () => {
      expect(() =>
        inventoryService.getStoreInventoryHealth("store999")
      ).toThrow(NotFoundError);
    });

    it("shouldSummarizeStockHealthForTheStore", () => {
      SeedData.groceryProducts = [healthy, low, out, otherStore, orphan];

      const health = inventoryService.getStoreInventoryHealth("store101");

      expect(health).toEqual({
        storeId: "store101",
        storeName: "Fresh Picks",
        totalProducts: 3,
        healthyCount: 1,
        lowStock: [
          {
            productId: "p2",
            productName: "Spinach",
            availableStock: 5,
            threshold: 10,
          },
        ],
        outOfStock: [
          {
            productId: "p3",
            productName: "Crackers",
            availableStock: 0,
            threshold: 10,
          },
        ],
      });
    });

    it("shouldReturnAnEmptyReportForAStoreWithNoProducts", () => {
      SeedData.groceryProducts = [healthy];

      const health = inventoryService.getStoreInventoryHealth("store102");

      expect(health).toEqual({
        storeId: "store102",
        storeName: "Natural Choice",
        totalProducts: 0,
        healthyCount: 0,
        lowStock: [],
        outOfStock: [],
      });
    });
  });
});
