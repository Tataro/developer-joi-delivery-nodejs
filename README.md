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

```json
{
  "userId": "user101",
  "productId": "product101",
  "outletId": "store101"
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
        "productId": "product103",
        "productName": "Crackers",
        "mrp": 10.5,
        "sellingPrice": null,
        "weight": 500,
        "expiryDate": 0,
        "threshold": 10,
        "availableStock": 30,
        "discount": null,
        "store": {
          "name": "Fresh Picks",
          "description": null,
          "outletId": "store101",
          "inventory": []
        }
      }
    ],
    "user": null
  },
  "product": {
    "productId": "product103",
    "productName": "Crackers",
    "mrp": 10.5,
    "sellingPrice": null,
    "weight": 500,
    "expiryDate": 0,
    "threshold": 10,
    "availableStock": 30,
    "discount": null,
    "store": {
      "name": "Fresh Picks",
      "description": null,
      "outletId": "store101",
      "inventory": []
    }
  },
  "sellingPrice": null
}
```

### View Cart

```http
GET /cart/view?userId=user101
```

Response Body

```json
{
  "cartId": "cart101",
  "outlet": null,
  "products": [],
  "user": null
}
```

### Inventory Health

```http
GET /inventory/health?storeId=<storeId>
```

Response Body

```json lines
{
  "storeId": "store-1",
  "totalProducts": 10,
  "lowStockCount": 2,
  "outOfStockCount": 1
}
```

**400 Bad Request** — missing `storeId` query parameter

```json lines
{
  "message": "storeId is required"
}
```

**404 Not Found** — no store matches the given `storeId`

```json lines
{
  "message": "Store with id <storeId> not found"
}
```

## Technology Stack

- **Backend**: Node.js with Express.js
- **Architecture**: Clean Architecture with Class-based inheritance
- **Testing**: Jest for unit testing
- **Development**: Nodemon for hot reloading
- **API**: RESTful API design
