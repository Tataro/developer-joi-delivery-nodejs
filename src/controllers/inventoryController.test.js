const inventoryController = require("./inventoryController");
const NotFoundError = require("../domain/errors/notFoundError");

jest.mock("../services/inventoryService");

describe("InventoryController", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      query: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("fetchStoreInventoryHealth", () => {
    it("shouldReturnTheHealthOfTheStore", () => {
      mockReq.query = { storeId: "store101" };

      const expectedHealth = {
        storeId: "store101",
        totalProducts: 3,
        outOfStock: 0,
        lowStock: 0,
        healthy: 3,
      };

      const inventoryService = require("../services/inventoryService");
      inventoryService.fetchStoreInventoryHealth.mockReturnValue(
        expectedHealth
      );

      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);

      expect(inventoryService.fetchStoreInventoryHealth).toHaveBeenCalledWith(
        "store101"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expectedHealth);
    });

    it("shouldRespondWith400WhenStoreIdIsMissing", () => {
      mockReq.query = {};

      const inventoryService = require("../services/inventoryService");

      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);

      expect(
        inventoryService.fetchStoreInventoryHealth
      ).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "storeId query parameter is required",
      });
    });

    it("shouldRespondWith404WhenTheStoreDoesNotExist", () => {
      mockReq.query = { storeId: "ghost" };

      const inventoryService = require("../services/inventoryService");
      inventoryService.fetchStoreInventoryHealth.mockImplementation(() => {
        throw new NotFoundError("Store 'ghost' not found");
      });

      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Store 'ghost' not found",
      });
    });
  });
});
