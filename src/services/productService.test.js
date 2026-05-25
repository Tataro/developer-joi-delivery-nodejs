const productService = require("./productService");
const SeedData = require("../seedData/seedData");

describe("ProductService", () => {
  describe("getProduct", () => {
    it("shouldReturnProductWhenProductIdAndOutletIdMatch", () => {
      const product = productService.getProduct("product101", "store101");
      expect(product).toBeDefined();
      expect(product.productId).toBe("product101");
    });

    it("shouldReturnUndefinedWhenProductIdDoesNotMatch", () => {
      const product = productService.getProduct("nonexistent", "store101");
      expect(product).toBeUndefined();
    });

    it("shouldReturnUndefinedWhenOutletIdDoesNotMatch", () => {
      const product = productService.getProduct("product101", "nonexistent");
      expect(product).toBeUndefined();
    });

    it("shouldReturnUndefinedWhenBothIdsDoNotMatch", () => {
      const product = productService.getProduct("nonexistent", "nonexistent");
      expect(product).toBeUndefined();
    });

    it("shouldReturnCorrectProductForDifferentValidProducts", () => {
      const product = productService.getProduct("product102", "store101");
      expect(product).toBeDefined();
      expect(product.productId).toBe("product102");
    });
  });
});
