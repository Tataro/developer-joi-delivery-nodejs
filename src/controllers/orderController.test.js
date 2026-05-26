const orderController = require("./orderController");
const ValidationError = require("../domain/errors/validationError");
const NotFoundError = require("../domain/errors/notFoundError");
const InsufficientStockError = require("../domain/errors/insufficientStockError");

jest.mock("../services/orderService");
const orderService = require("../services/orderService");

describe("OrderController", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { body: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("checkout", () => {
    it("shouldReturn201WithTheCreatedOrder", () => {
      const request = {
        userId: "user101",
        items: [{ productId: "product101", outletId: "store101", quantity: 2 }],
      };
      mockReq.body = request;
      const createdOrder = {
        orderId: "order101",
        userId: "user101",
        items: [],
        totalAmount: 19.98,
        status: "CONFIRMED",
      };
      orderService.checkout.mockReturnValue(createdOrder);

      orderController.checkout(mockReq, mockRes);

      expect(orderService.checkout).toHaveBeenCalledWith(request);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdOrder);
    });

    it("shouldReturn400OnValidationError", () => {
      orderService.checkout.mockImplementation(() => {
        throw new ValidationError("userId and a non-empty items array are required");
      });

      orderController.checkout(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "userId and a non-empty items array are required",
      });
    });

    it("shouldReturn404WhenUserOrProductNotFound", () => {
      orderService.checkout.mockImplementation(() => {
        throw new NotFoundError("User with id user-99 not found");
      });

      orderController.checkout(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User with id user-99 not found",
      });
    });

    it("shouldReturn409OnInsufficientStock", () => {
      orderService.checkout.mockImplementation(() => {
        throw new InsufficientStockError("Insufficient stock for product product101");
      });

      orderController.checkout(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Insufficient stock for product product101",
      });
    });

    it("shouldReturn500OnUnexpectedError", () => {
      orderService.checkout.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      orderController.checkout(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Unexpected error" });
    });
  });

  describe("getOrder", () => {
    it("shouldReturn200WithTheOrder", () => {
      mockReq.params.orderId = "order101";
      const order = { orderId: "order101", totalAmount: 19.98 };
      orderService.getOrderById.mockReturnValue(order);

      orderController.getOrder(mockReq, mockRes);

      expect(orderService.getOrderById).toHaveBeenCalledWith("order101");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(order);
    });

    it("shouldReturn404WhenOrderMissing", () => {
      mockReq.params.orderId = "nope";
      orderService.getOrderById.mockImplementation(() => {
        throw new NotFoundError("Order with id nope not found");
      });

      orderController.getOrder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Order with id nope not found",
      });
    });
  });
});
