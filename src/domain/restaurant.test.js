const Restaurant = require("./restaurant");
const Outlet = require("./outlet");

describe("Restaurant", () => {
  it("shouldBeAnOutlet", () => {
    const restaurant = new Restaurant("Pizza Place", "Wood-fired pizzas", "rest101");

    expect(restaurant).toBeInstanceOf(Outlet);
    expect(restaurant.name).toBe("Pizza Place");
    expect(restaurant.description).toBe("Wood-fired pizzas");
    expect(restaurant.outletId).toBe("rest101");
  });
});
