const cartController = require("./cartController");
const ValidationError = require("../domain/errors/validationError");
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

    it("shouldReturn400IfRequestIsInvalid", () => {
      const errorMessage =
        "userId, productId and outletId are required in the request body";
      const cartService = require("../services/cartService");
      cartService.addProductToCartForUser.mockImplementation(() => {
        throw new ValidationError(errorMessage);
      });

      cartController.addProductToCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it("shouldReturn404IfUserNotFound", () => {
      const addProductRequest = {
        userId: "nonExistingUser",
        productId: "grocery101",
        outletId: "store101",
        quantity: 2,
      };

      mockReq.body = addProductRequest;

      const errorMessage = `User with id ${addProductRequest.userId} not found`;

      const cartService = require("../services/cartService");
      cartService.addProductToCartForUser.mockImplementation(() => {
        throw new NotFoundError(errorMessage);
      });

      cartController.addProductToCart(mockReq, mockRes);

      expect(cartService.addProductToCartForUser).toHaveBeenCalledWith(
        addProductRequest,
      );
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it("shouldReturn404IfProductNotFound", () => {
      const addProductRequest = {
        userId: "user101",
        productId: "nonExistingProduct",
        outletId: "store101",
        quantity: 2,
      };

      mockReq.body = addProductRequest;

      const errorMessage = `Product with id ${addProductRequest.productId} not found in store with id ${addProductRequest.outletId}`;

      const cartService = require("../services/cartService");
      cartService.addProductToCartForUser.mockImplementation(() => {
        throw new NotFoundError(errorMessage);
      });

      cartController.addProductToCart(mockReq, mockRes);

      expect(cartService.addProductToCartForUser).toHaveBeenCalledWith(
        addProductRequest,
      );
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: errorMessage });
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

    it("shouldReturn500IfUnexpectedErrorOccurs", () => {
      const cartService = require("../services/cartService");
      cartService.getCartForUser.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      mockReq.query = { userId: "user101" };
      cartController.viewCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Unexpected error",
      });
    });
  });
});
