const userService = require("./userService");

describe("UserService", () => {
  describe("fetchUserById", () => {
    it("shouldReturnUserWhenUserIdExists", () => {
      const user = userService.fetchUserById("user101");
      expect(user).toBeDefined();
      expect(user.userId).toBe("user101");
    });

    it("shouldReturnNullWhenUserIdDoesNotExist", () => {
      const user = userService.fetchUserById("nonexistent");
      expect(user).toBeNull();
    });

    it("shouldReturnCorrectUserForDifferentValidUsers", () => {
      const user = userService.fetchUserById("user102");
      expect(user).toBeDefined();
      expect(user.userId).toBe("user102");
    });

    it("shouldReturnNullWhenUserIdIsUndefined", () => {
      const user = userService.fetchUserById(undefined);
      expect(user).toBeNull();
    });

    it("shouldReturnNullWhenUserIdIsNull", () => {
      const user = userService.fetchUserById(null);
      expect(user).toBeNull();
    });
  });
});
