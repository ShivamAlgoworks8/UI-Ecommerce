/**
 * App Component — Root of the Application
 * Manages the global cart and wishlist state and configures routes.
 */

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CheckoutPage from "./pages/CheckoutPage";

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
import WishlistPage from "./pages/WishlistPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Component to scroll to top on route change
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  // Stores cart items and their quantities.
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Adds a product to the cart or increments its existing quantity.
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Updates a cart item's quantity and removes it if the quantity is zero.
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

  // Removes a product from the cart.
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Clears the cart after an order is successfully placed.
  const clearCart = () => {
    setCart([]);
  };

  // Adds a product to the wishlist or removes it if already present.
  const toggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const isWishlisted = prevWishlist.some(
        (item) => item.id === product.id
      );

      return isWishlisted
        ? prevWishlist.filter((item) => item.id !== product.id)
        : [...prevWishlist, product];
    });
  };

  // Calculates the total number of items in the cart.
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />

        <div className="min-h-screen flex flex-col">
          <Navbar
            cartCount={cartCount}
            wishlistCount={wishlist.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <main className="flex-grow">
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    onAddToCart={addToCart}
                    wishlist={wishlist}
                    onToggleWishlist={toggleWishlist}
                  />
                }
              />

              <Route
                path="/products"
                element={
                  <ProductsPage
                    onAddToCart={addToCart}
                    wishlist={wishlist}
                    onToggleWishlist={toggleWishlist}
                    searchQuery={searchQuery}
                    onClearSearch={() => setSearchQuery("")}
                  />
                }
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

              <Route
                path="/checkout"
                element={
                  <CheckoutPage
                    cart={cart}
                    onClearCart={clearCart}
                    onUpdateQuantity={updateQuantity}
                    onRemoveFromCart={removeFromCart}
                  />
                }
              />

              <Route
                path="/wishlist"
                element={
                  <WishlistPage
                    wishlist={wishlist}
                    onAddToCart={addToCart}
                    onToggleWishlist={toggleWishlist}
                  />
                }
              />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}