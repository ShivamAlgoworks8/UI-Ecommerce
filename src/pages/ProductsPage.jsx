/**
 * ProductsPage
 * ─────────────
 * All products grid — full-width sections with
 * max-w-6xl inner container for content readability.
 */

import ProductCard from "../components/ProductCard";
import products from "../data/products";

export default function ProductsPage({ onAddToCart }) {
    return (
        <div>
            {/* ── Page Header ── */}
            <section className="w-full bg-surface-soft border-b border-border-light py-8 lg:py-10 px-6">
                <div className="max-w-6xl mx-auto">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-1 block">
                        Our Collection
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                        <h1 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">
                            All Products
                        </h1>
                        <p className="text-sm text-text-muted">
                            {products.length} products available
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Product Grid ── */}
            <section className="w-full bg-white py-8 lg:py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {products.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={onAddToCart}
                                animationDelay={`delay-${(index + 1) * 100}`}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
