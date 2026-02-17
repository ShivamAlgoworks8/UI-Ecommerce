/**
 * CartPage
 * ────────
 * Full-width section wrappers with max-w-6xl inner
 * container — consistent with the rest of the site.
 */

import { Link } from "react-router-dom";

export default function CartPage({ cart, onUpdateQuantity, onRemoveFromCart }) {
    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // ── Empty Cart ──
    if (cart.length === 0) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center px-6">
                <div className="text-center animate-fade-in-up max-w-sm">
                    <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-surface-soft flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-primary mb-2">Your Cart is Empty</h2>
                    <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                        Looks like you haven't added any products yet.
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all duration-300"
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

    // ── Cart with Items ──
    return (
        <div>
            {/* ── Page Header ── */}
            <section className="w-full bg-surface-soft border-b border-border-light py-8 lg:py-10 px-6">
                <div className="max-w-6xl mx-auto">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-1 block">
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
                            {cart.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`flex gap-4 p-4 bg-white rounded-xl border border-border-light hover:shadow-sm transition-all duration-300 animate-fade-in-up delay-${(index + 1) * 100}`}
                                >
                                    <Link to={`/product/${item.id}`} className="shrink-0">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-surface-soft">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                    </Link>

                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <Link to={`/product/${item.id}`}>
                                                <h3 className="font-semibold text-primary text-sm hover:text-accent transition-colors duration-200 truncate">
                                                    {item.title}
                                                </h3>
                                            </Link>
                                            <p className="text-xs text-text-muted mt-0.5">{item.category}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center border border-border rounded-md overflow-hidden">
                                                <button
                                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                    className="w-7 h-7 flex items-center justify-center text-text-secondary hover:bg-surface-soft transition-colors text-sm cursor-pointer"
                                                >
                                                    −
                                                </button>
                                                <span className="w-7 h-7 flex items-center justify-center text-xs font-medium text-primary bg-surface-soft">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                    className="w-7 h-7 flex items-center justify-center text-text-secondary hover:bg-surface-soft transition-colors text-sm cursor-pointer"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-primary text-sm">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                                <button
                                                    onClick={() => onRemoveFromCart(item.id)}
                                                    className="text-text-muted hover:text-accent transition-colors duration-200 cursor-pointer"
                                                    title="Remove item"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── Order Summary ── */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 bg-surface-soft rounded-xl border border-border-light p-5 lg:p-6 animate-slide-in-right delay-300">
                                <h3 className="text-base font-bold text-primary mb-4">Order Summary</h3>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Subtotal ({totalItems} items)</span>
                                        <span className="font-medium text-primary">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Shipping</span>
                                        <span className="font-medium text-green-600">
                                            {totalPrice >= 100 ? "Free" : "$9.99"}
                                        </span>
                                    </div>
                                    <div className="h-px bg-border" />
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-primary text-sm">Total</span>
                                        <span className="text-lg font-bold text-primary">
                                            ${(totalPrice >= 100 ? totalPrice : totalPrice + 9.99).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {totalPrice < 100 && (
                                    <p className="text-xs text-text-muted mb-3 p-2.5 bg-accent/5 rounded-md">
                                        💡 Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
                                    </p>
                                )}

                                <button className="w-full py-3 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98] cursor-pointer mb-2">
                                    Proceed to Checkout
                                </button>

                                <Link
                                    to="/products"
                                    className="block text-center text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                                >
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
