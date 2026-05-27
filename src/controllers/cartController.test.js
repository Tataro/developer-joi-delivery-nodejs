const cartController = require("./cartController");
const NotFoundError = require("../domain/errors/notFoundError");
const ValidationError = require("../domain/errors/validationError");

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
        addProductRequest,
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expectedResult);
    });

    it("shouldRespondWithTheErrorStatusCodeWhenTheServiceThrows", () => {
      mockReq.body = { userId: "ghost" };

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

    it("shouldRespondWith500WhenAnUnexpectedErrorOccurs", () => {
      mockReq.body = { userId: "user101" };

      const cartService = require("../services/cartService");
      cartService.addProductToCartForUser.mockImplementation(() => {
        throw new Error("Database connection failed");
      });

      cartController.addProductToCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Database connection failed",
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

    it("shouldRespondWith400WhenTheRequestIsInvalid", () => {
      mockReq.query = {};

      const cartService = require("../services/cartService");
      cartService.getCartForUser.mockImplementation(() => {
        throw new ValidationError("userId is required");
      });

      cartController.viewCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "userId is required",
      });
    });

    it("shouldRespondWith500WhenAnUnexpectedErrorOccurs", () => {
      const userId = "user101";
      mockReq.query = { userId };

      const cartService = require("../services/cartService");
      cartService.getCartForUser.mockImplementation(() => {
        throw new Error("Database connection failed");
      });

      cartController.viewCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Database connection failed",
      });
    });
  });
});
