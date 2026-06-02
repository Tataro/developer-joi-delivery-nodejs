# Create Order — Design Spec

**Date:** 2026-06-02
**Status:** Approved (design), pending implementation
**Feature:** Customers place orders spanning grocery, electronics, household, and
medicine products. The system resolves products from the catalog, validates the
order, computes line/category totals, applies a two-layer discount model, and
returns a JSON breakdown.

---

## 1. Scope & Assumptions

- Products always have sufficient stock (per the feature assumption). No stock
  decrement or availability check beyond catalog resolution.
- Orders are **not persisted** — each order is computed, assigned a unique id,
  and returned. There is no read-back/list endpoint (YAGNI).
- Catalog-driven: the request references products by `productId` (scoped to a
  `storeId`); the server derives **category, price, and per-product discount**
  from the seeded catalog. The client never supplies price or category.
- Money values in the response are rounded to **2 decimal places**.
- "Above N" means **strictly greater than N** (exactly 1000 / 2000 → no
  category discount).
- Price used for all line math is `sellingPrice` (not `mrp`).

---

## 2. API Contract

### Request

```
POST /order
Content-Type: application/json

{
  "customerId": "user101",
  "storeId": "store102",
  "items": [
    { "productId": "electronic101", "quantity": 7 }
  ]
}
```

### Success Response — `201 Created`

```json
{
  "orderId": "order_<uuid>",
  "customerId": "user101",
  "storeId": "store102",
  "items": [
    {
      "productId": "electronic101",
      "productName": "Wireless Earbuds",
      "category": "electronics",
      "quantity": 7,
      "price": 89.99,
      "lineTotal": 629.93,
      "productDiscount": 94.49,
      "netLineTotal": 535.44
    }
  ],
  "discounts": [
    {
      "category": "electronics",
      "categoryTotal": 535.44,
      "discountRate": 0,
      "discount": 0,
      "netCategoryTotal": 535.44
    }
  ],
  "finalPayableAmount": 535.44
}
```

(Electronics product-discounted total 535.44 ≥ 500 → passes the gate;
535.44 ≤ 2000 → no category discount.)

- `orderId`: `"order_"` + `crypto.randomUUID()` (native in Node 22) — guarantees
  uniqueness.
- `items[]`: one entry per request line, enriched with catalog-derived fields.
- `discounts[]`: one entry per category present in the order (the category-level
  discount layer). Per-product discounts are surfaced per line via
  `productDiscount` / `netLineTotal`.

### Error Response

Uses the existing `sendError` mapping: `{ "error": "<message>" }` with the
status code carried by the thrown error.

---

## 3. Validation Rules (fail fast, in order)

| # | Check | Failure | Status |
|---|-------|---------|--------|
| 1 | `customerId` resolves via `userService.fetchUserById` | `NotFoundError("User '<id>' not found")` | 404 |
| 2 | `storeId` resolves via `storeService.fetchStoreById` | `NotFoundError("Store '<id>' not found")` | 404 |
| 3 | `items` is a non-empty array | `ValidationError` | 400 |
| 4 | each `quantity` is a positive integer | `ValidationError("quantity must be a positive integer")` | 400 |
| 5 | each `productId` resolves via `productService.getProduct(productId, storeId)` | `NotFoundError("Product '<id>' not found in outlet '<storeId>'")` | 404 |
| 6 | each product's category ∈ {grocery, electronics, household, medicine} | `ValidationError("category '<cat>' is not supported")` | 400 |
| 7 | electronics category total ≥ 500 (only when electronics present) | `ValidationError("electronics order value must be at least 500")` | 400 |

- Rule 7 evaluates the **product-discounted** electronics `categoryTotal`
  (after per-product discount, before category discount). It is a gate on order
  validity, checked **before** category discounts are applied.
- `food` products resolve in the catalog but are **not** a supported order
  category → rejected by rule 6.

---

## 4. Calculation Pipeline (core)

Two discount layers: **per-product first, then category.**

```
For each item:
  lineTotal     = quantity × product.sellingPrice
  lineDiscount  = lineTotal × (product.discount / 100)      // per-product layer
  netLineTotal  = lineTotal − lineDiscount

Group netLineTotal by category:
  categoryTotal = Σ netLineTotal                            // product-discounted

Category discount layer (rate applied to categoryTotal):
  grocery:      5%  if categoryTotal > 1000  else 0
  electronics: 10%  if categoryTotal > 2000  else 0
  household:    0
  medicine:     0
  categoryDiscount   = categoryTotal × categoryRate
  netCategoryTotal   = categoryTotal − categoryDiscount

finalPayableAmount = Σ netCategoryTotal
```

- Category thresholds (1000 / 2000) and the electronics ≥500 gate are all
  evaluated against the **product-discounted** `categoryTotal`.
- Rounding to 2 decimals is applied to response values; internal arithmetic uses
  full precision, rounding only at output to avoid compounding rounding error.

### Worked example

Order: `electronic101` (price 89.99, product discount 15%) × 6.

```
lineTotal     = 6 × 89.99            = 539.94
lineDiscount  = 539.94 × 0.15        = 80.991
netLineTotal  = 539.94 − 80.991      = 458.949
categoryTotal (electronics)          = 458.949
electronics ≥ 500 gate: 458.949 < 500 → REJECT (ValidationError)
```

To pass the gate the electronics product-discounted total must reach 500
(e.g. a larger quantity or additional electronics lines). If
`categoryTotal` were e.g. 2100, electronics rate 10% applies → discount 210,
netCategoryTotal 1890.

---

## 5. Components & Files

### New

- `src/domain/order.js` — holds `orderId`, `customerId`, `storeId`, computed
  `items`, `discounts`, `finalPayableAmount`. Mirrors `Cart` conventions; keeps
  `orderService` focused on the pipeline.
- `src/domain/orderItem.js` — per-line computed values (`product`, `quantity`,
  `lineTotal`, `productDiscount`, `netLineTotal`). Mirrors `CartItem`.
- `src/controllers/orderController.js` — `createOrder(req, res)`: try/catch →
  `res.status(201).json(result)` → `sendError`. Same shape as `cartController`.
- `src/controllers/orderController.test.js`
- `src/services/orderService.js` (currently an empty stub) — `createOrder(request)`
  implementing resolution, validation, and the pipeline.
- `src/services/orderService.test.js` (currently an empty stub).

### Modified

- `src/app.js` — register `POST /order` → `orderController.createOrder`.
- `src/seedData/seedData.js` — **bug fix:** add the missing
  `const ElectronicsProduct = require("../domain/electronicProduct")` import.
  Currently `createElectronicsProduct` throws `ReferenceError`, which reds-out
  every suite that loads seed data.
- Category domain classes — add a `category` discriminator so the pipeline can
  group/validate without `instanceof` chains. Cleanest: a `get category()`
  getter on each product class (`GroceryProduct` → `"grocery"`,
  `ElectronicsProduct` → `"electronics"`, `HouseholdProduct` → `"household"`,
  `MedicineProduct` → `"medicine"`, `FoodProduct` → `"food"`).

---

## 6. Design Decisions (judgment calls)

- **Category derived from product type**, not a client field — consistent with
  catalog lookup. Implemented as a `category` getter on each domain class.
- **Customer & store existence validated** up front via the existing services,
  matching `cartService.requireUser` precedent (404 on miss).
- **Validation order:** electronics-minimum gate is checked *after* line/category
  totals are computed but *before* category discounts — it gates order validity,
  not the discounted payable.
- **No persistence / no order store** — nothing reads orders back; uniqueness is
  satisfied by `crypto.randomUUID()` alone.

---

## 7. Testing Strategy

TDD, Jest, co-located `*.test.js`. Coverage:

**orderService**
- resolves catalog products, computes line/category totals, final payable (happy
  path, single & multi-category).
- per-product discount applied per line; category discount applied on top
  (grocery >1000 → 5%; electronics >2000 → 10%; boundary at exactly 1000/2000 →
  no discount).
- household & medicine: no discount, included in totals.
- rejects: unknown customer (404), unknown store (404), empty items (400),
  non-positive / non-integer quantity (400), unknown product in store (404),
  unsupported category e.g. food (400), electronics total < 500 (400).
- electronics total exactly 500 → accepted (≥).
- `orderId` present and unique across calls.
- response monetary values rounded to 2 decimals.

**orderController**
- success → 201 with body; thrown errors → `sendError` status/message.

**seedData** — loads without throwing after the `ElectronicsProduct` import fix.
