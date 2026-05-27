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
        storeName: "Fresh Picks",
        totalProducts: 3,
        healthyCount: 3,
        lowStock: [],
        outOfStock: [],
      };

      const inventoryService = require("../services/inventoryService");
      inventoryService.getStoreInventoryHealth.mockReturnValue(expectedHealth);

      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);

      expect(inventoryService.getStoreInventoryHealth).toHaveBeenCalledWith(
        "store101",
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expectedHealth);
    });

    it("shouldRespondWithTheErrorStatusCodeWhenTheServiceThrows", () => {
      mockReq.query = { storeId: "store999" };

      const inventoryService = require("../services/inventoryService");
      inventoryService.getStoreInventoryHealth.mockImplementation(() => {
        throw new NotFoundError("Store 'store999' not found");
      });

      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Store 'store999' not found",
      });
    });

    it("shouldRespondWith500WhenAnUnexpectedErrorOccurs", () => {
      mockReq.query = { storeId: "store101" };

      const inventoryService = require("../services/inventoryService");
      inventoryService.getStoreInventoryHealth.mockImplementation(() => {
        throw new Error("Database connection failed");
      });

      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Database connection failed",
      });
    });
  });
});
