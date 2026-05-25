const inventoryController = require("./inventoryController");

jest.mock("../services/inventoryService");
const inventoryService = require("../services/inventoryService");

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
      const storeId = "store101";
      mockReq.query.storeId = storeId;
      const mockResult = {
        storeId,
        totalProducts: 10,
        lowStockCount: 2,
        outOfStockCount: 1,
      };
      inventoryService.getStoreInventoryHealth.mockReturnValue(mockResult);

      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);

      expect(inventoryService.getStoreInventoryHealth).toHaveBeenCalledWith(
        storeId,
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("shouldReturn404IfStoreNotFound", () => {
      const storeId = "nonExistingStore";
      mockReq.query.storeId = storeId;
      const errorMessage = `Store with id ${storeId} not found`;
      inventoryService.getStoreInventoryHealth.mockImplementation(() => {
        const error = new Error(errorMessage);
        error.statusCode = 404;
        throw error;
      });

      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);

      expect(inventoryService.getStoreInventoryHealth).toHaveBeenCalledWith(
        storeId,
      );
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it("shouldReturn500IfUnexpectedErrorOccurs", () => {
      const storeId = "store101";
      mockReq.query.storeId = storeId;
      const errorMessage = "Unexpected error";
      inventoryService.getStoreInventoryHealth.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);

      expect(inventoryService.getStoreInventoryHealth).toHaveBeenCalledWith(
        storeId,
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});
