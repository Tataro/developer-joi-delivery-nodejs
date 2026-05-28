const cartService = require("./cartService");
const NotFoundError = require("../domain/errors/notFoundError");
const SeedData = require("../seedData/seedData");

describe("cartService", () => {
  beforeEach(() => {
    cartService.userCarts = new Map();
    SeedData.cartForUsers.forEach((cart, userId) => {
      cartService.userCarts.set(userId, cart);
    });
  });

  describe("addProductToCartForUser", () => {
    it("shouldAddTheProductToTheUsersCart", () => {
      const result = cartService.addProductToCartForUser({
        userId: "user101",
        productId: "product101",
        outletId: "store101",
      });

      expect(result.product.productId).toBe("product101");
      expect(result.cart.products).toContain(result.product);
    });

    it("shouldThrowNotFoundErrorWhenUserDoesNotExist", () => {
      expect(() =>
        cartService.addProductToCartForUser({
          userId: "ghost",
          productId: "product101",
          outletId: "store101",
        })
      ).toThrow(NotFoundError);
    });

    it("shouldThrowNotFoundErrorWhenProductDoesNotExist", () => {
      expect(() =>
        cartService.addProductToCartForUser({
          userId: "user101",
          productId: "ghost",
          outletId: "store101",
        })
      ).toThrow(NotFoundError);
    });
  });

  describe("getCartForUser", () => {
    it("shouldReturnTheCartForAnExistingUser", () => {
      const cart = cartService.getCartForUser("user101");

      expect(cart.cartId).toBe("cart101");
    });

    it("shouldThrowNotFoundErrorWhenUserDoesNotExist", () => {
      expect(() => cartService.getCartForUser("ghost")).toThrow(NotFoundError);
    });
  });
});
