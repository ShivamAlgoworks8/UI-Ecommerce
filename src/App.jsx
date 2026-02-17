/**
 * App Component — Root of the Application
 * ─────────────────────────────────────────
 * Manages the global cart state (useState) and sets up
 * React Router routes for all pages. The cart state and
 * handler functions are passed down as props to pages.
 *
 * Route structure:
 *  /            → HomePage
 *  /products    → ProductsPage
 *  /product/:id → ProductDetailPage
 *  /cart        → CartPage
 */

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth Context
import { AuthProvider } from "./context/AuthContext";

// Layout components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Page components
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Component to scroll to top on route change
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  /**
   * Cart state — array of product objects, each extended
   * with a `quantity` property. Using useState as required.
   * Example cart item: { id, title, price, image, category, quantity }
   */
  const [cart, setCart] = useState([]);

  /**
   * addToCart — Adds a product to the cart.
   * If the product is already in the cart, increments its quantity.
   * Otherwise, adds it with quantity = 1.
   */
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Product already in cart — increment quantity
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // New product — add with quantity 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  /**
   * updateQuantity — Updates the quantity of a cart item.
   * If the new quantity is 0 or less, removes the item.
   */
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  /**
   * removeFromCart — Removes a product entirely from the cart.
   */
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Total number of items in cart (sum of quantities)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          {/* ── Sticky Navbar ── */}
          <Navbar cartCount={cartCount} />

          {/* ── Page Content (grows to fill remaining space) ── */}
          <main className="flex-grow">
            <Routes>
              <Route
                path="/"
                element={<HomePage onAddToCart={addToCart} />}
              />
              <Route
                path="/products"
                element={<ProductsPage onAddToCart={addToCart} />}
              />
              <Route
                path="/product/:id"
                element={<ProductDetailPage onAddToCart={addToCart} />}
              />
              <Route
                path="/cart"
                element={
                  <CartPage
                    cart={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemoveFromCart={removeFromCart}
                  />
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </main>

          {/* ── Footer ── */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

