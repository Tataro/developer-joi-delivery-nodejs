const Restaurant = require("./restaurant");
const Outlet = require("./outlet");

describe("Restaurant", () => {
  it("is an Outlet that starts with an empty menu", () => {
    const restaurant = new Restaurant(
      "Tasty Bites",
      "Local favourite restaurant",
      "rest101"
    );

    expect(restaurant).toBeInstanceOf(Outlet);
    expect(restaurant.name).toBe("Tasty Bites");
    expect(restaurant.description).toBe("Local favourite restaurant");
    expect(restaurant.outletId).toBe("rest101");
    expect(restaurant.menu).toBeInstanceOf(Set);
    expect(restaurant.menu.size).toBe(0);
  });
});
