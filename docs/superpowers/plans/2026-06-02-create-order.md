# Create Order Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `POST /order` endpoint that resolves products from the catalog, validates the order, applies a two-layer discount model (per-product then per-category), and returns a JSON cost breakdown.

**Architecture:** Follows the existing layered pattern — `app.js` route → `controllers/orderController` → `services/orderService` → `domain/*`. `orderService` owns the calculation pipeline; `OrderItem` encapsulates per-line math; `Order` is a plain data container serialized to the response. Products carry a `category` getter so grouping/validation needs no `instanceof` chains.

**Tech Stack:** Node 22, Express 4, Jest. `crypto.randomUUID()` (native) for order ids. No new dependencies.

**Reference spec:** `docs/superpowers/specs/2026-06-02-create-order-design.md`

---

## File Structure

**Modify**
- `src/seedData/seedData.js` — fix `ElectronicsProduct` import + `createMedicineProduct`/`createElectronicsProduct` argument mismatches.
- `src/services/productService.test.js` — add electronics resolution test, strengthen medicine test.
- `src/domain/groceryProduct.js`, `electronicProduct.js`, `householdProduct.js`, `medicineProduct.js`, `foodProduct.js` — add a `category` getter.
- `src/app.js` — register `POST /order`.

**Create**
- `src/domain/orderItem.js` (+ test) — per-line math.
- `src/domain/order.js` (+ test) — response data container.
- `src/services/orderService.js` (currently empty stub) (+ test) — resolution, validation, pipeline.
- `src/controllers/orderController.js` (+ test) — HTTP glue.

---

## Task 1: Fix seed data so the suite is green

The working tree is red: `seedData.js` references `ElectronicsProduct` without importing it (crashes every suite that loads seed data), and the medicine/electronics factories pass arguments that don't line up with their constructors (so those products get `store`/`discount` in the wrong fields and never resolve).

**Files:**
- Modify: `src/seedData/seedData.js`
- Test: `src/services/productService.test.js`

- [ ] **Step 1: Add the failing/strengthened tests**

In `src/services/productService.test.js`, replace the existing `shouldFindAMedicineProductByItsStore` test with the block below (adds store + discount assertions and an electronics test):

```javascript
    it("shouldFindAMedicineProductByItsStore", () => {
      const product = productService.getProduct("medicine101", "store102");

      expect(product).toBeDefined();
      expect(product.productName).toBe("Pain Reliever");
      expect(product.store.outletId).toBe("store102");
      expect(product.discount).toBe(20);
    });

    it("shouldFindAnElectronicsProductByItsStore", () => {
      const product = productService.getProduct("electronic101", "store102");

      expect(product).toBeDefined();
      expect(product.productName).toBe("Wireless Earbuds");
      expect(product.store.outletId).toBe("store102");
      expect(product.discount).toBe(15);
    });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/services/productService.test.js`
Expected: FAIL — currently every suite errors with `ReferenceError: ElectronicsProduct is not defined`.

- [ ] **Step 3: Add the missing import**

In `src/seedData/seedData.js`, immediately after the `MedicineProduct` require (line 8), add:

```javascript
const ElectronicsProduct = require("../domain/electronicProduct");
```

- [ ] **Step 4: Fix `createMedicineProduct` arguments**

The constructor is `(productId, productName, mrp, sellingPrice, expiryDate, availableStock, store, discount)`. Replace the `createMedicineProduct` return with:

```javascript
    return new MedicineProduct(
      productId,
      productName,
      20.0, // mrp
      18.99, // sellingPrice
      expiryDate, // expiryDate
      50, // availableStock
      store, // store reference
      discount, // discount percentage
    );
```

- [ ] **Step 5: Fix `createElectronicsProduct` arguments**

The constructor is `(productId, productName, mrp, sellingPrice, expiryDate, availableStock, store, discount)`. Replace the `createElectronicsProduct` return with:

```javascript
    return new ElectronicsProduct(
      productId,
      productName,
      100.0, // mrp
      89.99, // sellingPrice
      null, // expiryDate (electronics do not expire)
      25, // availableStock
      store, // store reference
      discount, // discount percentage
    );
```

- [ ] **Step 6: Run the full suite**

Run: `npx jest`
Expected: All previously-existing suites PASS (the only remaining failure is `orderService.test.js` — "must contain at least one test" — which Task 5 resolves).

- [ ] **Step 7: Commit**

```bash
git add src/seedData/seedData.js src/services/productService.test.js
git commit -m "Fix seed data imports and category factory arguments"
```

---

## Task 2: Add `category` getter to product domain classes

The order pipeline groups and validates by category. Expose it as a getter on each product so the service never branches on `instanceof`.

**Files:**
- Modify: `src/domain/groceryProduct.js`, `src/domain/electronicProduct.js`, `src/domain/householdProduct.js`, `src/domain/medicineProduct.js`, `src/domain/foodProduct.js`
- Test: `src/domain/foodProduct.test.js` (existing), `src/domain/category.test.js` (new, covers all)

- [ ] **Step 1: Write the failing test**

Create `src/domain/category.test.js`:

```javascript
const SeedData = require("../seedData/seedData");

describe("product category getter", () => {
  it("shouldReportGroceryForGroceryProducts", () => {
    expect(SeedData.groceryProducts[0].category).toBe("grocery");
  });

  it("shouldReportElectronicsForElectronicsProducts", () => {
    expect(SeedData.electronicProducts[0].category).toBe("electronics");
  });

  it("shouldReportHouseholdForHouseholdProducts", () => {
    expect(SeedData.householdProducts[0].category).toBe("household");
  });

  it("shouldReportMedicineForMedicineProducts", () => {
    expect(SeedData.medicineProducts[0].category).toBe("medicine");
  });

  it("shouldReportFoodForFoodProducts", () => {
    expect(SeedData.foodProducts[0].category).toBe("food");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/domain/category.test.js`
Expected: FAIL — `category` is `undefined`.

- [ ] **Step 3: Add the getter to each class**

In `src/domain/groceryProduct.js`, inside the class body after the constructor closing brace, add:

```javascript
  get category() {
    return "grocery";
  }
```

In `src/domain/electronicProduct.js`:

```javascript
  get category() {
    return "electronics";
  }
```

In `src/domain/householdProduct.js`:

```javascript
  get category() {
    return "household";
  }
```

In `src/domain/medicineProduct.js`:

```javascript
  get category() {
    return "medicine";
  }
```

In `src/domain/foodProduct.js`:

```javascript
  get category() {
    return "food";
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/domain/category.test.js`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/domain/groceryProduct.js src/domain/electronicProduct.js src/domain/householdProduct.js src/domain/medicineProduct.js src/domain/foodProduct.js src/domain/category.test.js
git commit -m "Add category getter to product domain classes"
```

---

## Task 3: Create `OrderItem` domain (per-line math)

Encapsulates a single resolved line: gross line total, per-product discount, and net. Mirrors `CartItem` (holds `product` + `quantity`).

**Files:**
- Create: `src/domain/orderItem.js`
- Test: `src/domain/orderItem.test.js`

- [ ] **Step 1: Write the failing test**

Create `src/domain/orderItem.test.js`:

```javascript
const OrderItem = require("./orderItem");

describe("OrderItem", () => {
  const product = {
    productId: "electronic101",
    productName: "Wireless Earbuds",
    sellingPrice: 89.99,
    discount: 15,
    category: "electronics",
  };

  it("shouldComputeLineTotalAsQuantityTimesSellingPrice", () => {
    const item = new OrderItem(product, 7);
    expect(item.lineTotal).toBeCloseTo(629.93, 5);
  });

  it("shouldComputeProductDiscountFromTheProductDiscountPercent", () => {
    const item = new OrderItem(product, 7);
    expect(item.productDiscount).toBeCloseTo(94.4895, 5);
  });

  it("shouldComputeNetLineTotalAsLineTotalMinusProductDiscount", () => {
    const item = new OrderItem(product, 7);
    expect(item.netLineTotal).toBeCloseTo(535.4405, 5);
  });

  it("shouldTreatAMissingDiscountAsZero", () => {
    const item = new OrderItem({ sellingPrice: 10, category: "grocery" }, 3);
    expect(item.productDiscount).toBe(0);
    expect(item.netLineTotal).toBe(30);
  });

  it("shouldExposeTheProductCategory", () => {
    const item = new OrderItem(product, 1);
    expect(item.category).toBe("electronics");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/domain/orderItem.test.js`
Expected: FAIL — `Cannot find module './orderItem'`.

- [ ] **Step 3: Write the implementation**

Create `src/domain/orderItem.js`:

```javascript
class OrderItem {
  /**
   * @param {Product & { sellingPrice: number, discount?: number, category: string }} product
   * @param {number} quantity
   */
  constructor(product, quantity) {
    /** @type {object} */
    this.product = product;
    /** @type {number} */
    this.quantity = quantity;
  }

  get lineTotal() {
    return this.quantity * this.product.sellingPrice;
  }

  get productDiscount() {
    const rate = (this.product.discount || 0) / 100;
    return this.lineTotal * rate;
  }

  get netLineTotal() {
    return this.lineTotal - this.productDiscount;
  }

  get category() {
    return this.product.category;
  }
}

module.exports = OrderItem;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/domain/orderItem.test.js`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/domain/orderItem.js src/domain/orderItem.test.js
git commit -m "Add OrderItem domain with per-line discount math"
```

---

## Task 4: Create `Order` domain (response data container)

A plain holder for the finished order. All fields are own properties (strings, numbers, plain arrays) so `res.json()` serializes it directly. Mirrors `Cart`.

**Files:**
- Create: `src/domain/order.js`
- Test: `src/domain/order.test.js`

- [ ] **Step 1: Write the failing test**

Create `src/domain/order.test.js`:

```javascript
const Order = require("./order");

describe("Order", () => {
  it("shouldHoldTheOrderFieldsAndSerializeToJson", () => {
    const items = [{ productId: "electronic101", lineTotal: 629.93 }];
    const discounts = [{ category: "electronics", discount: 0 }];
    const order = new Order(
      "order_abc",
      "user101",
      "store102",
      items,
      discounts,
      535.44,
    );

    expect(order.orderId).toBe("order_abc");
    expect(order.customerId).toBe("user101");
    expect(order.storeId).toBe("store102");
    expect(order.items).toBe(items);
    expect(order.discounts).toBe(discounts);
    expect(order.finalPayableAmount).toBe(535.44);

    const serialized = JSON.parse(JSON.stringify(order));
    expect(serialized.finalPayableAmount).toBe(535.44);
    expect(serialized.items[0].lineTotal).toBe(629.93);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/domain/order.test.js`
Expected: FAIL — `Cannot find module './order'`.

- [ ] **Step 3: Write the implementation**

Create `src/domain/order.js`:

```javascript
class Order {
  /**
   * @param {string} orderId
   * @param {string} customerId
   * @param {string} storeId
   * @param {object[]} items
   * @param {object[]} discounts
   * @param {number} finalPayableAmount
   */
  constructor(orderId, customerId, storeId, items, discounts, finalPayableAmount) {
    /** @type {string} */
    this.orderId = orderId;
    /** @type {string} */
    this.customerId = customerId;
    /** @type {string} */
    this.storeId = storeId;
    /** @type {object[]} */
    this.items = items;
    /** @type {object[]} */
    this.discounts = discounts;
    /** @type {number} */
    this.finalPayableAmount = finalPayableAmount;
  }
}

module.exports = Order;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/domain/order.test.js`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/domain/order.js src/domain/order.test.js
git commit -m "Add Order domain response container"
```

---

## Task 5: Implement `orderService.createOrder`

The core. Resolves customer/store/products, validates, runs the two-layer discount pipeline, returns an `Order`. Fills the empty `src/services/orderService.js` stub.

**Pipeline (from spec §4):** per item `lineTotal = qty × sellingPrice`, `netLineTotal = lineTotal − lineTotal × discount%`; group `categoryTotal = Σ netLineTotal`; category rate `grocery 5% if >1000`, `electronics 10% if >2000`, else 0; `finalPayableAmount = Σ (categoryTotal − categoryTotal × rate)`. Electronics gate: electronics `categoryTotal ≥ 500`. Supported categories: grocery, electronics, household, medicine. Round money to 2 dp at output only.

**Seed values for reference:** grocery `product101/102/103` @ store101, price 9.99, discount 0. store102 has household `household101` (13.99, 10%) / `household102` (13.99, 0%), medicine `medicine101` (18.99, 20%) / `medicine102` (18.99, 15%), electronics `electronic101` (89.99, 15%) / `electronic102` (89.99, 0%). Grocery lives only on store101; household/medicine/electronics only on store102.

**Files:**
- Create/replace: `src/services/orderService.js` (currently empty)
- Test: `src/services/orderService.test.js` (currently empty)

- [ ] **Step 1: Write the failing tests**

Replace the contents of `src/services/orderService.test.js` with:

```javascript
const orderService = require("./orderService");
const productService = require("./productService");
const NotFoundError = require("../domain/errors/notFoundError");
const ValidationError = require("../domain/errors/validationError");

describe("orderService.createOrder", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("happy paths", () => {
    it("shouldApplyGroceryCategoryDiscountAboveOneThousand", () => {
      const order = orderService.createOrder({
        customerId: "user101",
        storeId: "store101",
        items: [{ productId: "product101", quantity: 200 }],
      });

      expect(order.customerId).toBe("user101");
      expect(order.storeId).toBe("store101");
      expect(order.items[0]).toMatchObject({
        productId: "product101",
        category: "grocery",
        quantity: 200,
        price: 9.99,
        lineTotal: 1998,
        productDiscount: 0,
        netLineTotal: 1998,
      });
      expect(order.discounts[0]).toMatchObject({
        category: "grocery",
        categoryTotal: 1998,
        discountRate: 0.05,
        discount: 99.9,
        netCategoryTotal: 1898.1,
      });
      expect(order.finalPayableAmount).toBe(1898.1);
    });

    it("shouldNotApplyGroceryDiscountAtOrBelowOneThousand", () => {
      const order = orderService.createOrder({
        customerId: "user101",
        storeId: "store101",
        items: [{ productId: "product101", quantity: 100 }],
      });

      expect(order.discounts[0].discountRate).toBe(0);
      expect(order.finalPayableAmount).toBe(999);
    });

    it("shouldApplyPerProductDiscountThenPassElectronicsGate", () => {
      const order = orderService.createOrder({
        customerId: "user101",
        storeId: "store102",
        items: [{ productId: "electronic101", quantity: 7 }],
      });

      expect(order.items[0]).toMatchObject({
        category: "electronics",
        lineTotal: 629.93,
        productDiscount: 94.49,
        netLineTotal: 535.44,
      });
      expect(order.discounts[0].discountRate).toBe(0);
      expect(order.finalPayableAmount).toBe(535.44);
    });

    it("shouldApplyElectronicsCategoryDiscountAboveTwoThousand", () => {
      const order = orderService.createOrder({
        customerId: "user101",
        storeId: "store102",
        items: [{ productId: "electronic102", quantity: 30 }],
      });

      expect(order.discounts[0]).toMatchObject({
        category: "electronics",
        categoryTotal: 2699.7,
        discountRate: 0.1,
        discount: 269.97,
        netCategoryTotal: 2429.73,
      });
      expect(order.finalPayableAmount).toBe(2429.73);
    });

    it("shouldSumMultipleCategoriesWithNoCategoryDiscount", () => {
      const order = orderService.createOrder({
        customerId: "user101",
        storeId: "store102",
        items: [
          { productId: "household101", quantity: 2 },
          { productId: "medicine101", quantity: 1 },
        ],
      });

      const categories = order.discounts.map((d) => d.category).sort();
      expect(categories).toEqual(["household", "medicine"]);
      expect(order.finalPayableAmount).toBe(40.37);
    });

    it("shouldGenerateAUniqueOrderIdEachTime", () => {
      const request = {
        customerId: "user101",
        storeId: "store101",
        items: [{ productId: "product101", quantity: 1 }],
      };
      const first = orderService.createOrder(request);
      const second = orderService.createOrder(request);

      expect(first.orderId).toMatch(/^order_/);
      expect(first.orderId).not.toBe(second.orderId);
    });
  });

  describe("boundaries (synthetic products)", () => {
    function stubElectronics(sellingPrice) {
      jest.spyOn(productService, "getProduct").mockReturnValue({
        productId: "synthetic",
        productName: "Synthetic Electronics",
        sellingPrice,
        discount: 0,
        category: "electronics",
      });
    }

    it("shouldAcceptElectronicsExactlyAtFiveHundred", () => {
      stubElectronics(250); // 250 x 2 = 500
      const order = orderService.createOrder({
        customerId: "user101",
        storeId: "store102",
        items: [{ productId: "synthetic", quantity: 2 }],
      });
      expect(order.finalPayableAmount).toBe(500);
    });

    it("shouldNotDiscountElectronicsExactlyAtTwoThousand", () => {
      stubElectronics(1000); // 1000 x 2 = 2000, not > 2000
      const order = orderService.createOrder({
        customerId: "user101",
        storeId: "store102",
        items: [{ productId: "synthetic", quantity: 2 }],
      });
      expect(order.discounts[0].discountRate).toBe(0);
      expect(order.finalPayableAmount).toBe(2000);
    });
  });

  describe("validation", () => {
    it("shouldRejectWhenCustomerDoesNotExist", () => {
      expect(() =>
        orderService.createOrder({
          customerId: "ghost",
          storeId: "store101",
          items: [{ productId: "product101", quantity: 1 }],
        }),
      ).toThrow(NotFoundError);
    });

    it("shouldRejectWhenStoreDoesNotExist", () => {
      expect(() =>
        orderService.createOrder({
          customerId: "user101",
          storeId: "ghost",
          items: [{ productId: "product101", quantity: 1 }],
        }),
      ).toThrow(NotFoundError);
    });

    it("shouldRejectWhenItemsIsEmpty", () => {
      expect(() =>
        orderService.createOrder({
          customerId: "user101",
          storeId: "store101",
          items: [],
        }),
      ).toThrow(ValidationError);
    });

    it.each([0, -2, 1.5])(
      "shouldRejectInvalidQuantity %p",
      (quantity) => {
        expect(() =>
          orderService.createOrder({
            customerId: "user101",
            storeId: "store101",
            items: [{ productId: "product101", quantity }],
          }),
        ).toThrow(ValidationError);
      },
    );

    it("shouldRejectWhenProductIsNotInTheStore", () => {
      expect(() =>
        orderService.createOrder({
          customerId: "user101",
          storeId: "store101",
          items: [{ productId: "ghost", quantity: 1 }],
        }),
      ).toThrow(NotFoundError);
    });

    it("shouldRejectAnUnsupportedCategory", () => {
      jest.spyOn(productService, "getProduct").mockReturnValue({
        productId: "food101",
        productName: "Margherita Pizza",
        sellingPrice: 10.99,
        discount: 0,
        category: "food",
      });
      expect(() =>
        orderService.createOrder({
          customerId: "user101",
          storeId: "store102",
          items: [{ productId: "food101", quantity: 1 }],
        }),
      ).toThrow(ValidationError);
    });

    it("shouldRejectElectronicsBelowFiveHundred", () => {
      expect(() =>
        orderService.createOrder({
          customerId: "user101",
          storeId: "store102",
          items: [{ productId: "electronic101", quantity: 1 }],
        }),
      ).toThrow(ValidationError);
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/services/orderService.test.js`
Expected: FAIL — `orderService.createOrder is not a function` (stub is empty).

- [ ] **Step 3: Write the implementation**

Replace the contents of `src/services/orderService.js` with:

```javascript
const crypto = require("crypto");
const userService = require("./userService");
const storeService = require("./storeService");
const productService = require("./productService");
const NotFoundError = require("../domain/errors/notFoundError");
const ValidationError = require("../domain/errors/validationError");
const OrderItem = require("../domain/orderItem");
const Order = require("../domain/order");

const SUPPORTED_CATEGORIES = new Set([
  "grocery",
  "electronics",
  "household",
  "medicine",
]);

const CATEGORY_DISCOUNTS = {
  grocery: { threshold: 1000, rate: 0.05 },
  electronics: { threshold: 2000, rate: 0.1 },
};

const ELECTRONICS_MINIMUM = 500;

function round(value) {
  return Math.round(value * 100) / 100;
}

const orderService = {
  createOrder(request) {
    const user = this.requireUser(request.customerId);
    const store = this.requireStore(request.storeId);
    const orderItems = this.buildOrderItems(request.items, store);

    const categoryTotals = this.groupCategoryTotals(orderItems);
    this.validateElectronicsMinimum(categoryTotals);
    const discounts = this.buildCategoryDiscounts(categoryTotals);

    const finalPayableAmount = discounts.reduce(
      (sum, discount) => sum + discount.netCategoryTotal,
      0,
    );

    return new Order(
      "order_" + crypto.randomUUID(),
      user.userId,
      store.outletId,
      orderItems.map((item) => this.toResponseItem(item)),
      discounts.map((discount) => this.toResponseDiscount(discount)),
      round(finalPayableAmount),
    );
  },

  requireUser(customerId) {
    const user = userService.fetchUserById(customerId);
    if (!user) {
      throw new NotFoundError(`User '${customerId}' not found`);
    }
    return user;
  },

  requireStore(storeId) {
    const store = storeService.fetchStoreById(storeId);
    if (!store) {
      throw new NotFoundError(`Store '${storeId}' not found`);
    }
    return store;
  },

  buildOrderItems(items, store) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError("items must be a non-empty array");
    }
    return items.map((item) => {
      const quantity = this.requirePositiveInteger(item.quantity);
      const product = productService.getProduct(item.productId, store.outletId);
      if (!product) {
        throw new NotFoundError(
          `Product '${item.productId}' not found in outlet '${store.outletId}'`,
        );
      }
      if (!SUPPORTED_CATEGORIES.has(product.category)) {
        throw new ValidationError(
          `category '${product.category}' is not supported`,
        );
      }
      return new OrderItem(product, quantity);
    });
  },

  requirePositiveInteger(quantity) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ValidationError("quantity must be a positive integer");
    }
    return quantity;
  },

  groupCategoryTotals(orderItems) {
    const totals = new Map();
    orderItems.forEach((item) => {
      const current = totals.get(item.category) || 0;
      totals.set(item.category, current + item.netLineTotal);
    });
    return totals;
  },

  validateElectronicsMinimum(categoryTotals) {
    const electronicsTotal = categoryTotals.get("electronics");
    if (electronicsTotal !== undefined && electronicsTotal < ELECTRONICS_MINIMUM) {
      throw new ValidationError(
        `electronics order value must be at least ${ELECTRONICS_MINIMUM}`,
      );
    }
  },

  buildCategoryDiscounts(categoryTotals) {
    const discounts = [];
    categoryTotals.forEach((categoryTotal, category) => {
      const rule = CATEGORY_DISCOUNTS[category];
      const discountRate =
        rule && categoryTotal > rule.threshold ? rule.rate : 0;
      const discount = categoryTotal * discountRate;
      discounts.push({
        category,
        categoryTotal,
        discountRate,
        discount,
        netCategoryTotal: categoryTotal - discount,
      });
    });
    return discounts;
  },

  toResponseItem(item) {
    return {
      productId: item.product.productId,
      productName: item.product.productName,
      category: item.category,
      quantity: item.quantity,
      price: item.product.sellingPrice,
      lineTotal: round(item.lineTotal),
      productDiscount: round(item.productDiscount),
      netLineTotal: round(item.netLineTotal),
    };
  },

  toResponseDiscount(discount) {
    return {
      category: discount.category,
      categoryTotal: round(discount.categoryTotal),
      discountRate: discount.discountRate,
      discount: round(discount.discount),
      netCategoryTotal: round(discount.netCategoryTotal),
    };
  },
};

module.exports = orderService;
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/services/orderService.test.js`
Expected: PASS (all describe blocks green).

- [ ] **Step 5: Commit**

```bash
git add src/services/orderService.js src/services/orderService.test.js
git commit -m "Implement order pricing pipeline in orderService"
```

---

## Task 6: Create `orderController`

Thin HTTP glue mirroring `cartController`: call the service, return `201` with the order, route thrown errors through `sendError`.

**Files:**
- Create: `src/controllers/orderController.js`
- Test: `src/controllers/orderController.test.js`

- [ ] **Step 1: Write the failing test**

Create `src/controllers/orderController.test.js`:

```javascript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/controllers/orderController.test.js`
Expected: FAIL — `Cannot find module './orderController'`.

- [ ] **Step 3: Write the implementation**

Create `src/controllers/orderController.js`:

```javascript
const orderService = require("../services/orderService");
const sendError = require("./sendError");

const orderController = {
  createOrder(req, res) {
    try {
      const order = orderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      sendError(res, error);
    }
  },
};

module.exports = orderController;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/controllers/orderController.test.js`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/controllers/orderController.js src/controllers/orderController.test.js
git commit -m "Add orderController for POST /order"
```

---

## Task 7: Wire `POST /order` and smoke-test the running app

Register the route in `app.js` (the repo has no app-level test harness, so verify with a live request).

**Files:**
- Modify: `src/app.js`

- [ ] **Step 1: Require the controller**

In `src/app.js`, after the `inventoryController` require (line 3), add:

```javascript
const orderController = require("./controllers/orderController");
```

- [ ] **Step 2: Register the route**

In `src/app.js`, after the `POST /cart/product` route block (ends at line 23), add:

```javascript
app.post("/order", (req, res) => {
  console.log("POST /order route hit");
  orderController.createOrder(req, res);
});
```

- [ ] **Step 3: Run the full test suite**

Run: `npx jest`
Expected: All suites PASS (no remaining failures).

- [ ] **Step 4: Smoke-test the endpoint**

Start the server in the background and exercise the happy path and the electronics-gate rejection:

```bash
PORT=8080 node src/app.js &
SERVER_PID=$!
sleep 1

echo "--- happy path (expect 201, finalPayableAmount 535.44) ---"
curl -s -w "\nHTTP %{http_code}\n" -X POST http://localhost:8080/order \
  -H "Content-Type: application/json" \
  -d '{"customerId":"user101","storeId":"store102","items":[{"productId":"electronic101","quantity":7}]}'

echo "--- electronics below 500 (expect 400) ---"
curl -s -w "\nHTTP %{http_code}\n" -X POST http://localhost:8080/order \
  -H "Content-Type: application/json" \
  -d '{"customerId":"user101","storeId":"store102","items":[{"productId":"electronic101","quantity":1}]}'

kill $SERVER_PID
```

Expected: first call returns `HTTP 201` with `"finalPayableAmount":535.44`; second returns `HTTP 400` with `"error":"electronics order value must be at least 500"`.

- [ ] **Step 5: Commit**

```bash
git add src/app.js
git commit -m "Wire POST /order route"
```

---

## Self-Review Notes

- **Spec coverage:** order creation + unique id (Task 5/7), catalog resolution (Task 5), supported-category validation (Task 5), electronics ≥500 gate (Task 5), grocery/electronics category discounts + per-product discount layer (Task 3/5), line/category math + final payable (Task 5), JSON response shape (Task 5/6), rounding to 2 dp (Task 5). Bundled seed fixes (Task 1) and `category` discriminator (Task 2) are prerequisites.
- **Boundary `>` vs `≥`:** category thresholds use strict `>` (Task 5 grocery-at-1000 and electronics-at-2000 tests); the electronics gate uses `<` for rejection so exactly 500 is accepted (Task 5 boundary test).
- **Naming consistency:** `createOrder`, `OrderItem`, `Order`, `toResponseItem`, `toResponseDiscount`, `groupCategoryTotals`, `buildCategoryDiscounts` are used identically across service, controller, and tests.
