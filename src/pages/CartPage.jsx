/**
 * CartPage — Redesigned (Urbanova 2026)
 * ────────────────────────────────────────
 * Cart items list with INR pricing + order summary sidebar.
 */

import { Link } from "react-router-dom";

export default function CartPage({ cart, onUpdateQuantity, onRemoveFromCart }) {
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const freeShippingThreshold = 999;
    const shippingCost = totalPrice >= freeShippingThreshold ? 0 : 99;
    const grandTotal = totalPrice + shippingCost;

    // ── Empty Cart ──
    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-6">
                <div className="text-center animate-fade-in-up max-w-sm">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">Your Cart is Empty</h2>
                    <p className="text-sm text-text-secondary mb-7 leading-relaxed">
                        Looks like you haven't added any products yet. Start shopping to fill it up!
                    </p>
                    <Link
                        to="/products"
                        id="empty-cart-browse-btn"
                        className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white text-sm font-bold rounded-lg hover:bg-accent-hover transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
                    >
                        Browse Products
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* ── Page Header ── */}
            <section className="w-full bg-surface-soft border-b border-border-light py-7 px-6">
                <div className="max-w-6xl mx-auto">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1 block">
                        Your Selection
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                        <h1 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">
                            Shopping Cart
                        </h1>
                        <p className="text-sm text-text-muted">
                            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Cart Content ── */}
            <section className="w-full bg-white py-8 lg:py-10 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">

                        {/* ── Items List ── */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item, index) => {
                                const hasDiscount = item.originalPrice && item.originalPrice > item.price;
                                return (
                                    <div
                                        key={item.id}
                                        className={`flex gap-4 p-4 bg-white rounded-2xl border border-border-light hover:shadow-sm transition-all duration-300 animate-fade-in-up delay-${Math.min((index + 1) * 100, 400)}`}
                                    >
                                        {/* Image */}
                                        <Link to={`/product/${item.id}`} className="shrink-0">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-surface-soft">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                        </Link>

                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <Link to={`/product/${item.id}`}>
                                                    <h3 className="font-semibold text-primary text-sm hover:text-accent transition-colors duration-200 line-clamp-1">
                                                        {item.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-xs text-text-muted mt-0.5">{item.category}</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-surface-soft transition-colors text-base cursor-pointer"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-primary bg-surface-soft">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-surface-soft transition-colors text-base cursor-pointer"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {/* Price */}
                                                    <div className="text-right">
                                                        <span className="font-bold text-primary text-sm">
                                                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                                        </span>
                                                        {hasDiscount && (
                                                            <p className="text-xs text-text-muted line-through">
                                                                ₹{(item.originalPrice * item.quantity).toLocaleString("en-IN")}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Remove */}
                                                    <button
                                                        onClick={() => onRemoveFromCart(item.id)}
                                                        className="text-text-muted hover:text-accent transition-colors duration-200 cursor-pointer p-1"
                                                        title="Remove item"
                                                        aria-label={`Remove ${item.title}`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── Order Summary ── */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 bg-surface-soft rounded-2xl border border-border-light p-5 lg:p-6 animate-slide-in-right delay-300">
                                <h3 className="text-base font-bold text-primary mb-5 pb-4 border-b border-border-light">
                                    Order Summary
                                </h3>

                                <div className="space-y-3 mb-5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Subtotal ({totalItems} items)</span>
                                        <span className="font-medium text-primary">₹{totalPrice.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Shipping</span>
                                        <span className={`font-semibold ${shippingCost === 0 ? "text-green-600" : "text-primary"}`}>
                                            {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Tax (GST)</span>
                                        <span className="font-medium text-primary">Included</span>
                                    </div>
                                    <div className="h-px bg-border-light" />
                                    <div className="flex justify-between">
                                        <span className="font-bold text-primary">Total</span>
                                        <span className="text-lg font-bold text-primary">
                                            ₹{grandTotal.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>

                                {/* Free shipping progress */}
                                {totalPrice < freeShippingThreshold && (
                                    <div className="mb-5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                        <p className="text-xs text-amber-700 font-medium">
                                            💡 Add ₹{(freeShippingThreshold - totalPrice).toLocaleString("en-IN")} more for free shipping!
                                        </p>
                                        <div className="mt-2 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                                style={{ width: `${(totalPrice / freeShippingThreshold) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Checkout Button */}
                                <button
                                    id="checkout-btn"
                                    className="w-full py-3.5 bg-accent text-white text-sm font-bold rounded-xl hover:bg-accent-hover transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98] cursor-pointer mb-3"
                                >
                                    Proceed to Checkout
                                </button>

                                <Link
                                    to="/products"
                                    className="block text-center text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                                >
                                    ← Continue Shopping
                                </Link>

                                {/* Payment icons */}
                                <div className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-border-light">
                                    {["VISA", "MC", "UPI", "GPay"].map((pay) => (
                                        <span key={pay} className="text-[9px] font-bold text-text-muted px-1.5 py-0.5 bg-white rounded border border-border-light">
                                            {pay}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
