# Micro Marketplace — Backend API

REST API for the Micro Marketplace application. Built with **Node.js**, **Express**, and **MongoDB**.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs (Password Hashing), CORS
- **Validation**: express-validator

## 📂 Project Structure

```
backend/
├── config/             # Database connection (db.js)
├── controllers/        # authController.js, productController.js
├── middleware/         # authMiddleware.js, errorMiddleware.js, validationMiddleware.js
├── models/             # User.js, Product.js
├── routes/             # authRoutes.js, productRoutes.js
├── seed.js             # Seeds 20 products + 2 users into the database
├── server.js           # Application entry point
└── .env                # Environment variables (not committed)
```

## 🛠️ Setup & Installation

1. **Install Dependencies:**
    ```bash
    npm install
    ```

2. **Create `.env` file** in the `backend/` directory:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/micro-marketplace
    JWT_SECRET=your_super_secret_key_123
    ```

3. **Seed the Database** (20 products + 2 users):
    ```bash
    npm run seed
    ```

4. **Run the Server:**
    ```bash
    npm run dev     # Development (nodemon)
    npm start       # Production
    ```
    Server starts on `http://localhost:5000`.

## 🔑 Key Features

### 1. Authentication & Security
- **JWT**: Stateless auth — token must be sent as `Authorization: Bearer <token>` on protected routes.
- **Password Hashing**: bcryptjs hashes all passwords before storage.
- **Middleware**: `protect` verifies JWT and attaches user to request. `admin` checks `isAdmin` flag.

### 2. Input Validation
- **express-validator**: Validates all incoming data (register, login, product create/update).
- Invalid requests are rejected before reaching controller logic.

### 3. Error Handling
- **Global Error Handler**: Centralized middleware returns consistent `{ message, stack }` JSON responses with correct HTTP status codes.

### 4. Search & Pagination
- `GET /products?keyword=laptop` — case-insensitive regex search on product titles.
- `GET /products?pageNumber=2` — paginated results (12 per page by default).
- `GET /products?pageSize=100` — override page size (capped at 100, used by admin inventory).

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `POST` | `/auth/register` | Register a new user | Public |
| `POST` | `/auth/login` | Login & receive JWT | Public |

### Products

| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `GET` | `/products` | List products (search + pagination) | Public |
| `GET` | `/products/:id` | Get single product | Public |
| `POST` | `/products` | Create a product | **Private** |
| `PUT` | `/products/:id` | Update a product | **Private** (Owner) |
| `DELETE` | `/products/:id` | Delete a product | **Private** (Owner) |

### Favorites

| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `GET` | `/products/favorites` | Get user's favorites | **Private** |
| `POST` | `/products/:id/favorite` | Add to favorites | **Private** |
| `DELETE` | `/products/:id/favorite` | Remove from favorites | **Private** |

## 🧪 Test Credentials

| Role | Username | Password |
|:---|:---|:---|
| Admin | `admin` | `password123` |
| User | `user1` | `password123` |
