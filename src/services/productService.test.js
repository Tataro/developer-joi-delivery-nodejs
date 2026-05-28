const productService = require("./productService");

describe("productService", () => {
  describe("getProduct", () => {
    it("shouldFindAGroceryProductByItsStore", () => {
      const product = productService.getProduct("product101", "store101");

      expect(product).toBeDefined();
      expect(product.productName).toBe("Wheat Bread");
    });

    it("shouldFindAnAvailableFoodProductByItsRestaurant", () => {
      const product = productService.getProduct("food101", "rest101");

      expect(product).toBeDefined();
      expect(product.productName).toBe("Margherita Pizza");
    });

    it("shouldNotReturnAnUnavailableFoodProduct", () => {
      const product = productService.getProduct("food103", "rest101");

      expect(product).toBeUndefined();
    });

    it("shouldReturnUndefinedWhenTheProductDoesNotExist", () => {
      expect(productService.getProduct("ghost", "store101")).toBeUndefined();
    });

    it("shouldNotMatchAProductFromADifferentOutlet", () => {
      expect(productService.getProduct("product101", "rest101")).toBeUndefined();
    });
  });
});
