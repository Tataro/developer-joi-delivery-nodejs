const userService = require("./userService");

jest.mock("../seedData/seedData", () => ({
  users: [
    { userId: "user101", firstName: "John" },
    { userId: "user102", firstName: "Rachel" },
  ],
}));

describe("userService", () => {
  describe("fetchUserById", () => {
    it("should return the user when userId matches", () => {
      const user = userService.fetchUserById("user101");
      expect(user).toBeDefined();
      expect(user.userId).toBe("user101");
    });

    it("should return null when userId does not match any user", () => {
      const user = userService.fetchUserById("unknown");
      expect(user).toBeNull();
    });
  });
});
