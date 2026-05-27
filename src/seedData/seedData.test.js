const SeedData = require("./seedData");

describe("SeedData", () => {
  describe("users", () => {
    it("seeds both sample users from the README", () => {
      const ids = SeedData.users.map((user) => user.userId);
      expect(ids).toEqual(expect.arrayContaining(["user101", "user102"]));
    });

    it("seeds user102 as Rachel Zane", () => {
      const user102 = SeedData.users.find((user) => user.userId === "user102");
      expect(user102).toBeDefined();
      expect(user102.firstName).toBe("Rachel");
      expect(user102.lastName).toBe("Zane");
    });
  });

  describe("cartForUsers", () => {
    it("assigns each cart to its own user", () => {
      const cart101 = SeedData.cartForUsers.get("user101");
      const cart102 = SeedData.cartForUsers.get("user102");

      expect(cart101.cartId).toBe("cart101");
      expect(cart101.user.userId).toBe("user101");

      expect(cart102.cartId).toBe("cart102");
      expect(cart102.user.userId).toBe("user102");
    });

    it("starts each cart empty with no outlet", () => {
      const cart102 = SeedData.cartForUsers.get("user102");
      expect(cart102.outlet).toBeNull();
      expect(cart102.products).toEqual([]);
    });
  });
});
