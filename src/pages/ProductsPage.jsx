/**
 * ProductsPage — Redesigned (Urbanova 2026)
 * ──────────────────────────────────────────
 * Left sidebar with category checkboxes + price range slider.
 * Right: sort bar + product grid. Matches Urbanova mockup.
 */
import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import productCategories from "../data/categories";

const ALL_CATEGORIES = "All Categories";
const categories = [ALL_CATEGORIES, ...productCategories];
const minProductPrice = Math.floor(Math.min(...products.map((p) => p.price)));
const maxProductPrice = Math.ceil(Math.max(...products.map((p) => p.price)));

// Count products per category
const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = cat === ALL_CATEGORIES
        ? products.length
        : products.filter((p) => p.category === cat).length;
    return acc;
}, {});

const sortOptions = [
    { value: "default", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
];

export default function ProductsPage({
    onAddToCart,
    wishlist,
    onToggleWishlist,
    searchQuery,
    onClearSearch,
}) {
    const [selectedCategories, setSelectedCategories] = useState([ALL_CATEGORIES]);
    const [priceRange, setPriceRange] = useState(maxProductPrice);
    const [sortOrder, setSortOrder] = useState("default");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleCategory = (cat) => {
        if (cat === ALL_CATEGORIES) {
            setSelectedCategories([ALL_CATEGORIES]);
            return;
        }
        setSelectedCategories((prev) => {
            const withoutAll = prev.filter((c) => c !== ALL_CATEGORIES);
            const exists = withoutAll.includes(cat);
            const updated = exists
                ? withoutAll.filter((c) => c !== cat)
                : [...withoutAll, cat];
            return updated.length === 0 ? [ALL_CATEGORIES] : updated;
        });
    };

    const filteredProducts = useMemo(() => {
        const normalizedSearch = searchQuery.trim().toLowerCase();
        const isAllCats = selectedCategories.includes(ALL_CATEGORIES);

        const matched = products.filter((p) => {
            const matchSearch =
                !normalizedSearch ||
                p.title.toLowerCase().includes(normalizedSearch) ||
                p.category.toLowerCase().includes(normalizedSearch);
            const matchCat = isAllCats || selectedCategories.includes(p.category);
            const matchPrice = p.price <= priceRange;
            const matchStock = !inStockOnly || p.inStock !== false;
            return matchSearch && matchCat && matchPrice && matchStock;
        });

        if (sortOrder === "price-low") return [...matched].sort((a, b) => a.price - b.price);
        if (sortOrder === "price-high") return [...matched].sort((a, b) => b.price - a.price);
        if (sortOrder === "rating") return [...matched].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        return matched;
    }, [selectedCategories, priceRange, sortOrder, searchQuery, inStockOnly]);

    const clearFilters = () => {
        setSelectedCategories([ALL_CATEGORIES]);
        setPriceRange(maxProductPrice);
        setSortOrder("default");
        setInStockOnly(false);
        onClearSearch();
    };

    const hasActiveFilters =
        !selectedCategories.includes(ALL_CATEGORIES) ||
        priceRange < maxProductPrice ||
        sortOrder !== "default" ||
        searchQuery;

    return (
        <div className="w-full bg-white min-h-screen">
            {/* ── Page Header ── */}
            <section className="w-full bg-surface-soft border-b border-border-light py-7 px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1 block">
                            Our Collection
                        </span>
                        <h1 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">
                            All Products
                        </h1>
                        <p className="text-xs text-text-muted mt-1">
                            Showing {filteredProducts.length} of {products.length} products
                        </p>
                    </div>

                    {/* Mobile: sidebar toggle */}
                    <button
                        id="mobile-filter-btn"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-white text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                        </svg>
                        Filters
                        {hasActiveFilters && (
                            <span className="w-2 h-2 bg-accent rounded-full" />
                        )}
                    </button>
                </div>
            </section>

            {/* ── Main Layout: Sidebar + Grid ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-8">

                {/* ── LEFT SIDEBAR ── */}
                <aside
                    className={`${
                        isSidebarOpen ? "block" : "hidden"
                    } md:block w-full md:w-56 lg:w-60 shrink-0`}
                >
                    <div className="sticky top-20 space-y-6">

                        {/* Category Filter */}
                        <div>
                            <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wide">
                                Category
                            </h3>
                            <div className="space-y-2.5">
                                {categories.map((cat) => {
                                    const isActive = selectedCategories.includes(cat) ||
                                        (cat === ALL_CATEGORIES && selectedCategories.includes(ALL_CATEGORIES));
                                    return (
                                        <label
                                            key={cat}
                                            className="flex items-center justify-between cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <input
                                                    type="checkbox"
                                                    className="category-checkbox"
                                                    checked={isActive}
                                                    onChange={() => toggleCategory(cat)}
                                                    id={`cat-${cat}`}
                                                />
                                                <span className={`text-sm transition-colors ${isActive ? "text-primary font-semibold" : "text-text-secondary group-hover:text-primary"}`}>
                                                    {cat}
                                                </span>
                                            </div>
                                            <span className="text-xs text-text-muted">
                                                ({categoryCounts[cat]})
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className="border-t border-border-light pt-5">
                            <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wide">
                                Price Range
                            </h3>
                            <input
                                id="price-range-slider"
                                type="range"
                                min={minProductPrice}
                                max={maxProductPrice}
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full"
                                style={{
                                    background: `linear-gradient(to right, #e94560 0%, #e94560 ${((priceRange - minProductPrice) / (maxProductPrice - minProductPrice)) * 100}%, #e5e7eb ${((priceRange - minProductPrice) / (maxProductPrice - minProductPrice)) * 100}%, #e5e7eb 100%)`
                                }}
                            />
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-text-muted">₹{minProductPrice.toLocaleString("en-IN")}</span>
                                <span className="text-xs font-semibold text-accent">₹{priceRange.toLocaleString("en-IN")}</span>
                            </div>
                        </div>

                        {/* Availability Filter */}
                        <div className="border-t border-border-light pt-5">
                            <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wide">
                                Availability
                            </h3>
                            <div className="space-y-2.5">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-2.5">
                                        <input
                                            type="checkbox"
                                            className="category-checkbox"
                                            checked={!inStockOnly}
                                            onChange={() => setInStockOnly(false)}
                                            id="avail-all"
                                        />
                                        <span className={`text-sm ${!inStockOnly ? "text-primary font-semibold" : "text-text-secondary group-hover:text-primary"}`}>
                                            In Stock
                                        </span>
                                    </div>
                                    <span className="text-xs text-text-muted">({products.length})</span>
                                </label>
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-2.5">
                                        <input
                                            type="checkbox"
                                            className="category-checkbox"
                                            checked={false}
                                            onChange={() => {}}
                                            id="avail-out"
                                        />
                                        <span className="text-sm text-text-secondary group-hover:text-primary">
                                            Out of Stock
                                        </span>
                                    </div>
                                    <span className="text-xs text-text-muted">(0)</span>
                                </label>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="w-full py-2.5 text-sm font-semibold text-accent border border-accent/30 rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                </aside>

                {/* ── RIGHT: Sort Bar + Product Grid ── */}
                <div className="flex-1 min-w-0">

                    {/* Sort Bar */}
                    <div className="flex items-center justify-between mb-6 gap-3">
                        {searchQuery && (
                            <p className="text-sm text-text-secondary">
                                Results for <span className="font-semibold text-primary">"{searchQuery}"</span>
                            </p>
                        )}
                        <div className="ml-auto flex items-center gap-2">
                            <span className="text-sm text-text-muted hidden sm:block">Sort by</span>
                            <select
                                id="sort-select"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Products Grid / Empty State */}
                    {filteredProducts.length === 0 ? (
                        <div className="min-h-[300px] flex items-center justify-center text-center px-6">
                            <div className="max-w-sm animate-fade-in-up">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-soft flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold text-primary mb-2">No products found</h2>
                                <p className="text-sm text-text-secondary mb-5">
                                    Try adjusting your filters or search query.
                                </p>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-colors cursor-pointer"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                            {filteredProducts.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={onAddToCart}
                                    wishlist={wishlist}
                                    onToggleWishlist={onToggleWishlist}
                                    animationDelay={index < 8 ? `delay-${(index % 4 + 1) * 100}` : ""}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
