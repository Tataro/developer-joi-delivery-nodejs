const productService = require("./productService");
const SeedData = require("../seedData/seedData");

jest.mock("../seedData/seedData", () => ({
  groceryProducts: [],
  foodProducts: [],
}));

const groceryProduct = {
  productId: "product101",
  store: { outletId: "store101" },
};
const groceryWithoutStore = { productId: "product999", store: null };
const foodProduct = { productId: "food201", restaurant: { outletId: "rest101" } };
const foodWithoutRestaurant = { productId: "food999", restaurant: null };

beforeEach(() => {
  SeedData.groceryProducts = [groceryProduct, groceryWithoutStore];
  SeedData.foodProducts = [foodProduct, foodWithoutRestaurant];
});

describe("productService", () => {
  describe("getProduct", () => {
    it("finds a grocery product by id and outlet", () => {
      expect(productService.getProduct("product101", "store101")).toBe(
        groceryProduct
      );
    });

    it("finds a food product by id and outlet", () => {
      expect(productService.getProduct("food201", "rest101")).toBe(foodProduct);
    });

    it("returns undefined when the grocery product is in a different outlet", () => {
      expect(productService.getProduct("product101", "rest101")).toBeUndefined();
    });

    it("returns undefined when the food product is in a different outlet", () => {
      expect(productService.getProduct("food201", "store101")).toBeUndefined();
    });

    it("returns undefined when nothing matches", () => {
      expect(productService.getProduct("nope", "store101")).toBeUndefined();
    });

    it("ignores products with no outlet reference", () => {
      expect(productService.getProduct("product999", "store101")).toBeUndefined();
      expect(productService.getProduct("food999", "rest101")).toBeUndefined();
    });
  });
});
