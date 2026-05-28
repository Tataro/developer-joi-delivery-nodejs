const SeedData = require("./seedData");

describe("SeedData", () => {
  describe("users", () => {
    it("should contain user101", () => {
      const user = SeedData.users.find((u) => u.userId === "user101");
      expect(user).toBeDefined();
      expect(user.firstName).toBe("John");
      expect(user.lastName).toBe("Doe");
    });

    it("should contain user102", () => {
      const user = SeedData.users.find((u) => u.userId === "user102");
      expect(user).toBeDefined();
      expect(user.firstName).toBe("Rachel");
      expect(user.lastName).toBe("Zane");
    });
  });

  describe("cartForUsers", () => {
    it("cart101 should belong to user101", () => {
      const cart = SeedData.cartForUsers.get("user101");
      expect(cart).toBeDefined();
      expect(cart.cartId).toBe("cart101");
      expect(cart.user.userId).toBe("user101");
    });

    it("cart102 should belong to user102", () => {
      const cart = SeedData.cartForUsers.get("user102");
      expect(cart).toBeDefined();
      expect(cart.cartId).toBe("cart102");
      expect(cart.user.userId).toBe("user102");
    });

    it("cart outlet should be null", () => {
      const cart = SeedData.cartForUsers.get("user101");
      expect(cart.outlet).toBeNull();
    });
  });

  describe("stores", () => {
    it("should contain store101 and store102", () => {
      expect(SeedData.stores).toHaveLength(2);
      expect(SeedData.stores.find((s) => s.outletId === "store101")).toBeDefined();
      expect(SeedData.stores.find((s) => s.outletId === "store102")).toBeDefined();
    });
  });

  describe("groceryProducts", () => {
    it("should contain 3 products linked to store101", () => {
      expect(SeedData.groceryProducts).toHaveLength(3);
      SeedData.groceryProducts.forEach((p) => {
        expect(p.store.outletId).toBe("store101");
      });
    });
  });

  describe("foodProducts", () => {
    it("should contain 3 food products", () => {
      expect(SeedData.foodProducts).toHaveLength(3);
    });

    it("each food product should reference rest101", () => {
      SeedData.foodProducts.forEach((p) => {
        expect(p.restaurant.outletId).toBe("rest101");
      });
    });

    it("should have isVeg field set", () => {
      SeedData.foodProducts.forEach((p) => {
        expect(typeof p.isVeg).toBe("boolean");
      });
    });

    it("should have positive availableStock", () => {
      SeedData.foodProducts.forEach((p) => {
        expect(p.availableStock).toBeGreaterThan(0);
      });
    });
  });

  describe("rest101", () => {
    it("should be a Restaurant with outletId rest101", () => {
      expect(SeedData.rest101).toBeDefined();
      expect(SeedData.rest101.outletId).toBe("rest101");
    });
  });
});
