const cartController = require("./cartController");

jest.mock("../services/cartService");

describe("CartController", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      body: {},
      query: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("addProductToCart", () => {
    it("should return 400 when service throws ValidationError", () => {
      const cartService = require("../services/cartService");
      const err = new Error("userId is required");
      err.statusCode = 400;
      cartService.addProductToCartForUser.mockImplementation(() => { throw err; });

      cartController.addProductToCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "userId is required" });
    });

    it("should return 404 when service throws NotFoundError", () => {
      const cartService = require("../services/cartService");
      const err = new Error("User not found");
      err.statusCode = 404;
      cartService.addProductToCartForUser.mockImplementation(() => { throw err; });

      cartController.addProductToCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 500 when service throws unexpected error", () => {
      const cartService = require("../services/cartService");
      cartService.addProductToCartForUser.mockImplementation(() => { throw new Error("Unexpected"); });

      cartController.addProductToCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    it("shouldAddTheRequestedProductToTheCart", () => {
      const addProductRequest = {
        userId: "user101",
        productId: "grocery101",
        outletId: "store101",
        quantity: 2,
      };

      mockReq.body = addProductRequest;

      const expectedResult = {
        cart: { products: [] },
        product: { productId: "grocery101", name: "Organic Bananas" },
        sellingPrice: 3.49,
      };

      const cartService = require("../services/cartService");
      cartService.addProductToCartForUser.mockReturnValue(expectedResult);

      cartController.addProductToCart(mockReq, mockRes);

      expect(cartService.addProductToCartForUser).toHaveBeenCalledWith(
        addProductRequest
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe("viewCart", () => {
    it("should return 400 when service throws ValidationError", () => {
      const cartService = require("../services/cartService");
      const err = new Error("userId is required");
      err.statusCode = 400;
      cartService.getCartForUser.mockImplementation(() => { throw err; });

      cartController.viewCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "userId is required" });
    });

    it("should return 404 when service throws NotFoundError", () => {
      const cartService = require("../services/cartService");
      const err = new Error("Cart not found");
      err.statusCode = 404;
      cartService.getCartForUser.mockImplementation(() => { throw err; });

      cartController.viewCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 when service throws unexpected error", () => {
      const cartService = require("../services/cartService");
      cartService.getCartForUser.mockImplementation(() => { throw new Error("Unexpected"); });

      cartController.viewCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    it("shouldReturnTheCart", () => {
      const userId = "user101";
      mockReq.query = { userId };

      const expectedCart = {
        cartId: "cart101",
        userId: "user101",
        products: [
          { productId: "grocery101", name: "Organic Bananas", quantity: 2 },
        ],
        total: 6.98,
      };

      const cartService = require("../services/cartService");
      cartService.getCartForUser.mockReturnValue(expectedCart);

      cartController.viewCart(mockReq, mockRes);

      expect(cartService.getCartForUser).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expectedCart);
    });
  });
});
