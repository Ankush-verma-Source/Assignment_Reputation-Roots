# 🛒 Micro Marketplace — Full Stack E-Commerce App

A full-stack e-commerce web + mobile application built as an internship assignment. Features a premium dark-themed UI, JWT authentication, product management, favorites, and a per-user shopping cart.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend (Web)** | React 18, Vite, React Router v6, Axios, Lucide React |
| **Frontend (Mobile)** | React Native (Expo), React Navigation v6, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (JSON Web Tokens) + bcryptjs |
| **Styling** | Vanilla CSS (web) / StyleSheet (mobile) — shared dark design system |

---

## 📂 Project Structure

```
Assignment Intershala/
├── backend/          # Express REST API
│   ├── config/       # MongoDB connection
│   ├── controllers/  # Business logic
│   ├── middleware/   # Auth, error handling, validation
│   ├── models/       # Mongoose schemas (User, Product)
│   ├── routes/       # API route definitions
│   ├── seed.js       # Database seeder (20 products + 2 users)
│   └── server.js     # Entry point
│
├── web/              # React frontend
│   └── src/
│       ├── api/      # Axios config + interceptors
│       ├── components/ # Navbar, ProductCard
│       ├── context/  # AuthContext, CartContext
│       └── pages/    # Home, Login, Register, ProductDetails,
│                     # Favorites, Cart, ManageProducts, ProductForm
│
└── mobile/           # React Native (Expo) mobile app
    └── src/
        ├── api/      # Axios config + AsyncStorage JWT interceptors
        ├── context/  # AuthContext, CartContext
        ├── navigation/ # Auth stack + Bottom tab navigator
        ├── screens/  # Login, Register, Home, ProductDetail, Favorites, Cart, Profile
        └── theme/    # Shared design tokens
```

---

## ⚡ Quick Start

### 1. Backend

```bash
cd backend
npm install

# Create .env file:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/micro-marketplace
# JWT_SECRET=your_super_secret_key_123

npm run seed    # Seeds 20 products + 2 users
npm run dev     # Starts on http://0.0.0.0:5000 (accessible on local network)
```

### 2. Web App

```bash
cd web
npm install
npm run dev     # Starts on http://localhost:5173
```

### 3. Mobile App (Expo)

```bash
cd mobile
npm install
npx expo start --tunnel  # Scan QR with Expo Go app (Tunnel is more reliable)
```

> See `mobile/README.md` for device-specific API URL configuration.

---

## 🔑 Test Credentials

| Role | Username | Password |
|---|---|---|
| **Admin** | `admin` | `password123` |
| **User** | `user1` | `password123` |

---

## ✨ Features

### For Users (Web + Mobile)
- 🔐 Register / Login with JWT authentication
- 🛍️ Browse 20 products with search & pagination
- ❤️ Add/remove favorites (persisted to database)
- 🛒 Per-user shopping cart (persisted in local storage/AsyncStorage)
- 📦 Full product detail page with trust badges
- 🔄 Pull-to-refresh on all list screens (Mobile)

### For Admins (Web only)
- 📋 View all products in inventory table
- ➕ Create new products with category
- ✏️ Edit existing products
- 🗑️ Delete products
- 🚫 No cart/favorites (admin-only experience)

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |

### Products
| Method | Endpoint | Access |
|---|---|---|
| GET | `/products` | Public |
| GET | `/products/:id` | Public |
| POST | `/products` | Private (Admin) |
| PUT | `/products/:id` | Private (Admin) |
| DELETE | `/products/:id` | Private (Admin) |

### Favorites
| Method | Endpoint | Access |
|---|---|---|
| GET | `/products/favorites` | Private |
| POST | `/products/:id/favorite` | Private |
| DELETE | `/products/:id/favorite` | Private |

---

## 📱 Mobile Screens

| Screen | Description |
|---|---|
| Login | JWT login with AsyncStorage persistence |
| Register | New account creation |
| Home | Product listing with search, pagination, favorites |
| Product Detail | Full product view + favorite toggle + add to cart |
| Favorites | Saved products with remove option |
| Cart | Per-user shopping cart with quantity controls |
| Profile | User info + logout |
