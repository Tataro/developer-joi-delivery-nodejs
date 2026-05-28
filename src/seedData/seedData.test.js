const SeedData = require("./seedData");

describe("SeedData", () => {
  describe("createUser", () => {
    it("shouldBuildALowercaseEmailFromTheName", () => {
      const user = SeedData.createUser("user101", "John", "Doe");

      expect(user.email).toBe("john.doe@gmail.com");
    });
  });

  describe("users", () => {
    it("shouldSeedUser101", () => {
      const user = SeedData.users.find((u) => u.userId === "user101");

      expect(user).toBeDefined();
      expect(user.firstName).toBe("John");
      expect(user.lastName).toBe("Doe");
    });

    it("shouldSeedUser102", () => {
      const user = SeedData.users.find((u) => u.userId === "user102");

      expect(user).toBeDefined();
      expect(user.firstName).toBe("Rachel");
      expect(user.lastName).toBe("Zane");
      expect(user.email).toBe("rachel.zane@gmail.com");
    });
  });

  describe("cartForUsers", () => {
    it("shouldOwnEachCartByTheMatchingUser", () => {
      const cart101 = SeedData.cartForUsers.get("user101");
      const cart102 = SeedData.cartForUsers.get("user102");

      expect(cart101.cartId).toBe("cart101");
      expect(cart101.user.userId).toBe("user101");

      expect(cart102.cartId).toBe("cart102");
      expect(cart102.user.userId).toBe("user102");
    });

    it("shouldStartWithNoOutletSelected", () => {
      const cart101 = SeedData.cartForUsers.get("user101");

      expect(cart101.outlet).toBeNull();
    });
  });

  describe("store inventory", () => {
    it("shouldPopulateEachStoreWithItsOwnProducts", () => {
      const productIds = Array.from(SeedData.store101.inventory).map(
        (product) => product.productId
      );

      expect(SeedData.store101.inventory.size).toBe(3);
      expect(productIds).toEqual(
        expect.arrayContaining(["product101", "product102", "product103"])
      );
    });
  });

  describe("restaurants and food products", () => {
    it("shouldSeedARestaurant", () => {
      const restaurant = SeedData.restaurants.find(
        (r) => r.outletId === "rest101"
      );

      expect(restaurant).toBeDefined();
      expect(restaurant.name).toBe("Pizza Palace");
    });

    it("shouldSeedFoodProductsBelongingToARestaurant", () => {
      const food = SeedData.foodProducts.find((p) => p.productId === "food101");

      expect(food).toBeDefined();
      expect(food.productName).toBe("Margherita Pizza");
      expect(food.restaurant.outletId).toBe("rest101");
      expect(food.sellingPrice).toBeGreaterThan(0);
      expect(food.available).toBe(true);
    });

    it("shouldSeedAnUnavailableFoodProduct", () => {
      const unavailable = SeedData.foodProducts.find((p) => !p.available);

      expect(unavailable).toBeDefined();
    });
  });
});
