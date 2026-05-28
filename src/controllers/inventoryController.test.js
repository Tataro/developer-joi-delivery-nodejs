const inventoryController = require("./inventoryController");

jest.mock("../services/inventoryService");
const inventoryService = require("../services/inventoryService");

describe("InventoryController", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { query: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("fetchStoreInventoryHealth", () => {
    it("should return 200 with health data for a valid store", () => {
      const health = {
        storeId: "store101",
        storeName: "Fresh Picks",
        totalProducts: 3,
        healthyCount: 2,
        lowStockCount: 1,
        outOfStockCount: 0,
      };
      mockReq.query = { storeId: "store101" };
      inventoryService.getStoreInventoryHealth.mockReturnValue(health);

      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);

      expect(inventoryService.getStoreInventoryHealth).toHaveBeenCalledWith("store101");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(health);
    });

    it("should return 400 when service throws ValidationError", () => {
      const err = new Error("storeId is required");
      err.statusCode = 400;
      inventoryService.getStoreInventoryHealth.mockImplementation(() => { throw err; });

      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "storeId is required" });
    });

    it("should return 404 when service throws NotFoundError", () => {
      const err = new Error("Store not found");
      err.statusCode = 404;
      inventoryService.getStoreInventoryHealth.mockImplementation(() => { throw err; });

      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Store not found" });
    });

    it("should return 500 when service throws unexpected error", () => {
      inventoryService.getStoreInventoryHealth.mockImplementation(() => { throw new Error("Unexpected"); });

      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});
