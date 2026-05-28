# Welcome to JOI Delivery

JOI Delivery is built for real life. For the young professional who gets home late and doesn't have the energy to cook. For the student with an exam tomorrow and an empty fridge tonight. These aren't exceptions — they're everyday moments. That's why JOI Delivery brings food and groceries to your door, fast, fresh, and right when you need them.

Customers struggle with:

- Cluttered browsing experiences that don't understand their preferences.
- Limited customization when ordering meals or groceries.
- Unclear order status or delivery timelines.
- Poor payment experience, or failed checkouts.
- Lack of timely feedback channels to report a bad experience or appreciate a good one.

JOI Delivery was built not just as another delivery app, but as a thoughtful, technology-first platform that reimagines how essentials reach customers in the most seamless way.

# Introducing JOI Delivery

JOI Delivery, launched in 2024, is a hyperlocal delivery app designed to bring food and groceries to your doorstep in under 45 minutes. With the tagline "Speed meets convenience," it connects customers to nearby restaurants and stores through a seamless digital experience. The app solves the hassle of long wait times and limited local options by offering real-time tracking, instant order updates, and a wide network of trusted vendors.

## Business Goals

- Differentiated Value Proposition & Niche Dominance
- Deliver Unmatched Customer Experience & Loyalty
- Superior Operational Efficiency & Cost Advantage
- Robust & Engaged Partner Ecosystem

## Why they need Thoughtworks help

As JOI Delivery continues to grow and serve more neighborhoods, we're scaling our platform to handle increasing demand, enhance user experience, and support smarter delivery logistics. They're looking for passionate developers to help us build robust, efficient, and scalable solutions that power everything from order placement to real-time tracking.
Your expertise will directly impact how quickly and reliably customers receive their essentials—and how smoothly local vendors and delivery partners operate within our ecosystem.

### Data Layer

- **`SeedData`** - Initial data population with factory methods

### Users/Customers

Sample user profiles are available in the repository to support development and testing scenarios.

| UserId  | FirstName | LastName | Email                 | PhoneNumber |
| ------- | --------- | -------- | --------------------- | ----------- |
| user101 | John      | Doe      | john.doe@gmail.com    | Random      |
| user102 | Rachel    | Zane     | rachel.zane@gmail.com | Random      |

### Stores

Sample store data seeded for development purposes only.

| StoreId  | OutletName     | Type    | Description                  |
| -------- | -------------- | ------- | ---------------------------- |
| store101 | Fresh Picks    | Grocery | Premium grocery store        |
| store102 | Natural Choice | Grocery | Health-focused grocery store |

### Products

Dummy Products for Stores to sell and users to buy from.

| ProductId  | ProductName | Type    | StoreRefId | MRP   | Weight | Stock |
| ---------- | ----------- | ------- | ---------- | ----- | ------ | ----- |
| product101 | Wheat Bread | Grocery | store101   | 10.50 | 0.5kg  | 30    |
| product102 | Spinach     | Grocery | store101   | 10.50 | 0.5kg  | 30    |
| product103 | Crackers    | Grocery | store101   | 10.50 | 0.5kg  | 30    |

### Restaurants

Sample restaurant data seeded for development purposes only.

| RestaurantId | OutletName   | Type       | Description       |
| ------------ | ------------ | ---------- | ----------------- |
| rest101      | Pizza Palace | Restaurant | Local restaurant  |

### Food Products

Restaurant menu items. Unavailable items cannot be added to a cart (the
add-to-cart endpoint treats them as not found). Food and grocery products are
both added through the same `POST /cart/product` endpoint — pass the restaurant
id as `outletId` for food.

| ProductId | ProductName     | Type | RestaurantRefId | MRP   | SellingPrice | Available |
| --------- | --------------- | ---- | --------------- | ----- | ------------ | --------- |
| food101   | Margherita Pizza | Food | rest101         | 12.50 | 10.99        | true      |
| food102   | Pepperoni Pizza  | Food | rest101         | 12.50 | 10.99        | true      |
| food103   | Truffle Pizza    | Food | rest101         | 12.50 | 10.99        | false     |

## Requirements

The project requires [Node v22](https://nodejs.org/).

## Useful Node commands

The project makes use of node and its package manager to help you out carrying some common tasks such as building the project or running it.

### Install dependencies

```console
$ npm install
```

### Run the tests

There are two options to run the tests

- Run the tests once

  ```console
  $ npm test
  ```

- Keep running the tests with every change

  ```console
  $ npm run test-watch
  ```

### Run the application

Run the application which will be listening on port `8080`. There are two ways to run the application.

- Run the application with the current code

  ```console
  $ npm start
  ```

- Run the application with reload on save

  ```console
  $ npm run dev
  ```

## API Endpoints

Below is a list of API endpoints with their respective input and output. Please note that the application needs to be running for the following endpoints to work. For more information about how to run the application, please refer to run the application section above.

### Add Product to Cart

```http
POST /cart/product
Content-Type: application/json
```

Request Body

`quantity` is optional and defaults to `1`. It must be a positive integer;
otherwise the endpoint returns `400`. Adding a product already in the cart
increases that line item's quantity rather than creating a duplicate.

```json
{
  "userId": "user101",
  "productId": "product101",
  "outletId": "store101",
  "quantity": 2
}
```

Response Body

```json
{
  "cart": {
    "cartId": "cart101",
    "outlet": null,
    "products": [
      {
        "product": {
          "productId": "product101",
          "productName": "Wheat Bread",
          "mrp": 10.5,
          "sellingPrice": 9.99,
          "weight": 0.5,
          "expiryDate": 7,
          "threshold": 10,
          "availableStock": 30,
          "store": {
            "name": "Fresh Picks",
            "description": "Premium grocery store",
            "outletId": "store101",
            "inventory": {}
          },
          "discount": 0
        },
        "quantity": 2
      }
    ],
    "user": {
      "userId": "user101",
      "username": "john",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@gmail.com",
      "phoneNumber": "598326120",
      "cart": null
    }
  },
  "product": {
    "productId": "product101",
    "productName": "Wheat Bread",
    "mrp": 10.5,
    "sellingPrice": 9.99,
    "weight": 0.5,
    "expiryDate": 7,
    "threshold": 10,
    "availableStock": 30,
    "store": {
      "name": "Fresh Picks",
      "description": "Premium grocery store",
      "outletId": "store101",
      "inventory": {}
    },
    "discount": 0
  },
  "sellingPrice": 9.99
}
```

### View Cart

```http
GET /cart/view?userId=user101
```

A missing `userId` returns `400`; an unknown `userId` returns `404`.

Response Body

```json
{
  "cartId": "cart101",
  "outlet": null,
  "products": [],
  "user": {
    "userId": "user101",
    "username": "john",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@gmail.com",
    "phoneNumber": "598326120",
    "cart": null
  }
}
```

### Inventory Health

```http
GET /inventory/health?storeId=store101
```

Returns a summary of stock levels for a store. Each product is classified by
its `availableStock` relative to its `threshold`:

- `outOfStock` — `availableStock` is `0`
- `lowStock` — `availableStock` is at or below the `threshold`
- `healthy` — `availableStock` is above the `threshold`

A missing `storeId` returns `400`; an unknown store returns `404`.

Response Body

```json
{
  "storeId": "store101",
  "totalProducts": 3,
  "outOfStock": 0,
  "lowStock": 0,
  "healthy": 3
}
```

## Technology Stack

- **Backend**: Node.js with Express.js
- **Architecture**: Clean Architecture with Class-based inheritance
- **Testing**: Jest for unit testing
- **Development**: Nodemon for hot reloading
- **API**: RESTful API design
