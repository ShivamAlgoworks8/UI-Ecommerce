/**
 * ProductCard Component
 * ─────────────────────
 * Compact, clean product card with hover lift effect.
 * Matches the tighter spacing and professional e-commerce style.
 */

import { Link } from "react-router-dom";

export default function ProductCard({ product, onAddToCart, animationDelay = "" }) {
    return (
        <div
            className={`group bg-white rounded-xl overflow-hidden border border-border-light hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up ${animationDelay}`}
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
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-wider text-text-secondary px-2.5 py-0.5 rounded-full">
                        {product.category}
                    </span>
                </div>
            </Link>

            {/* ── Product Info ── */}
            <div className="p-3 sm:p-4">
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm font-semibold text-primary mb-1 hover:text-accent transition-colors duration-200 line-clamp-1">
                        {product.title}
                    </h3>
                </Link>
                <p className="text-base font-bold text-primary mb-3">
                    ${product.price.toFixed(2)}
                </p>

                <button
                    onClick={() => onAddToCart(product)}
                    className="w-full py-2.5 bg-accent text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all duration-300 active:scale-[0.98] cursor-pointer"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
