const FoodProduct = require("./foodProduct");
const Product = require("./product");

describe("FoodProduct", () => {
  const restaurant = { outletId: "rest101", name: "Tasty Bites" };

  it("is a Product", () => {
    const food = new FoodProduct(
      "food201",
      "Margherita Pizza",
      8,
      7.5,
      true,
      20,
      50,
      restaurant
    );
    expect(food).toBeInstanceOf(Product);
  });

  it("exposes its food attributes and defaults discount to 0", () => {
    const food = new FoodProduct(
      "food201",
      "Margherita Pizza",
      8,
      7.5,
      true,
      20,
      50,
      restaurant
    );

    expect(food).toMatchObject({
      productId: "food201",
      productName: "Margherita Pizza",
      mrp: 8,
      sellingPrice: 7.5,
      isVeg: true,
      prepTimeMins: 20,
      availableStock: 50,
      restaurant,
      discount: 0,
    });
  });

  it("accepts an explicit discount", () => {
    const food = new FoodProduct(
      "food202",
      "Veg Burger",
      6,
      5.5,
      true,
      15,
      40,
      restaurant,
      1.5
    );
    expect(food.discount).toBe(1.5);
  });
});
