const cartService = require("./cartService");
const NotFoundError = require("../domain/errors/notFoundError");
const ValidationError = require("../domain/errors/validationError");
const SeedData = require("../seedData/seedData");

describe("cartService", () => {
  beforeEach(() => {
    cartService.userCarts = new Map();
    SeedData.cartForUsers.forEach((cart, userId) => {
      // Reset to a clean cart so line items don't accumulate across tests.
      cart.products = [];
      cartService.userCarts.set(userId, cart);
    });
  });

  describe("addProductToCartForUser", () => {
    it("shouldAddTheProductAsALineItemWithDefaultQuantityOne", () => {
      const result = cartService.addProductToCartForUser({
        userId: "user101",
        productId: "product101",
        outletId: "store101",
      });

      expect(result.product.productId).toBe("product101");
      expect(result.cart.products).toHaveLength(1);
      expect(result.cart.products[0].product.productId).toBe("product101");
      expect(result.cart.products[0].quantity).toBe(1);
    });

    it("shouldUseTheRequestedQuantity", () => {
      const result = cartService.addProductToCartForUser({
        userId: "user101",
        productId: "product101",
        outletId: "store101",
        quantity: 3,
      });

      expect(result.cart.products[0].quantity).toBe(3);
    });

    it("shouldMergeQuantityWhenTheSameProductIsAddedAgain", () => {
      cartService.addProductToCartForUser({
        userId: "user101",
        productId: "product101",
        outletId: "store101",
        quantity: 2,
      });
      const result = cartService.addProductToCartForUser({
        userId: "user101",
        productId: "product101",
        outletId: "store101",
        quantity: 3,
      });

      expect(result.cart.products).toHaveLength(1);
      expect(result.cart.products[0].quantity).toBe(5);
    });

    it.each([0, -2, 1.5])(
      "shouldThrowValidationErrorForInvalidQuantity %p",
      (quantity) => {
        expect(() =>
          cartService.addProductToCartForUser({
            userId: "user101",
            productId: "product101",
            outletId: "store101",
            quantity,
          })
        ).toThrow(ValidationError);
      }
    );

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
