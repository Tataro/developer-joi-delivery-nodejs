const restaurantService = require("./restaurantService");
const ValidationError = require("../domain/errors/validationError");
const RestaurantNotFoundError = require("../domain/errors/restaurantNotFoundError");

jest.mock("../seedData/seedData", () => ({
  restaurants: [
    { outletId: "rest-1", name: "Spice Garden", cuisineType: "Indian" },
  ],
  foodProducts: [
    { productId: "f1", restaurant: { outletId: "rest-1" }, isAvailable: true },
    { productId: "f2", restaurant: { outletId: "rest-1" }, isAvailable: true },
    { productId: "f3", restaurant: { outletId: "rest-1" }, isAvailable: false },
    { productId: "f4", restaurant: { outletId: "rest-2" }, isAvailable: true },
  ],
}));

describe("RestaurantService", () => {
  describe("getMenu", () => {
    it("shouldReturnTheRestaurantMenu", () => {
      const result = restaurantService.getMenu("rest-1");

      expect(result.restaurantId).toBe("rest-1");
      expect(result.name).toBe("Spice Garden");
      expect(result.cuisineType).toBe("Indian");
      expect(result.menu.map((p) => p.productId)).toEqual(["f1", "f2", "f3"]);
    });

    it("shouldThrowValidationErrorIfRestaurantIdMissing", () => {
      expect(() => restaurantService.getMenu()).toThrow(ValidationError);
    });

    it("shouldThrowRestaurantNotFoundErrorIfRestaurantMissing", () => {
      expect(() => restaurantService.getMenu("rest-99")).toThrow(
        RestaurantNotFoundError,
      );
    });
  });

  describe("getMenuAvailability", () => {
    it("shouldSummariseMenuAvailability", () => {
      const result = restaurantService.getMenuAvailability("rest-1");

      expect(result).toEqual({
        restaurantId: "rest-1",
        totalItems: 3,
        availableItems: 2,
        unavailableItems: 1,
      });
    });

    it("shouldThrowRestaurantNotFoundErrorIfRestaurantMissing", () => {
      expect(() => restaurantService.getMenuAvailability("rest-99")).toThrow(
        RestaurantNotFoundError,
      );
    });
  });
});
