const FoodProduct = require("./foodProduct");
const Product = require("./product");

describe("FoodProduct", () => {
  it("shouldBeAProduct", () => {
    const foodProduct = new FoodProduct("food101", "Margherita Pizza", 12.5);

    expect(foodProduct).toBeInstanceOf(Product);
    expect(foodProduct.productId).toBe("food101");
    expect(foodProduct.productName).toBe("Margherita Pizza");
    expect(foodProduct.mrp).toBe(12.5);
  });
});
