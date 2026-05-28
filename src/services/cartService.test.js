const cartService = require("./cartService");
const userService = require("./userService");
const productService = require("./productService");
const ValidationError = require("../domain/errors/validationError");
const NotFoundError = require("../domain/errors/notFoundError");
const InsufficientStockError = require("../domain/errors/insufficientStockError");

jest.mock("./userService");
jest.mock("./productService");

const mockUser = { userId: "user-1" };
let mockProduct;
let mockCart;

beforeEach(() => {
  jest.clearAllMocks();
  mockProduct = {
    productId: "prod-1",
    productName: "Test Product",
    sellingPrice: 9.99,
    availableStock: 10,
  };
  mockCart = { products: [] };
  cartService.userCarts = new Map([["user-1", mockCart]]);
  userService.fetchUserById.mockReturnValue(mockUser);
  productService.getProduct.mockReturnValue(mockProduct);
});

describe("CartService", () => {
  describe("addProductToCartForUser", () => {
    it("shouldThrowValidationErrorIfRequestIsMissing", () => {
      expect(() => cartService.addProductToCartForUser(null)).toThrow(
        ValidationError
      );
    });

    it("shouldThrowValidationErrorIfUserIdIsMissing", () => {
      expect(() =>
        cartService.addProductToCartForUser({
          productId: "prod-1",
          outletId: "outlet-1",
        })
      ).toThrow(ValidationError);
    });

    it("shouldThrowValidationErrorIfProductIdIsMissing", () => {
      expect(() =>
        cartService.addProductToCartForUser({
          userId: "user-1",
          outletId: "outlet-1",
        })
      ).toThrow(ValidationError);
    });

    it("shouldThrowValidationErrorIfOutletIdIsMissing", () => {
      expect(() =>
        cartService.addProductToCartForUser({
          userId: "user-1",
          productId: "prod-1",
        })
      ).toThrow(ValidationError);
    });

    it("shouldThrowValidationErrorIfQuantityIsNotAPositiveInteger", () => {
      const request = {
        userId: "user-1",
        productId: "prod-1",
        outletId: "outlet-1",
      };

      expect(() =>
        cartService.addProductToCartForUser({ ...request, quantity: 0 })
      ).toThrow(ValidationError);
      expect(() =>
        cartService.addProductToCartForUser({ ...request, quantity: -2 })
      ).toThrow(ValidationError);
      expect(() =>
        cartService.addProductToCartForUser({ ...request, quantity: 1.5 })
      ).toThrow(ValidationError);
    });

    it("shouldThrowNotFoundErrorIfUserNotFound", () => {
      userService.fetchUserById.mockReturnValue(null);

      expect(() =>
        cartService.addProductToCartForUser({
          userId: "user-99",
          productId: "prod-1",
          outletId: "outlet-1",
        })
      ).toThrow(NotFoundError);
    });

    it("shouldThrowNotFoundErrorIfCartNotFound", () => {
      userService.fetchUserById.mockReturnValue({ userId: "user-no-cart" });

      expect(() =>
        cartService.addProductToCartForUser({
          userId: "user-no-cart",
          productId: "prod-1",
          outletId: "outlet-1",
        })
      ).toThrow(NotFoundError);
    });

    it("shouldThrowNotFoundErrorIfProductNotFound", () => {
      productService.getProduct.mockReturnValue(null);

      expect(() =>
        cartService.addProductToCartForUser({
          userId: "user-1",
          productId: "prod-99",
          outletId: "outlet-1",
        })
      ).toThrow(NotFoundError);
    });

    it("shouldThrowInsufficientStockErrorWhenQuantityExceedsStock", () => {
      expect(() =>
        cartService.addProductToCartForUser({
          userId: "user-1",
          productId: "prod-1",
          outletId: "outlet-1",
          quantity: 11,
        })
      ).toThrow(InsufficientStockError);

      // stock is untouched and nothing is added on failure
      expect(mockProduct.availableStock).toBe(10);
      expect(mockCart.products).toHaveLength(0);
    });

    it("shouldDefaultQuantityToOneAndReserveStock", () => {
      const result = cartService.addProductToCartForUser({
        userId: "user-1",
        productId: "prod-1",
        outletId: "outlet-1",
      });

      expect(result).toEqual({
        cart: mockCart,
        product: mockProduct,
        quantity: 1,
        sellingPrice: 9.99,
      });
      expect(mockProduct.availableStock).toBe(9);
      expect(mockCart.products).toEqual([{ product: mockProduct, quantity: 1 }]);
    });

    it("shouldReserveTheRequestedQuantity", () => {
      const result = cartService.addProductToCartForUser({
        userId: "user-1",
        productId: "prod-1",
        outletId: "outlet-1",
        quantity: 3,
      });

      expect(result.quantity).toBe(3);
      expect(mockProduct.availableStock).toBe(7);
      expect(mockCart.products).toEqual([{ product: mockProduct, quantity: 3 }]);
    });

    it("shouldMergeRepeatedAddsOfTheSameProduct", () => {
      const request = {
        userId: "user-1",
        productId: "prod-1",
        outletId: "outlet-1",
      };

      cartService.addProductToCartForUser({ ...request, quantity: 2 });
      const result = cartService.addProductToCartForUser({
        ...request,
        quantity: 1,
      });

      expect(result.quantity).toBe(3);
      expect(mockCart.products).toHaveLength(1);
      expect(mockCart.products[0].quantity).toBe(3);
      expect(mockProduct.availableStock).toBe(7);
    });
  });

  describe("getCartForUser", () => {
    it("shouldReturnCartForUser", () => {
      const result = cartService.getCartForUser("user-1");

      expect(result).toBe(mockCart);
    });

    it("shouldThrowValidationErrorIfUserIdIsMissing", () => {
      expect(() => cartService.getCartForUser()).toThrow(ValidationError);
    });

    it("shouldThrowNotFoundErrorIfUserNotFound", () => {
      userService.fetchUserById.mockReturnValue(null);

      expect(() => cartService.getCartForUser("user-99")).toThrow(
        NotFoundError
      );
    });

    it("shouldThrowNotFoundErrorIfCartNotFound", () => {
      userService.fetchUserById.mockReturnValue({ userId: "user-no-cart" });

      expect(() => cartService.getCartForUser("user-no-cart")).toThrow(
        NotFoundError
      );
    });
  });
});
