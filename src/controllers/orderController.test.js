const orderController = require("./orderController");
const orderService = require("../services/orderService");

jest.mock("../services/orderService");

describe("orderController", () => {
  describe("placeOrder", () => {
    it("should place an order successfully", () => {
      // Mock the orderService.placeOrder method to return a successful response
      const mockOrderResponse = {
        orderId: "order-101",
        customerId: "user101",
        storeId: "store101",
        products: [
          {
            productId: "product101",
            productName: "ele1",
            quantity: 5,
            price: 100,
            totalPrice: 500,
            category: "electronics",
          },
          {
            productId: "product102",
            productName: "med2",
            quantity: 1,
            price: 10,
            totalPrice: 10,
            category: "medicine",
          },
        ],
        discount: 30,
        amount: 480,
      };

      orderService.createOrder.mockReturnValue(mockOrderResponse);

      // Mock request and response objects
      const req = {
        body: {
          customerId: "xxx",
          storeId: "store101",
          products: [
            {
              productId: "product101",
              quantity: 2,
              price: 10,
            },
            {
              productId: "product102",
              quantity: 1,
              price: 10,
            },
          ],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Call the placeOrder method
      orderController.placeOrder(req, res);

      // Assert that the orderService.createOrder method was called with the correct parameters
      expect(orderService.createOrder).toHaveBeenCalledWith(req.body);

      // Assert that the response status is 200 and the JSON response is correct
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockOrderResponse);
    });
  });
});
