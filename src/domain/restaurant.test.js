const Restaurant = require("./restaurant");

describe("Restaurant", () => {
  let restaurant;

  beforeEach(() => {
    restaurant = new Restaurant("Tasty Bites", "Local restaurant", "rest101");
  });

  it("should set name from Outlet base class", () => {
    expect(restaurant.name).toBe("Tasty Bites");
  });

  it("should set description from Outlet base class", () => {
    expect(restaurant.description).toBe("Local restaurant");
  });

  it("should set outletId from Outlet base class", () => {
    expect(restaurant.outletId).toBe("rest101");
  });

  it("should initialise menu as an empty Set", () => {
    expect(restaurant.menu).toBeInstanceOf(Set);
    expect(restaurant.menu.size).toBe(0);
  });
});
