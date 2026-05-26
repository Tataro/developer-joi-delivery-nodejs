const FoodProduct = require("./foodProduct");
const Product = require("./product");

describe("FoodProduct", () => {
  const restaurant = { outletId: "restaurant101" };

  it("shouldBeAProduct (inheritance)", () => {
    const food = new FoodProduct(
      "food101",
      "Paneer Tikka",
      12,
      10.99,
      20,
      true,
      true,
      restaurant,
    );

    expect(food).toBeInstanceOf(Product);
    expect(food).toBeInstanceOf(FoodProduct);
  });

  it("shouldSetBaseAndFoodSpecificFields", () => {
    const food = new FoodProduct(
      "food101",
      "Paneer Tikka",
      12,
      10.99,
      20,
      true,
      true,
      restaurant,
      ["extra cheese", "no onion"],
      2,
    );

    // base (Product) fields
    expect(food.productId).toBe("food101");
    expect(food.productName).toBe("Paneer Tikka");
    expect(food.mrp).toBe(12);

    // food-specific fields
    expect(food.sellingPrice).toBe(10.99);
    expect(food.preparationTime).toBe(20);
    expect(food.isVegetarian).toBe(true);
    expect(food.isAvailable).toBe(true);
    expect(food.restaurant).toBe(restaurant);
    expect(food.customizations).toEqual(["extra cheese", "no onion"]);
    expect(food.discount).toBe(2);
  });

  it("shouldDefaultCustomizationsAndDiscount", () => {
    const food = new FoodProduct(
      "food101",
      "Paneer Tikka",
      12,
      10.99,
      20,
      true,
      true,
      restaurant,
    );

    expect(food.customizations).toEqual([]);
    expect(food.discount).toBe(0);
  });

  it("shouldNotCarryGroceryOnlyFields", () => {
    const food = new FoodProduct(
      "food101",
      "Paneer Tikka",
      12,
      10.99,
      20,
      true,
      true,
      restaurant,
    );

    expect(food.weight).toBeUndefined();
    expect(food.expiryDate).toBeUndefined();
    expect(food.availableStock).toBeUndefined();
    expect(food.threshold).toBeUndefined();
  });
});
