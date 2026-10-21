/**
 * ProductCard Component — Redesigned (Urbanova 2026)
 * ────────────────────────────────────────────────────
 * Premium product card with star ratings, color swatches,
 * original/sale price, and cart icon button.
 * Matches the Urbanova mockup design.
 */

import { Link } from "react-router-dom";

function StarRating({ rating }) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`h-3.5 w-3.5 ${star <= fullStars ? "text-star" : star === fullStars + 1 && hasHalf ? "text-star" : "text-gray-200"}`}
                    fill={star <= fullStars ? "currentColor" : star === fullStars + 1 && hasHalf ? "url(#half)" : "currentColor"}
                    viewBox="0 0 24 24"
                >
                    {star === fullStars + 1 && hasHalf ? (
                        <defs>
                            <linearGradient id="half">
                                <stop offset="50%" stopColor="#f59e0b" />
                                <stop offset="50%" stopColor="#e5e7eb" />
                            </linearGradient>
                        </defs>
                    ) : null}
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </div>
    );
}

export default function ProductCard({ product, onAddToCart, wishlist = [], onToggleWishlist, animationDelay = "" }) {
    const isWishlisted = wishlist.some((item) => item.id === product.id);
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div
            className={`product-card group bg-white rounded-2xl overflow-hidden border border-border-light animate-fade-in-up ${animationDelay}`}
        >
            {/* ── Product Image ── */}
            <Link to={`/product/${product.id}`}>
                <div className="relative overflow-hidden bg-surface-soft aspect-square">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />

                    {/* Discount Badge */}
                    {hasDiscount && (
                        <span className="absolute top-3 left-3 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            -{discountPercent}%
                        </span>
                    )}

                    {/* Wishlist Button */}
                    {onToggleWishlist && (
                        <button
                            type="button"
                            onClick={(event) => {
                                event.preventDefault();
                                onToggleWishlist(product);
                            }}
                            aria-label={isWishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
                            aria-pressed={isWishlisted}
                            className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:scale-110 cursor-pointer ${
                                isWishlisted ? "text-accent" : "text-gray-300 hover:text-accent"
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    )}
                </div>
            </Link>

            {/* ── Product Info ── */}
            <div className="p-3 sm:p-4">
                {/* Title */}
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm font-semibold text-primary mb-1.5 hover:text-accent transition-colors duration-200 line-clamp-1 leading-tight">
                        {product.title}
                    </h3>
                </Link>

                {/* Rating */}
                {product.rating && (
                    <div className="flex items-center gap-1.5 mb-2">
                        <StarRating rating={product.rating} />
                        <span className="text-xs font-medium text-star">{product.rating}</span>
                        <span className="text-xs text-text-muted">({product.reviewCount})</span>
                    </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-base font-bold text-primary">
                        ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {hasDiscount && (
                        <span className="text-xs text-text-muted line-through">
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                    )}
                </div>

                {/* Color Swatches */}
                {product.colors && product.colors.length > 0 && (
                    <div className="flex items-center gap-1.5 mb-3">
                        {product.colors.map((color, i) => (
                            <span
                                key={i}
                                className="color-swatch"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                )}

                {/* Add to Cart Button */}
                <button
                    id={`add-to-cart-${product.id}`}
                    onClick={() => onAddToCart(product)}
                    className="btn-cart"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
