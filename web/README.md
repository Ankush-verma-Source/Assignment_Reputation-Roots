# Micro Marketplace — Frontend

React-based frontend for the Micro Marketplace application. Built with **React 18**, **Vite**, and a custom premium dark CSS design system.

## 🚀 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios (with JWT interceptors)
- **Icons**: Lucide React
- **Notifications**: react-hot-toast
- **Styling**: Vanilla CSS with CSS custom properties (design tokens)

## 📂 Project Structure

```
web/
├── src/
│   ├── api/
│   │   └── axios.js          # Axios instance + request/response interceptors
│   ├── components/
│   │   ├── Navbar.jsx         # Sticky glassmorphic navbar (role-aware)
│   │   ├── Navbar.css
│   │   ├── ProductCard.jsx    # Product card with favorite toggle
│   │   └── ProductCard.css
│   ├── context/
│   │   ├── AuthContext.jsx    # Global auth state (login, logout, register)
│   │   └── CartContext.jsx    # Per-user cart state (localStorage keyed by userId)
│   ├── pages/
│   │   ├── Home.jsx           # Product listing with search & pagination
│   │   ├── Login.jsx          # Login form
│   │   ├── Register.jsx       # Registration form
│   │   ├── ProductDetails.jsx # Single product view
│   │   ├── Favorites.jsx      # User's saved products (protected)
│   │   ├── Cart.jsx           # Shopping cart (protected)
│   │   ├── ManageProducts.jsx # Admin inventory table (admin only)
│   │   └── ProductForm.jsx    # Create/Edit product form (admin only)
│   ├── App.jsx                # Root component + routing
│   ├── main.jsx               # Entry point
│   └── index.css              # Global design system (tokens, animations, utilities)
└── vite.config.js
```

## 🛠️ Setup & Installation

1. **Install Dependencies:**
    ```bash
    npm install
    ```

2. **Run the Development Server:**
    ```bash
    npm run dev
    ```
    App starts on `http://localhost:5173` (or next available port).

> ⚠️ Ensure the **backend** is running on `http://localhost:5000` before starting the frontend.

## 🔑 Key Features

### 1. Authentication & State Management
- **AuthContext**: React Context API manages user session globally. Persists to `localStorage` across page reloads.
- **Protected Routes**: `PrivateRoute` redirects unauthenticated users to `/login`. `AdminRoute` restricts admin pages.
- **Auto-Logout**: Axios response interceptor detects expired JWT (401) and automatically logs the user out.

### 2. Role-Based UI
- **Regular users** see: Shop, Favorites, Cart, Product Details (with Add to Cart).
- **Admin users** see: Shop (browse only), Inventory (manage products). Cart and Favorites are hidden.

### 3. Per-User Cart
- Cart is stored in `localStorage` under a user-specific key (`cart_<userId>`).
- Switching users loads the correct cart automatically. Logging out clears the cart from state.

### 4. Favorites System
- Users can toggle favorites from the product card or the details page.
- Favorites are synced to the backend database (persisted across devices/sessions).
- Optimistic UI updates for instant feedback.

### 5. Product Management (Admin)
- Full CRUD: Create, Read, Update, Delete products.
- Live preview panel in the product form.
- Stats bar showing total products, total inventory value, and average price.

### 6. UI/UX Design
- **Dark Theme**: Consistent `#0a0a0f` base with purple/cyan accent palette.
- **Glassmorphism**: Navbar uses `backdrop-filter: blur(20px)`.
- **Animations**: Fade-in, hover lift, skeleton loaders, shimmer effects.
- **Responsive**: CSS Grid with `auto-fill` adapts from mobile to desktop.

## 📡 Pages & Routes

| Page | Route | Access |
|:---|:---|:---|
| **Home** | `/` | Public |
| **Login** | `/login` | Public |
| **Register** | `/register` | Public |
| **Product Detail** | `/product/:id` | Public |
| **Favorites** | `/favorites` | 🔒 Private |
| **Cart** | `/cart` | 🔒 Private |
| **Admin Inventory** | `/admin/products` | 🔒 Admin only |
| **Add Product** | `/admin/products/add` | 🔒 Admin only |
| **Edit Product** | `/admin/products/edit/:id` | 🔒 Admin only |
