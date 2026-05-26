const Restaurant = require("./restaurant");
const Outlet = require("./outlet");

describe("Restaurant", () => {
  it("shouldBeAnOutlet (inheritance)", () => {
    const restaurant = new Restaurant(
      "Spice Garden",
      "Authentic local restaurant",
      "restaurant101",
      "Indian",
    );

    expect(restaurant).toBeInstanceOf(Outlet);
    expect(restaurant).toBeInstanceOf(Restaurant);
  });

  it("shouldSetOutletAndRestaurantFields", () => {
    const restaurant = new Restaurant(
      "Spice Garden",
      "Authentic local restaurant",
      "restaurant101",
      "Indian",
    );

    expect(restaurant.name).toBe("Spice Garden");
    expect(restaurant.description).toBe("Authentic local restaurant");
    expect(restaurant.outletId).toBe("restaurant101");
    expect(restaurant.cuisineType).toBe("Indian");
  });

  it("shouldStartWithAnEmptyMenuSet", () => {
    const restaurant = new Restaurant("Spice Garden", "desc", "restaurant101", "Indian");

    expect(restaurant.menu).toBeInstanceOf(Set);
    expect(restaurant.menu.size).toBe(0);
  });
});
