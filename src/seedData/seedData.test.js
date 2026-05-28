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
  });
});
