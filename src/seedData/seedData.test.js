const SeedData = require("./seedData");
const Restaurant = require("../domain/restaurant");
const FoodProduct = require("../domain/foodProduct");

describe("SeedData — food / restaurant", () => {
  it("shouldSeedTwoRestaurants", () => {
    expect(SeedData.restaurants).toHaveLength(2);
    expect(SeedData.restaurants.every((r) => r instanceof Restaurant)).toBe(true);
    expect(SeedData.restaurant101.cuisineType).toBe("Indian");
    expect(SeedData.restaurant102.cuisineType).toBe("Italian");
  });

  it("shouldSeedFoodProductsLinkedToTheirRestaurant", () => {
    expect(SeedData.foodProducts).toHaveLength(3);
    expect(SeedData.foodProducts.every((p) => p instanceof FoodProduct)).toBe(true);

    const biryani = SeedData.foodProducts.find((p) => p.productId === "food102");
    expect(biryani.restaurant).toBe(SeedData.restaurant101);

    const lasagna = SeedData.foodProducts.find((p) => p.productId === "food103");
    expect(lasagna.restaurant).toBe(SeedData.restaurant102);
    expect(lasagna.isVegetarian).toBe(false);
  });

  it("shouldKeepRestaurantMenuEmptyToAvoidCircularJson", () => {
    SeedData.restaurants.forEach((r) => expect(r.menu.size).toBe(0));

    // Because menu is empty, the product->restaurant reference is safe to serialize
    // (a populated menu would make restaurant->menu->product->restaurant circular).
    expect(() => JSON.stringify(SeedData.foodProducts)).not.toThrow();
  });
});
