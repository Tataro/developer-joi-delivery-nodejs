const orderService = require("./orderService");
const userService = require("./userService");
const inventoryService = require("./inventoryService");
const ValidationError = require("../domain/errors/validationError");
const NotFoundError = require("../domain/errors/notFoundError");
const InsufficientStockError = require("../domain/errors/insufficientStockError");

jest.mock("./userService");
jest.mock("./inventoryService");

const mockUser = { userId: "user-1" };
const validRequest = {
  userId: "user-1",
  items: [{ productId: "prod-1", outletId: "store-1", quantity: 2 }],
};

beforeEach(() => {
  jest.clearAllMocks();
  orderService.orders = new Map();
});

describe("OrderService", () => {
  describe("checkout", () => {
    it("shouldThrowValidationErrorIfRequestIsMissing", () => {
      expect(() => orderService.checkout(null)).toThrow(ValidationError);
    });

    it("shouldThrowValidationErrorIfItemsAreEmpty", () => {
      expect(() =>
        orderService.checkout({ userId: "user-1", items: [] }),
      ).toThrow(ValidationError);
    });

    it("shouldThrowNotFoundErrorIfUserNotFound", () => {
      userService.fetchUserById.mockReturnValue(null);

      expect(() => orderService.checkout(validRequest)).toThrow(NotFoundError);
      expect(inventoryService.reserveStock).not.toHaveBeenCalled();
    });

    it("shouldPropagateInsufficientStockError", () => {
      userService.fetchUserById.mockReturnValue(mockUser);
      inventoryService.reserveStock.mockImplementation(() => {
        throw new InsufficientStockError("Insufficient stock for product prod-1");
      });

      expect(() => orderService.checkout(validRequest)).toThrow(
        InsufficientStockError,
      );
    });

    it("shouldCreateOrderWithPricedItemsAndTotalOnSuccess", () => {
      userService.fetchUserById.mockReturnValue(mockUser);
      inventoryService.reserveStock.mockReturnValue([
        {
          product: {
            productId: "prod-1",
            productName: "Wheat Bread",
            sellingPrice: 9.99,
          },
          quantity: 2,
        },
      ]);

      const order = orderService.checkout(validRequest);

      expect(inventoryService.reserveStock).toHaveBeenCalledWith(
        validRequest.items,
      );
      expect(order.userId).toBe("user-1");
      expect(order.status).toBe("CONFIRMED");
      expect(order.orderId).toEqual(expect.stringMatching(/^order/));
      expect(order.items).toEqual([
        {
          productId: "prod-1",
          productName: "Wheat Bread",
          quantity: 2,
          unitPrice: 9.99,
          lineTotal: 19.98,
        },
      ]);
      expect(order.totalAmount).toBe(19.98);
      expect(orderService.orders.get(order.orderId)).toBe(order);
    });
  });

  describe("getOrderById", () => {
    it("shouldReturnTheOrder", () => {
      userService.fetchUserById.mockReturnValue(mockUser);
      inventoryService.reserveStock.mockReturnValue([
        { product: { productId: "p", productName: "P", sellingPrice: 1 }, quantity: 1 },
      ]);
      const order = orderService.checkout(validRequest);

      expect(orderService.getOrderById(order.orderId)).toBe(order);
    });

    it("shouldThrowNotFoundErrorIfOrderMissing", () => {
      expect(() => orderService.getOrderById("order-missing")).toThrow(
        NotFoundError,
      );
    });
  });
});
