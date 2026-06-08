const orderController = require("./orderController");
const NotFoundError = require("../domain/errors/notFoundError");

jest.mock("../services/orderService");

describe("orderController.createOrder", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("shouldReturn201WithTheCreatedOrder", () => {
    const request = {
      customerId: "user101",
      storeId: "store102",
      items: [{ productId: "electronic101", quantity: 7 }],
    };
    mockReq.body = request;

    const expectedOrder = { orderId: "order_abc", finalPayableAmount: 535.44 };
    const orderService = require("../services/orderService");
    orderService.createOrder.mockReturnValue(expectedOrder);

    orderController.createOrder(mockReq, mockRes);

    expect(orderService.createOrder).toHaveBeenCalledWith(request);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(expectedOrder);
  });

  it("shouldRespondWith404WhenTheServiceThrowsNotFoundError", () => {
    mockReq.body = { customerId: "ghost", storeId: "store102", items: [] };

    const orderService = require("../services/orderService");
    orderService.createOrder.mockImplementation(() => {
      throw new NotFoundError("User 'ghost' not found");
    });

    orderController.createOrder(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "User 'ghost' not found",
    });
  });
});
