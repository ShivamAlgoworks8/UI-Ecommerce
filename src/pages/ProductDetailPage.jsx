/**
 * ProductDetailPage — Redesigned (Urbanova 2026)
 * ─────────────────────────────────────────────────
 * Full product detail with image, info panel (INR pricing,
 * ratings, color swatches), features list, and related products.
 */

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import products from "../data/products";

function StarRating({ rating }) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`h-4 w-4 ${star <= fullStars ? "text-star" : star === fullStars + 1 && hasHalf ? "text-star" : "text-gray-200"}`}
                    fill="currentColor" viewBox="0 0 24 24"
                >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </div>
    );
}

export default function ProductDetailPage({ onAddToCart }) {
    const { id } = useParams();
    const product = products.find((p) => p.id === Number(id));
    const [selectedColor, setSelectedColor] = useState(0);
    const [qty, setQty] = useState(1);

    if (!product) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center px-6">
                <div className="text-center animate-fade-in-up max-w-sm">
                    <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-surface-soft flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-primary mb-2">Product Not Found</h2>
                    <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                        The product you're looking for doesn't exist or has been removed.
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all duration-300"
                    >
                        ← Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;
    const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

    return (
        <div>
            {/* ── Breadcrumb ── */}
            <div className="w-full bg-surface-soft border-b border-border-light py-3 px-6">
                <div className="max-w-6xl mx-auto">
                    <nav className="flex items-center gap-2 text-sm text-text-muted">
                        <Link to="/" className="hover:text-accent transition-colors duration-200">Home</Link>
                        <span>/</span>
                        <Link to="/products" className="hover:text-accent transition-colors duration-200">Products</Link>
                        <span>/</span>
                        <span className="text-primary font-medium truncate max-w-[200px]">{product.title}</span>
                    </nav>
                </div>
            </div>

            {/* ── Product Detail Grid ── */}
            <section className="w-full bg-white py-10 lg:py-14 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-10 lg:gap-16">

                        {/* ── Product Image ── */}
                        <div className="animate-fade-in-up">
                            <div className="rounded-2xl overflow-hidden bg-surface-soft border border-border-light relative">
                                {hasDiscount && (
                                    <span className="absolute top-4 left-4 z-10 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                                        -{discountPercent}% OFF
                                    </span>
                                )}
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-[320px] sm:h-[420px] lg:h-[500px] object-cover"
                                />
                            </div>
                        </div>

                        {/* ── Product Info ── */}
                        <div className="flex flex-col justify-center animate-slide-in-right delay-200">

                            {/* Category pill */}
                            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3 px-3 py-1 bg-accent/10 rounded-full w-fit">
                                {product.category}
                            </span>

                            {/* Title */}
                            <h1 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight mb-3">
                                {product.title}
                            </h1>

                            {/* Rating Row */}
                            {product.rating && (
                                <div className="flex items-center gap-2 mb-4">
                                    <StarRating rating={product.rating} />
                                    <span className="text-sm font-semibold text-star">{product.rating}</span>
                                    <span className="text-sm text-text-muted">({product.reviewCount} reviews)</span>
                                    <span className="ml-2 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">In Stock</span>
                                </div>
                            )}

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-5">
                                <p className="text-3xl font-bold text-primary">
                                    ₹{product.price.toLocaleString("en-IN")}
                                </p>
                                {hasDiscount && (
                                    <span className="text-lg text-text-muted line-through">
                                        ₹{product.originalPrice.toLocaleString("en-IN")}
                                    </span>
                                )}
                            </div>

                            <div className="w-full h-px bg-border-light mb-5" />

                            {/* Description */}
                            <p className="text-text-secondary leading-relaxed mb-5 text-sm lg:text-base">
                                {product.description}
                            </p>

                            {/* Color Swatches */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="mb-5">
                                    <p className="text-sm font-semibold text-primary mb-2">Color</p>
                                    <div className="flex items-center gap-2.5">
                                        {product.colors.map((color, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedColor(i)}
                                                className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                                                    selectedColor === i
                                                        ? "border-accent scale-110 shadow-md"
                                                        : "border-transparent hover:border-gray-300"
                                                }`}
                                                style={{ backgroundColor: color, outline: `2px solid ${selectedColor === i ? "transparent" : "rgba(0,0,0,0.08)"}` }}
                                                aria-label={`Select color ${i + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity + Add to Cart */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="w-9 h-10 flex items-center justify-center text-text-secondary hover:bg-surface-soft transition-colors text-lg cursor-pointer"
                                    >
                                        −
                                    </button>
                                    <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-primary bg-surface-soft">
                                        {qty}
                                    </span>
                                    <button
                                        onClick={() => setQty(qty + 1)}
                                        className="w-9 h-10 flex items-center justify-center text-text-secondary hover:bg-surface-soft transition-colors text-lg cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    id={`detail-add-to-cart-${product.id}`}
                                    onClick={() => {
                                        for (let i = 0; i < qty; i++) onAddToCart(product);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent text-white text-sm font-bold rounded-lg hover:bg-accent-hover transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98] cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                                    </svg>
                                    Add to Cart — ₹{(product.price * qty).toLocaleString("en-IN")}
                                </button>
                            </div>

                            {/* Features */}
                            <div className="space-y-2.5 p-4 bg-surface-soft rounded-xl border border-border-light">
                                {[
                                    "Premium Quality Materials",
                                    "Free Shipping on orders above ₹999",
                                    "30-Day Easy Returns",
                                ].map((feature) => (
                                    <div key={feature} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-sm text-text-secondary">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Related Products ── */}
            <section className="w-full bg-surface-soft border-t border-border-light py-10 lg:py-14 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-primary">You Might Also Like</h3>
                        <Link
                            to="/products"
                            className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-200 flex items-center gap-1"
                        >
                            View All
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                        {relatedProducts.map((relatedProduct) => (
                            <Link
                                key={relatedProduct.id}
                                to={`/product/${relatedProduct.id}`}
                                className="group rounded-2xl overflow-hidden bg-white border border-border-light hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="aspect-square overflow-hidden bg-surface-soft">
                                    <img
                                        src={relatedProduct.image}
                                        alt={relatedProduct.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-3">
                                    <h4 className="text-sm font-semibold text-primary truncate group-hover:text-accent transition-colors duration-200 mb-1">
                                        {relatedProduct.title}
                                    </h4>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-bold text-primary">
                                            ₹{relatedProduct.price.toLocaleString("en-IN")}
                                        </span>
                                        {relatedProduct.originalPrice && (
                                            <span className="text-xs text-text-muted line-through">
                                                ₹{relatedProduct.originalPrice.toLocaleString("en-IN")}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
