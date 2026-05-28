const FoodProduct = require("./foodProduct");
const Restaurant = require("./restaurant");

describe("FoodProduct", () => {
  let restaurant;
  let foodProduct;

  beforeEach(() => {
    restaurant = new Restaurant("Tasty Bites", "Local restaurant", "rest101");
    foodProduct = new FoodProduct(
      "food201",
      "Margherita Pizza",
      8.0,
      7.5,
      true,
      20,
      50,
      restaurant,
      0.5
    );
  });

  it("should set productId from Product base class", () => {
    expect(foodProduct.productId).toBe("food201");
  });

  it("should set productName from Product base class", () => {
    expect(foodProduct.productName).toBe("Margherita Pizza");
  });

  it("should set mrp from Product base class", () => {
    expect(foodProduct.mrp).toBe(8.0);
  });

  it("should set sellingPrice", () => {
    expect(foodProduct.sellingPrice).toBe(7.5);
  });

  it("should set isVeg", () => {
    expect(foodProduct.isVeg).toBe(true);
  });

  it("should set prepTimeMins", () => {
    expect(foodProduct.prepTimeMins).toBe(20);
  });

  it("should set availableStock", () => {
    expect(foodProduct.availableStock).toBe(50);
  });

  it("should set restaurant reference", () => {
    expect(foodProduct.restaurant).toBe(restaurant);
  });

  it("should set discount", () => {
    expect(foodProduct.discount).toBe(0.5);
  });

  it("should default discount to 0 when not provided", () => {
    const product = new FoodProduct("food202", "Burger", 5.0, 4.5, true, 10, 30, restaurant);
    expect(product.discount).toBe(0);
  });
});
