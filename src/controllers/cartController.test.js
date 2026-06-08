const cartController = require("./cartController");
const NotFoundError = require("../domain/errors/notFoundError");

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
    it("shouldAddTheRequestedProductToTheCart", () => {
      const addProductRequest = {
        userId: "user101",
        productId: "product101",
        outletId: "store101",
        quantity: 2,
      };

      mockReq.body = addProductRequest;

      const expectedResult = {
        cart: { products: [] },
        product: { productId: "product101", productName: "Wheat Bread" },
        sellingPrice: 9.99,
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

    it("shouldRespondWith404WhenTheServiceThrowsNotFoundError", () => {
      mockReq.body = {
        userId: "ghost",
        productId: "product101",
        outletId: "store101",
      };

      const cartService = require("../services/cartService");
      cartService.addProductToCartForUser.mockImplementation(() => {
        throw new NotFoundError("User 'ghost' not found");
      });

      cartController.addProductToCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "User 'ghost' not found",
      });
    });
  });

  describe("viewCart", () => {
    it("shouldReturnTheCart", () => {
      const userId = "user101";
      mockReq.query = { userId };

      const expectedCart = {
        cartId: "cart101",
        userId: "user101",
        products: [
          {
            product: { productId: "product101", productName: "Wheat Bread" },
            quantity: 2,
          },
        ],
      };

      const cartService = require("../services/cartService");
      cartService.getCartForUser.mockReturnValue(expectedCart);

      cartController.viewCart(mockReq, mockRes);

      expect(cartService.getCartForUser).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expectedCart);
    });

    it("shouldRespondWith400WhenUserIdIsMissing", () => {
      mockReq.query = {};

      const cartService = require("../services/cartService");

      cartController.viewCart(mockReq, mockRes);

      expect(cartService.getCartForUser).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "userId query parameter is required",
      });
    });

    it("shouldRespondWith404WhenTheUserDoesNotExist", () => {
      mockReq.query = { userId: "ghost" };

      const cartService = require("../services/cartService");
      cartService.getCartForUser.mockImplementation(() => {
        throw new NotFoundError("User 'ghost' not found");
      });

      cartController.viewCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "User 'ghost' not found",
      });
    });
  });
});
