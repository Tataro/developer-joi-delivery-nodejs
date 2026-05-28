const productService = require("./productService");

jest.mock("../seedData/seedData", () => ({
  groceryProducts: [
    { productId: "product101", store: { outletId: "store101" } },
    { productId: "product102", store: { outletId: "store101" } },
  ],
  foodProducts: [
    { productId: "food201", restaurant: { outletId: "rest101" } },
    { productId: "food202", restaurant: { outletId: "rest101" } },
  ],
}));

describe("productService", () => {
  describe("getProduct", () => {
    it("should return a grocery product matching productId and outletId", () => {
      const result = productService.getProduct("product101", "store101");
      expect(result).toBeDefined();
      expect(result.productId).toBe("product101");
    });

    it("should return a food product matching productId and outletId", () => {
      const result = productService.getProduct("food201", "rest101");
      expect(result).toBeDefined();
      expect(result.productId).toBe("food201");
    });

    it("should return undefined when product not found in either list", () => {
      const result = productService.getProduct("unknown", "store101");
      expect(result).toBeUndefined();
    });

    it("should not match grocery product with wrong outletId", () => {
      const result = productService.getProduct("product101", "store999");
      expect(result).toBeUndefined();
    });

    it("should not match food product with wrong outletId", () => {
      const result = productService.getProduct("food201", "store101");
      expect(result).toBeUndefined();
    });

    it("should handle grocery products without a store reference", () => {
      const SeedData = require("../seedData/seedData");
      SeedData.groceryProducts = [
        { productId: "product101", store: null },
      ];
      const result = productService.getProduct("product101", "store101");
      expect(result).toBeUndefined();
    });
  });
});
