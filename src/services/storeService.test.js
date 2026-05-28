const storeService = require("./storeService");

describe("storeService", () => {
  describe("fetchStoreById", () => {
    it("shouldReturnTheStoreWhenItExists", () => {
      const store = storeService.fetchStoreById("store101");

      expect(store).toBeDefined();
      expect(store.outletId).toBe("store101");
      expect(store.name).toBe("Fresh Picks");
    });

    it("shouldReturnNullWhenTheStoreDoesNotExist", () => {
      expect(storeService.fetchStoreById("ghost")).toBeNull();
    });
  });
});
