const restaurantController = require("./restaurantController");
const ValidationError = require("../domain/errors/validationError");
const RestaurantNotFoundError = require("../domain/errors/restaurantNotFoundError");

jest.mock("../services/restaurantService");
const restaurantService = require("../services/restaurantService");

describe("RestaurantController", () => {
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

  describe("fetchMenu", () => {
    it("shouldReturn200WithTheMenu", () => {
      mockReq.query.restaurantId = "restaurant101";
      const menu = { restaurantId: "restaurant101", menu: [] };
      restaurantService.getMenu.mockReturnValue(menu);

      restaurantController.fetchMenu(mockReq, mockRes);

      expect(restaurantService.getMenu).toHaveBeenCalledWith("restaurant101");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(menu);
    });

    it("shouldReturn400WhenRestaurantIdMissing", () => {
      restaurantService.getMenu.mockImplementation(() => {
        throw new ValidationError("restaurantId is required");
      });

      restaurantController.fetchMenu(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "restaurantId is required",
      });
    });

    it("shouldReturn404WhenRestaurantNotFound", () => {
      mockReq.query.restaurantId = "nope";
      restaurantService.getMenu.mockImplementation(() => {
        throw new RestaurantNotFoundError("Restaurant with id nope not found");
      });

      restaurantController.fetchMenu(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Restaurant with id nope not found",
      });
    });

    it("shouldReturn500OnUnexpectedError", () => {
      restaurantService.getMenu.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      restaurantController.fetchMenu(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Unexpected error" });
    });
  });

  describe("fetchMenuAvailability", () => {
    it("shouldReturn200WithTheAvailabilitySummary", () => {
      mockReq.query.restaurantId = "restaurant101";
      const summary = {
        restaurantId: "restaurant101",
        totalItems: 3,
        availableItems: 2,
        unavailableItems: 1,
      };
      restaurantService.getMenuAvailability.mockReturnValue(summary);

      restaurantController.fetchMenuAvailability(mockReq, mockRes);

      expect(restaurantService.getMenuAvailability).toHaveBeenCalledWith(
        "restaurant101",
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(summary);
    });

    it("shouldReturn404WhenRestaurantNotFound", () => {
      mockReq.query.restaurantId = "nope";
      restaurantService.getMenuAvailability.mockImplementation(() => {
        throw new RestaurantNotFoundError("Restaurant with id nope not found");
      });

      restaurantController.fetchMenuAvailability(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Restaurant with id nope not found",
      });
    });

    it("shouldReturn500OnUnexpectedError", () => {
      restaurantService.getMenuAvailability.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      restaurantController.fetchMenuAvailability(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Unexpected error" });
    });
  });
});
