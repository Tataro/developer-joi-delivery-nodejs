# JOI Delivery — Bug Fix & Feature Completion Design

**Date:** 2026-05-28  
**Status:** Approved  
**Approach:** Option A — fix-then-build in independently-tested slices

---

## Context

JOI Delivery is an in-memory Node.js/Express REST API with 3 endpoints:

- `POST /cart/product` — add product to cart
- `GET /cart/view?userId=` — view cart
- `GET /inventory/health?storeId=` — inventory health (stub)

The codebase has a complete domain class hierarchy (`Product → GroceryProduct / FoodProduct`, `Outlet → GroceryStore / Restaurant`, `Cart`, `User`) and a seed data layer, but contains 6 bugs and 7 unbuilt stubs. All fixes use the existing patterns: class inheritance, static seed data, service objects, try/catch in controllers.

**Error handling strategy:** Custom error classes thrown from services, caught in controllers, mapped to HTTP status codes. Three error types: `ValidationError` (400), `NotFoundError` (404), `InsufficientStockError` (409).

---

## Slice 1 — Fix broken imports + implement `FoodProduct` + `Restaurant`

**Bugs fixed:** B1 (`foodProduct.js`), B2 (`restaurant.js`)  
**Stubs built:** S1 (`FoodProduct` constructor), S2 (`Restaurant` constructor)

### Problem
Both `foodProduct.js` and `restaurant.js` use destructured imports (`const { Product } = require(...)`) on files that export the class directly. This makes the base class `undefined`, so any instantiation crashes.

### Fix
Change to direct imports:
```js
// foodProduct.js
const Product = require("./product");

// restaurant.js
const Outlet = require("./outlet");
```

### FoodProduct constructor
`FoodProduct` needs fields parallel to `GroceryProduct` but restaurant-specific:
```
productId, productName, mrp (from Product)
sellingPrice, isVeg (boolean), prepTimeMins, availableStock, restaurant, discount = 0
```

### Restaurant constructor
`Restaurant` needs a `menu` set (parallel to `GroceryStore.inventory`):
```
name, description, outletId (from Outlet)
menu = new Set()
```

### Tests
- `foodProduct.test.js`: instantiates `FoodProduct`, asserts all fields
- `restaurant.test.js`: instantiates `Restaurant`, asserts `menu` is an empty Set

**Coverage target:** 100% statements and branches on both files.

---

## Slice 2 — Fix seed data (user102, cart factory, food/restaurant data)

**Bugs fixed:** B3 (`createCartForUser` hardcodes user101), B4 (user102 missing from `SeedData.users`)  
**Stubs built:** S7 (food products and restaurant seed data)

### Problem
`createCartForUser` ignores its arguments and hardcodes `SeedData.user101` and `SeedData.store101`. This means user102's cart has the wrong user embedded. Also, `SeedData.users` only contains user101, so `userService.fetchUserById("user102")` always returns null.

### Fix — cart factory
`createCartForUser` should accept `(cartId, user)` (the cart ID and the pre-built user object), not userId/firstName/lastName. The factory is only called in the static initialiser block where the user is already available:
```js
static createCartForUser(cartId, user) {
  return new Cart(cartId, null, user);
}
// outlet is null — the cart is not pre-assigned to a store
```

### Fix — users array
```js
SeedData.user102 = SeedData.createUser("user102", "Rachel", "Zane");
SeedData.users = [SeedData.user101, SeedData.user102];
```

### Fix — cartForUsers
Update call sites to pass the user object:
```js
SeedData.cartForUsers = new Map([
  ["user101", SeedData.createCartForUser("cart101", SeedData.user101)],
  ["user102", SeedData.createCartForUser("cart102", SeedData.user102)],
]);
```

### Add food/restaurant seed data
Add factory methods and seed instances:
- `createRestaurant(name, outletId)` → `new Restaurant(name, "description", outletId)`
- `createFoodProduct(productName, productId, mrp, sellingPrice, isVeg, prepTimeMins, availableStock, restaurant)`
- `SeedData.rest101` — "Tasty Bites", id "rest101"
- `SeedData.foodProducts` — 3 food items (e.g. Margherita Pizza, Veg Burger, Pasta Alfredo) referencing rest101

### Tests
- `seedData.test.js`: assert user101/user102 fields, cart101 user is user101 (not null), cart102 user is user102, foodProducts array length, food product fields

**Coverage target:** >90% on `seedData.js`.

---

## Slice 3 — Error classes + cart null-safety

**Bugs fixed:** B5 (no error handling in controllers), B6 (`fetchCartForUser` returns undefined)

### Error classes
Three files in `src/domain/errors/`:
```js
// validationError.js
class ValidationError extends Error {
  constructor(message) { super(message); this.name = "ValidationError"; this.statusCode = 400; }
}
// notFoundError.js — statusCode = 404
// insufficientStockError.js — statusCode = 409
```

### cartService validation
`addProductToCartForUser(req)`:
1. Validate `req`, `req.userId`, `req.productId`, `req.outletId` present → `ValidationError`
2. Fetch user via `userService.fetchUserById` — if null → `NotFoundError("User not found")`
3. Fetch cart via `fetchCartForUser(user)` — if undefined → `NotFoundError("Cart not found")`
4. Fetch product via `productService.getProduct` — if undefined → `NotFoundError("Product not found")`

`getCartForUser(userId)`:
1. Validate `userId` present → `ValidationError`
2. Fetch user — if null → `NotFoundError`
3. Fetch cart — if undefined → `NotFoundError`

### Controller error handling
Both `addProductToCart` and `viewCart` wrap their calls in `try/catch`:
```js
try {
  const result = cartService.addProductToCartForUser(req.body);
  res.status(200).json(result);
} catch (error) {
  res.status(error.statusCode || 500).json({ error: error.message });
}
```

### Tests
- `cartService.test.js`: all validation paths, user-not-found, cart-not-found, product-not-found, happy path
- `cartController.test.js`: extend existing tests with 400/404/500 error paths

**Coverage target:** >90% statements and branches on `cartService.js`, `cartController.js`, all three error classes.

---

## Slice 4 — Inventory service + wire controller + fix placeholder test

**Stubs built:** S3 (inventoryController logic), S4 (inventoryService), S6 (placeholder test assertions)

### inventoryService.getStoreInventoryHealth(storeId)
1. Validate `storeId` present → `ValidationError`
2. Find store in `SeedData.stores` array → `NotFoundError` if missing
3. Filter `SeedData.groceryProducts` where `product.store.outletId === storeId`
4. Categorise: `outOfStock` (availableStock === 0), `lowStock` (availableStock > 0 && <= threshold), `healthy` (rest)
5. Return `{ storeId, storeName, totalProducts, healthyCount, lowStockCount, outOfStockCount }`

Note: `SeedData.stores` must be added: `SeedData.stores = [SeedData.store101, SeedData.store102]`.

### inventoryController update
```js
const inventoryService = require("../services/inventoryService");

fetchStoreInventoryHealth(req, res) {
  try {
    const result = inventoryService.getStoreInventoryHealth(req.query.storeId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}
```

### Fix placeholder test
`inventoryController.test.js` currently has no assertions. Replace with:
- mock `inventoryService`, assert 200 + response shape on success
- assert 400 when storeId missing, 404 when store not found, 500 on unexpected error

### Tests
- `inventoryService.test.js`: validation, not-found, healthy/lowStock/outOfStock categorisation
- `inventoryController.test.js`: full replacement of placeholder test

**Coverage target:** 100% on `inventoryService.js`, >90% on `inventoryController.js`.

---

## Slice 5 — productService food search + cart quantity + stock reservation

**Stubs built:** S5 (productService), S8 (cart quantity/stock)

### productService update
`getProduct(productId, outletId)` currently only searches `SeedData.groceryProducts`. Add a fallback to `SeedData.foodProducts`:
```js
const grocery = SeedData.groceryProducts.find(p => p.productId === productId && p.store?.outletId === outletId);
if (grocery) return grocery;
return SeedData.foodProducts.find(p => p.productId === productId && p.restaurant?.outletId === outletId);
```

### Cart quantity + stock reservation
`addProductToCartForUser`:
- Accept optional `quantity` field (default 1 if omitted)
- Validate: must be a positive integer → `ValidationError`
- Check `quantity <= product.availableStock` → `InsufficientStockError` if not
- Decrement `product.availableStock -= quantity`
- Merge into cart as a line item: `{ product, quantity }`. If the same product is already in the cart, increment its quantity rather than pushing a duplicate.
- Return shape: `{ cart, product, quantity: lineItem.quantity, sellingPrice: product.sellingPrice }`

Cart `products` array changes from `Product[]` to `{ product: Product, quantity: number }[]`. This is a breaking change to the response shape — update README accordingly.

### Tests
- `productService.test.js`: grocery found, food found, not found (returns undefined)
- `cartService.test.js`: extend with quantity validation (missing, zero, negative, non-integer), stock insufficient, stock reservation (availableStock decremented), line-item merge (same product added twice accumulates quantity)

**Coverage target:** >90% on `productService.js`, 100% on `cartService.js`.

---

## File Map

| File | Action |
|------|--------|
| `src/domain/foodProduct.js` | Rewrite (fix import + add constructor) |
| `src/domain/restaurant.js` | Rewrite (fix import + add constructor) |
| `src/domain/errors/validationError.js` | Create |
| `src/domain/errors/notFoundError.js` | Create |
| `src/domain/errors/insufficientStockError.js` | Create |
| `src/seedData/seedData.js` | Edit (fix cart factory, add user102, add food data, add stores array) |
| `src/services/cartService.js` | Rewrite (validation + error throwing + quantity + stock) |
| `src/services/inventoryService.js` | Create |
| `src/services/productService.js` | Edit (add food product search) |
| `src/controllers/cartController.js` | Edit (add try/catch) |
| `src/controllers/inventoryController.js` | Edit (wire service + try/catch) |
| `src/controllers/cartController.test.js` | Edit (add error path tests) |
| `src/controllers/inventoryController.test.js` | Rewrite (replace placeholder) |
| `src/domain/foodProduct.test.js` | Create |
| `src/domain/restaurant.test.js` | Create |
| `src/seedData/seedData.test.js` | Create |
| `src/services/cartService.test.js` | Create |
| `src/services/inventoryService.test.js` | Create |
| `src/services/productService.test.js` | Create |

---

## Success Criteria

- All 3 endpoints return correct responses for happy and error paths
- `npm test -- --coverage` shows >90% branch AND statement coverage on every touched file
- No crashes on null/missing inputs — all errors return structured JSON with appropriate HTTP status codes
- `FoodProduct` and `Restaurant` are instantiable and used in seed data
- `GET /inventory/health?storeId=store101` returns categorised stock counts
- Cart supports quantity, prevents overselling, and merges duplicate line items
