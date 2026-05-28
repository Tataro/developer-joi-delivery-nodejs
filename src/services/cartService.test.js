const cartService = require("./cartService");

jest.mock("./userService");
jest.mock("./productService");

const userService = require("./userService");
const productService = require("./productService");

describe("cartService", () => {
  let mockUser;
  let mockProduct;
  let mockCart;

  beforeEach(() => {
    jest.clearAllMocks();
    cartService.userCarts.clear();

    mockProduct = {
      productId: "product101",
      productName: "Wheat Bread",
      sellingPrice: 9.99,
      availableStock: 10,
    };

    mockUser = { userId: "user101" };
    mockCart = { cartId: "cart101", products: [] };

    userService.fetchUserById.mockReturnValue(mockUser);
    productService.getProduct.mockReturnValue(mockProduct);
    cartService.userCarts.set("user101", mockCart);
  });

  describe("addProductToCartForUser", () => {
    it("should throw ValidationError when request is missing", () => {
      expect(() => cartService.addProductToCartForUser(null)).toThrow("Request is required");
    });

    it("should throw ValidationError when userId is missing", () => {
      expect(() => cartService.addProductToCartForUser({ productId: "p1", outletId: "s1" })).toThrow("userId is required");
    });

    it("should throw ValidationError when productId is missing", () => {
      expect(() => cartService.addProductToCartForUser({ userId: "u1", outletId: "s1" })).toThrow("productId is required");
    });

    it("should throw ValidationError when outletId is missing", () => {
      expect(() => cartService.addProductToCartForUser({ userId: "u1", productId: "p1" })).toThrow("outletId is required");
    });

    it("should throw ValidationError when quantity is zero", () => {
      expect(() =>
        cartService.addProductToCartForUser({ userId: "user101", productId: "product101", outletId: "store101", quantity: 0 })
      ).toThrow("quantity must be a positive integer");
    });

    it("should throw ValidationError when quantity is negative", () => {
      expect(() =>
        cartService.addProductToCartForUser({ userId: "user101", productId: "product101", outletId: "store101", quantity: -1 })
      ).toThrow("quantity must be a positive integer");
    });

    it("should throw ValidationError when quantity is not an integer", () => {
      expect(() =>
        cartService.addProductToCartForUser({ userId: "user101", productId: "product101", outletId: "store101", quantity: 1.5 })
      ).toThrow("quantity must be a positive integer");
    });

    it("should throw NotFoundError when user not found", () => {
      userService.fetchUserById.mockReturnValue(null);
      expect(() =>
        cartService.addProductToCartForUser({ userId: "unknown", productId: "product101", outletId: "store101" })
      ).toThrow("User not found");
    });

    it("should throw NotFoundError when cart not found for user", () => {
      cartService.userCarts.clear();
      expect(() =>
        cartService.addProductToCartForUser({ userId: "user101", productId: "product101", outletId: "store101" })
      ).toThrow("Cart not found");
    });

    it("should throw NotFoundError when product not found", () => {
      productService.getProduct.mockReturnValue(undefined);
      expect(() =>
        cartService.addProductToCartForUser({ userId: "user101", productId: "bad", outletId: "store101" })
      ).toThrow("Product not found");
    });

    it("should throw InsufficientStockError when quantity exceeds stock", () => {
      expect(() =>
        cartService.addProductToCartForUser({ userId: "user101", productId: "product101", outletId: "store101", quantity: 11 })
      ).toThrow("Insufficient stock");
    });

    it("should add product with default quantity 1 and return result", () => {
      const result = cartService.addProductToCartForUser({
        userId: "user101",
        productId: "product101",
        outletId: "store101",
      });
      expect(result.quantity).toBe(1);
      expect(result.product).toBe(mockProduct);
      expect(result.sellingPrice).toBe(9.99);
      expect(mockProduct.availableStock).toBe(9);
    });

    it("should add product with explicit quantity and decrement stock", () => {
      const result = cartService.addProductToCartForUser({
        userId: "user101",
        productId: "product101",
        outletId: "store101",
        quantity: 3,
      });
      expect(result.quantity).toBe(3);
      expect(mockProduct.availableStock).toBe(7);
    });

    it("should merge duplicate products in cart and accumulate quantity", () => {
      cartService.addProductToCartForUser({ userId: "user101", productId: "product101", outletId: "store101", quantity: 2 });
      const result = cartService.addProductToCartForUser({ userId: "user101", productId: "product101", outletId: "store101", quantity: 3 });
      expect(result.quantity).toBe(5);
      expect(mockCart.products).toHaveLength(1);
    });
  });

  describe("getCartForUser", () => {
    it("should throw ValidationError when userId is missing", () => {
      expect(() => cartService.getCartForUser(null)).toThrow("userId is required");
    });

    it("should throw NotFoundError when user not found", () => {
      userService.fetchUserById.mockReturnValue(null);
      expect(() => cartService.getCartForUser("unknown")).toThrow("User not found");
    });

    it("should throw NotFoundError when cart not found", () => {
      cartService.userCarts.clear();
      expect(() => cartService.getCartForUser("user101")).toThrow("Cart not found");
    });

    it("should return the cart for a valid user", () => {
      const cart = cartService.getCartForUser("user101");
      expect(cart).toBe(mockCart);
    });
  });
});
