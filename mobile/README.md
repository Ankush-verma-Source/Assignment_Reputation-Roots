# Micro Marketplace — Mobile App

React Native (Expo) mobile app for the Micro Marketplace. Shares the same backend API as the web app.

## 🚀 Tech Stack

- **Framework**: React Native (Expo SDK)
- **Navigation**: React Navigation v6 (Native Stack + Bottom Tabs)
- **HTTP Client**: Axios (with AsyncStorage JWT interceptors)
- **Storage**: @react-native-async-storage/async-storage
- **Icons**: @expo/vector-icons (Ionicons)

## 📂 Project Structure

```
mobile/
├── src/
│   ├── api/
│   │   └── axios.js              # Axios instance + JWT interceptors
│   ├── context/
│   │   ├── AuthContext.js        # Global auth state (AsyncStorage-backed)
│   │   └── CartContext.js        # Per-user cart state (AsyncStorage-backed)
│   ├── navigation/
│   │   ├── AuthNavigator.js      # Login + Register stack
│   │   └── AppNavigator.js       # Bottom tab navigator (Shop, Favorites, Cart, Profile)
│   ├── screens/
│   │   ├── LoginScreen.js        # Login form
│   │   ├── RegisterScreen.js     # Registration form
│   │   ├── HomeScreen.js         # Product listing (search + pagination + favorites)
│   │   ├── ProductDetailScreen.js # Full product view + fav/cart actions
│   │   ├── FavoritesScreen.js    # User's saved products
│   │   ├── CartScreen.js         # Shopping cart + checkout
│   │   └── ProfileScreen.js      # User info + logout
│   └── theme/
│       └── colors.js             # Design tokens (dark theme)
├── App.js                        # Root component
└── package.json
```

## 🛠️ Setup & Running

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- **Expo Go** app on your phone (iOS or Android)

### Steps

1. **Install dependencies:**
    ```bash
    cd mobile
    npm install
    ```

2. **Configure API URL** in `src/api/axios.js`:
    ```js
    // For Android Emulator:
    baseURL: 'http://10.0.2.2:5000'

    // For iOS Simulator or Expo Go on physical device:
    // Replace with your machine's local IP address, e.g.:
    baseURL: 'http://192.168.1.x:5000'
    ```

3. **Start the Expo dev server:**
    ```bash
    npx expo start
    ```

4. **Run on device:**
    - **Android Emulator**: Press `a`
    - **iOS Simulator**: Press `i` (macOS only)
    - **Physical device**: Scan the QR code with the **Expo Go** app

> ⚠️ Ensure the **backend** is running on port 5000 before launching the app.

## 🔑 Test Credentials

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `password123` |
| User | `user1` | `password123` |

## ✨ Features

- 🔐 Login & Register with JWT auth (token stored in AsyncStorage)
- 🛍️ Browse products with real-time search and pagination
- ❤️ Add/remove favorites (synced to backend)
- 📦 Full product detail view with trust badges
- 👤 Profile screen with logout
- 🎨 Dark theme matching the web app design system
- 🔄 Pull-to-refresh on all list screens
- 🛡️ Role-aware UI (Favorites tab hidden for admin users)
