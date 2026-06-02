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
      expect(
        productService.getProduct("product101", "rest101"),
      ).toBeUndefined();
    });

    it("shouldFindAMedicineProductByItsStore", () => {
      const product = productService.getProduct("medicine101", "store102");

      expect(product).toBeDefined();
      expect(product.productName).toBe("Pain Reliever");
      expect(product.store.outletId).toBe("store102");
      expect(product.discount).toBe(20);
    });

    it("shouldFindAnElectronicsProductByItsStore", () => {
      const product = productService.getProduct("electronic101", "store102");

      expect(product).toBeDefined();
      expect(product.productName).toBe("Wireless Earbuds");
      expect(product.store.outletId).toBe("store102");
      expect(product.discount).toBe(15);
    });
  });
});
