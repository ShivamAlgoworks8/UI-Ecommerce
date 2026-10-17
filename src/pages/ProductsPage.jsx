/**
 * ProductsPage
 * ─────────────
 * All products grid — full-width sections with
 * max-w-6xl inner container for content readability.
 */

import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

const categories = ["All Categories", ...new Set(products.map((product) => product.category))];
const minProductPrice = Math.floor(Math.min(...products.map((product) => product.price)));
const maxProductPrice = Math.ceil(Math.max(...products.map((product) => product.price)));

export default function ProductsPage({
    onAddToCart,
    wishlist,
    onToggleWishlist,
    searchQuery,
    onClearSearch,
}) {
    const [category, setCategory] = useState("All Categories");
    const [minPrice, setMinPrice] = useState(minProductPrice);
    const [maxPrice, setMaxPrice] = useState(maxProductPrice);
    const [sortOrder, setSortOrder] = useState("default");

    const filteredProducts = useMemo(() => {
        const normalizedSearch = searchQuery.trim().toLowerCase();
        const matchingProducts = products.filter((product) => {
            const matchesSearch = !normalizedSearch
                || product.title.toLowerCase().includes(normalizedSearch)
                || product.category.toLowerCase().includes(normalizedSearch);
            const matchesCategory = category === "All Categories" || product.category === category;
            const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
            return matchesSearch && matchesCategory && matchesPrice;
        });

        if (sortOrder === "price-low") {
            return [...matchingProducts].sort((a, b) => a.price - b.price);
        }
        if (sortOrder === "price-high") {
            return [...matchingProducts].sort((a, b) => b.price - a.price);
        }
        return matchingProducts;
    }, [category, maxPrice, minPrice, searchQuery, sortOrder]);

    const clearFilters = () => {
        setCategory("All Categories");
        setMinPrice(minProductPrice);
        setMaxPrice(maxProductPrice);
        setSortOrder("default");
        onClearSearch();
    };

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
                            {filteredProducts.length} of {products.length} products
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Product Grid ── */}
            <section className="w-full bg-white py-8 lg:py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8 p-4 sm:p-5 rounded-xl border border-border-light bg-surface-soft">
                        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                            <label className="flex-1 text-xs font-semibold text-text-secondary">
                                Category
                                <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/30">
                                    {categories.map((option) => <option key={option}>{option}</option>)}
                                </select>
                            </label>
                            <div className="flex-1 grid grid-cols-2 gap-3">
                                <label className="text-xs font-semibold text-text-secondary">
                                    Min price
                                    <input type="number" min={minProductPrice} max={maxProductPrice} value={minPrice} onChange={(event) => setMinPrice(Number(event.target.value))} className="mt-2 w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/30" />
                                </label>
                                <label className="text-xs font-semibold text-text-secondary">
                                    Max price
                                    <input type="number" min={minProductPrice} max={maxProductPrice} value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="mt-2 w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/30" />
                                </label>
                            </div>
                            <label className="flex-1 text-xs font-semibold text-text-secondary">
                                Sort by
                                <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="mt-2 w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/30">
                                    <option value="default">Default</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </label>
                            <button type="button" onClick={clearFilters} className="px-4 py-2.5 text-sm font-semibold text-accent border border-accent/30 rounded-lg hover:bg-accent/5 transition-colors cursor-pointer">
                                Clear filters
                            </button>
                        </div>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="min-h-[260px] flex items-center justify-center text-center px-6">
                            <div className="max-w-sm animate-fade-in-up">
                                <h2 className="text-xl font-bold text-primary mb-2">No products found</h2>
                                <p className="text-sm text-text-secondary mb-5">Try adjusting your search or filters to find what you are looking for.</p>
                                <button type="button" onClick={clearFilters} className="px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-colors cursor-pointer">
                                    Clear search and filters
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {filteredProducts.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={onAddToCart}
                                wishlist={wishlist}
                                onToggleWishlist={onToggleWishlist}
                                animationDelay={`delay-${(index + 1) * 100}`}
                            />
                        ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
