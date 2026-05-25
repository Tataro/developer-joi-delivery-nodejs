const cartService = require("./cartService");
const userService = require("./userService");
const productService = require("./productService");
const ValidationError = require("../domain/errors/validationError");
const NotFoundError = require("../domain/errors/notFoundError");

jest.mock("./userService");
jest.mock("./productService");

const mockUser = { userId: "user-1" };
const mockProduct = { productId: "prod-1", sellingPrice: 9.99 };
const mockCart = { products: [] };

beforeEach(() => {
  jest.clearAllMocks();
  cartService.userCarts = new Map([["user-1", mockCart]]);
  mockCart.products = [];
});

describe("CartService", () => {
  describe("addProductToCartForUser", () => {
    it("shouldThrowValidationErrorIfRequestIsMissing", () => {
      expect(() => cartService.addProductToCartForUser(null)).toThrow(
        ValidationError,
      );
    });

    it("shouldThrowValidationErrorIfUserIdIsMissing", () => {
      expect(() =>
        cartService.addProductToCartForUser({
          productId: "prod-1",
          outletId: "outlet-1",
        }),
      ).toThrow(ValidationError);
    });

    it("shouldThrowValidationErrorIfProductIdIsMissing", () => {
      expect(() =>
        cartService.addProductToCartForUser({
          userId: "user-1",
          outletId: "outlet-1",
        }),
      ).toThrow(ValidationError);
    });

    it("shouldThrowValidationErrorIfOutletIdIsMissing", () => {
      expect(() =>
        cartService.addProductToCartForUser({
          userId: "user-1",
          productId: "prod-1",
        }),
      ).toThrow(ValidationError);
    });

    it("shouldThrowNotFoundErrorIfUserNotFound", () => {
      userService.fetchUserById.mockReturnValue(null);

      expect(() =>
        cartService.addProductToCartForUser({
          userId: "user-99",
          productId: "prod-1",
          outletId: "outlet-1",
        }),
      ).toThrow(NotFoundError);
    });

    it("shouldThrowNotFoundErrorIfProductNotFound", () => {
      userService.fetchUserById.mockReturnValue(mockUser);
      productService.getProduct.mockReturnValue(null);

      expect(() =>
        cartService.addProductToCartForUser({
          userId: "user-1",
          productId: "prod-99",
          outletId: "outlet-1",
        }),
      ).toThrow(NotFoundError);
    });

    it("shouldReturnCartAndProductOnSuccess", () => {
      userService.fetchUserById.mockReturnValue(mockUser);
      productService.getProduct.mockReturnValue(mockProduct);

      const result = cartService.addProductToCartForUser({
        userId: "user-1",
        productId: "prod-1",
        outletId: "outlet-1",
      });

      expect(result).toEqual({
        cart: mockCart,
        product: mockProduct,
        sellingPrice: mockProduct.sellingPrice,
      });
      expect(mockCart.products).toContain(mockProduct);
    });
  });

  describe("getCartForUser", () => {
    it("shouldReturnCartForUser", () => {
      userService.fetchUserById.mockReturnValue(mockUser);

      const result = cartService.getCartForUser("user-1");

      expect(result).toBe(mockCart);
    });

    it("shouldThrowNotFoundErrorIfUserNotFound", () => {
      userService.fetchUserById.mockReturnValue(null);

      expect(() => cartService.getCartForUser("user-99")).toThrow(
        NotFoundError,
      );
    });
  });
});
