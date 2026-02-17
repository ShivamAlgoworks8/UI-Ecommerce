/**
 * HomePage
 * ────────
 * Premium half-bleed layout:
 *  1. Hero — left text constrained, right image full-bleed
 *  2. Featured products — full-width grid
 *  3. Promo banner — wide, no max-w
 *  4. Trust badges — full-width strip
 */

import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

export default function HomePage({ onAddToCart }) {
    const featuredProducts = products.slice(0, 4);

    return (
        <div>
            {/* ═══════════════════════════════════════════
          HERO — Half-Bleed Layout
          ═══════════════════════════════════════════ */}
            <section className="w-full relative overflow-hidden bg-surface-soft border-b border-border-light">
                <div className="absolute top-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-y-1/3 -translate-x-1/3" />

                <div className="grid lg:grid-cols-2 items-center">
                    {/* ── Left: Text Content ── */}
                    <div className="max-w-2xl mx-auto px-6 py-16 lg:py-20 animate-fade-in-up">
                        <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3 px-3 py-1 bg-accent/10 rounded-full">
                            New Collection 2026
                        </span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight text-primary mb-5">
                            Discover Your
                            <br />
                            <span className="text-accent">Perfect Style</span>
                        </h1>
                        <p className="text-base lg:text-lg text-text-secondary max-w-md mb-8 leading-relaxed">
                            Curated essentials for modern living. Explore our handpicked
                            collection of premium products designed to elevate your everyday.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98]"
                            >
                                Shop Collection
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link
                                to="/products"
                                className="inline-flex items-center px-7 py-3.5 border-2 border-primary/15 text-primary text-sm font-semibold rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                            >
                                Browse All
                            </Link>
                        </div>
                    </div>

                    {/* ── Right: Full-Bleed Image ── */}
                    <div className="w-full animate-fade-in-up delay-200">
                        <img
                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&h=600&fit=crop"
                            alt="Curated collection of modern essentials"
                            className="w-full h-[300px] sm:h-[380px] lg:h-[450px] object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          FEATURED PRODUCTS — Full Width
          ═══════════════════════════════════════════ */}
            <section className="w-full bg-white py-16 lg:py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-1 block">
                                Handpicked for you
                            </span>
                            <h2 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">
                                Featured Products
                            </h2>
                        </div>
                        <Link
                            to="/products"
                            className="mt-3 sm:mt-0 text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-200 flex items-center gap-1"
                        >
                            View All
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {featuredProducts.map((product, index) => (
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

            {/* ═══════════════════════════════════════════
          PROMO BANNER
          ═══════════════════════════════════════════ */}
            <section className="w-full bg-primary py-20 lg:py-24 text-center px-6">
                <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                    Upgrade Your Everyday
                </h2>
                <p className="text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed text-sm lg:text-base">
                    Free shipping on orders over $100. Hassle-free returns within 30 days.
                    Quality craftsmanship guaranteed.
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98]"
                >
                    Start Shopping
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </section>

            {/* ═══════════════════════════════════════════
          TRUST BADGES
          ═══════════════════════════════════════════ */}
            <section className="w-full bg-surface-soft border-t border-border-light py-12 lg:py-14 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {[
                            {
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                ),
                                title: "Free Shipping",
                                desc: "On all orders over $100",
                            },
                            {
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                ),
                                title: "Secure Payments",
                                desc: "SSL encrypted checkout",
                            },
                            {
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                ),
                                title: "Easy Returns",
                                desc: "30-day return policy",
                            },
                        ].map((badge) => (
                            <div
                                key={badge.title}
                                className="flex items-center gap-3 p-5 rounded-xl bg-white border border-border-light"
                            >
                                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                                    {badge.icon}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-primary text-sm">{badge.title}</h4>
                                    <p className="text-xs text-text-muted">{badge.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
